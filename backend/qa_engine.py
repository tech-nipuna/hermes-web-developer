#!/usr/bin/env python3
import sys, os, json, time, socket, http.server, threading, subprocess, base64, re
from http.server import SimpleHTTPRequestHandler
from urllib.parse import quote

def log(msg):
    print(json.dumps(msg), flush=True)

def find_free_port(start=8765):
    for port in range(start, start + 200):
        try:
            s = socket.socket()
            s.bind(("127.0.0.1", port))
            s.close()
            return port
        except OSError:
            continue
    return None

def start_static_server(folder, port):
    os.chdir(folder)
    server = http.server.HTTPServer(("127.0.0.1", port), SimpleHTTPRequestHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    return server

def get_html_files(folder):
    files = []
    for root, dirs, fnames in os.walk(folder):
        for f in fnames:
            if f.endswith(".html"):
                files.append(os.path.relpath(os.path.join(root, f), folder))
    return sorted(files)

def write_pw_script(f, url, screenshot_path, vw, vh):
    f.write("import asyncio, json\n")
    f.write("from playwright.async_api import async_playwright\n")
    f.write("async def main():\n")
    f.write("    async with async_playwright() as p:\n")
    f.write("        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])\n")
    f.write("        page = await browser.new_page(viewport={'width': %d, 'height': %d})\n" % (vw, vh))
    f.write("        js_errors = []\n")
    f.write("        page.on('pageerror', lambda e: js_errors.append(str(e)[:200]))\n")
    f.write("        try:\n")
    f.write("            await page.goto('%s', wait_until='domcontentloaded', timeout=15000)\n" % url)
    f.write("        except Exception as e1:\n")
    f.write("            print(json.dumps({'error': str(e1)}))\n")
    f.write("            return\n")
    f.write("        await page.wait_for_timeout(2000)\n")
    f.write("        await page.screenshot(path='%s', full_page=True)\n" % screenshot_path)
    f.write("        imgs = await page.query_selector_all('img')\n")
    f.write("        broken = 0\n")
    f.write("        missing_alt = 0\n")
    f.write("        broken_srcs = []\n")
    f.write("        for img in imgs:\n")
    f.write("            if not await img.evaluate('el => el.complete'): broken += 1\n")
    f.write("            elif await img.evaluate('el => el.naturalWidth') == 0: broken += 1\n")
    f.write("            else:\n")
    f.write("                src = await img.get_attribute('src')\n")
    f.write("                if src: broken_srcs.append(src)\n")
    f.write("            if not await img.get_attribute('alt'): missing_alt += 1\n")
    f.write("        bw = await page.evaluate('() => document.body ? document.body.scrollWidth : 0')\n")
    f.write("        vw_i = await page.evaluate('() => window.innerWidth')\n")
    f.write("        has_vp = await page.evaluate('() => !!document.querySelector(\"meta[name=viewport]\")')\n")
    f.write("        r = {'broken_imgs': broken, 'broken_srcs': broken_srcs[:5], 'missing_alt': missing_alt, 'total_imgs': len(imgs), 'body_width': int(bw), 'viewport_width': int(vw_i), 'overflow': int(bw) > int(vw_i) + 5, 'has_viewport': has_vp, 'js_errors': js_errors}\n")
    f.write("        print(json.dumps(r))\n")
    f.write("asyncio.run(main())\n")

def ai_vision_check(screenshot_path, url, page_issues, config):
    provider = config.get("ai_provider", "openrouter")
    model = config.get("ai_model", "openai/gpt-4o-mini")
    img_b64 = base64.b64encode(open(screenshot_path, "rb").read()).decode()
    sprompt = "You analyze webpage screenshots for QA issues (layout, text, visual, UX, responsive). Respond ONLY with JSON: {\"issues\":[{\"severity\":\"high|medium|low\",\"category\":\"layout|text|visual|ux|responsive\",\"description\":\"brief\",\"location\":\"where\"}],\"summary\":\"1 sentence\",\"score\":0-10}"
    uprompt = "Automated checks found %d issues. Identify additional visual/layout/text problems in this screenshot." % len(page_issues)
    try:
        if provider == "ollama":
            return call_ollama(img_b64, sprompt, uprompt, model, config)
        return call_openrouter(img_b64, sprompt, uprompt, model, config)
    except Exception as e:
        return {"issues": [], "summary": "AI failed: " + str(e), "score": 0}

def call_openrouter(img_b64, sp, up, model, config):
    import urllib.request
    key = os.environ.get("OPENROUTER_API_KEY", "") or config.get("openRouterKey", "")
    if not key:
        return {"issues": [], "summary": "No API key", "score": 0}
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": sp},
            {"role": "user", "content": up, "images": [{"type": "image_url", "image_url": {"url": "data:image/png;base64," + img_b64}}]}
        ], "max_tokens": 1000,
    }).encode()
    req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=payload,
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read())
    content = data["choices"][0]["message"]["content"]
    try:
        m = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', content, re.DOTALL)
        return json.loads(m.group()) if m else {"issues": [], "summary": content[:200], "score": 5}
    except:
        return {"issues": [], "summary": content[:200], "score": 5}

def call_ollama(img_b64, sp, up, model, config):
    import urllib.request
    bu = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": sp},
            {"role": "user", "content": up, "images": [img_b64]}
        ],
         "stream": False,
        "options": {"temperature": 0.2}
    }).encode()
    req = urllib.request.Request(bu + "/api/chat", data=payload,
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
        content = data.get("message", {}).get("content", "")
        try:
            m = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', content, re.DOTALL)
            return json.loads(m.group()) if m else {"issues": [], "summary": content[:200], "score": 5}
        except:
            return {"issues": [], "summary": content[:200], "score": 5}
    except Exception as e:
        return {"issues": [], "summary": "Ollama: " + str(e), "score": 0}

def main():
    if len(sys.argv) < 3:
        sys.exit(1)
    folder = sys.argv[1]
    config = json.loads(sys.argv[2])
    if not os.path.isdir(folder):
        log({"type": "error", "message": "Not found: " + folder})
        sys.exit(1)
    port = find_free_port(8765)
    ss_dir = os.path.join(folder, ".qa-screenshots")
    os.makedirs(ss_dir, exist_ok=True)
    server = start_static_server(folder, port)
    log({"type": "server_started", "port": port})
    hfs = get_html_files(folder)
    if not hfs:
        log({"type": "error", "message": "No HTML files"})
        server.shutdown()
        sys.exit(1)
    log({"type": "files_found", "files": hfs, "total": len(hfs)})
    results = []
    for i, hf in enumerate(hfs):
        url = "http://127.0.0.1:%d/%s" % (port, quote(hf))
        sp = os.path.join(ss_dir, "page_%d.png" % i)
        log({"type": "page_start", "file": hf, "index": i, "url": url})
        try:
            # Write playwright script
            vw = config.get("viewport_w", 1280)
            vh = config.get("viewport_h", 800)
            pw_file = os.path.join(ss_dir, "_pw_gen.py")
            with open(pw_file, "w") as f:
                write_pw_script(f, url, sp, vw, vh)
            r = subprocess.run([sys.executable, pw_file], capture_output=True, text=True, timeout=45)
            os.unlink(pw_file)
            pd = {}
            if r.stdout.strip():
                try:
                    info = json.loads(r.stdout.strip())
                    issues = []
                    for src in info.get("broken_srcs", []):
                        issues.append({"type": "broken_image", "src": src})
                    if info.get("missing_alt", 0) > 0:
                        issues.append({"type": "missing_alt", "count": info["missing_alt"]})
                    if info.get("overflow"):
                        issues.append({"type": "horizontal_overflow", "body_width": info["body_width"], "viewport": info["viewport_width"]})
                    if not info.get("has_viewport"):
                        issues.append({"type": "missing_viewport"})
                    for err in info.get("js_errors", []):
                        issues.append({"type": "js_error", "message": err})
                    info["issues"] = issues
                    pd = info
                except:
                    pass
            ai = ai_vision_check(sp, url, pd.get("issues", []), config)
            c = {"type": "page_result", "file": hf, "url": url, "screenshot": sp,
                 "rule_issues": pd.get("issues", []), "ai_result": ai,
                 "metrics": {"total_elements": 0, "total_images": pd.get("total_imgs", 0),
                            "body_width": pd.get("body_width", 0)}, "index": i}
            results.append(c)
            log(c)
        except Exception as e:
            log({"type": "page_error", "file": hf, "error": str(e)})
    tr = sum(len(r.get("rule_issues", [])) for r in results)
    ta = sum(len(r.get("ai_result", {}).get("issues", [])) for r in results)
    sc = [r.get("ai_result", {}).get("score", 0) for r in results]
    avg = sum(sc) / len(sc) if sc else 0
    log({"type": "complete", "total_pages": len(results), "total_rule_issues": tr,
         "total_ai_issues": ta, "avg_score": round(avg, 1), "results": results})
    server.shutdown()

if __name__ == "__main__":
    main()
