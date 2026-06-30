const { app, BrowserWindow, ipcMain, dialog, Menu, Tray } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const fs = require('fs');

let mainWindow = null;
let qaProcess = null;

function createWindow() {
  const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    title: 'Web QA Agent',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    backgroundColor: '#111827',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Disable default menu (cleaner look)
  Menu.setApplicationMenu(null);

  // Load Vite dev server in dev, built files in prod
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (qaProcess) qaProcess.kill();
  });
}

function startBackend(folderPath, config) {
  if (qaProcess) qaProcess.kill();

  const scriptPath = path.join(__dirname, '..', 'backend', 'qa_engine.py');
  const isPackaged = app.isPackaged;
  const resPath = (process as any).resourcesPath || '';
  const pythonBin = isPackaged && resPath
    ? path.join(resPath, 'backend', '.venv', 'bin', 'python3')
    : path.join(__dirname, '..', 'backend', '.venv', 'bin', 'python3');
  const fallbackPython = 'python3';
  const pyExe = fs.existsSync(pythonBin) ? pythonBin : fallbackPython;

  const configStr = JSON.stringify(config);

  qaProcess = spawn(pyExe, ['-u', scriptPath, folderPath, configStr], {
    env: {
      ...process.env,
      OPENROUTER_API_KEY: config.openRouterKey || process.env.OPENROUTER_API_KEY || '',
      OLLAMA_BASE_URL: config.ollamaUrl || 'http://localhost:11434',
    },
  });

  qaProcess.stdout.on('data', (data) => {
    const text = data.toString();
    text.split('\n').forEach((line) => {
      if (!line.trim()) return;
      try {
        const msg = JSON.parse(line);
        mainWindow?.webContents.send('qa-event', msg);
      } catch {
        mainWindow?.webContents.send('qa-log', line);
      }
    });
  });

  qaProcess.stderr.on('data', (data) => {
    mainWindow?.webContents.send('qa-error', data.toString());
  });

  qaProcess.on('close', (code) => {
    mainWindow?.webContents.send('qa-finished', { code });
  });

  qaProcess.on('error', (err) => {
    mainWindow?.webContents.send('qa-error', 'Failed to start backend: ' + err.message);
  });
}

// IPC handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('start-qa', async (_e, folderPath, config) => {
  if (!folderPath || !config) return { ok: false, error: 'Missing params' };
  startBackend(folderPath, config);
  return { ok: true, pid: qaProcess?.pid };
});

ipcMain.on('stop-qa', () => {
  if (qaProcess) {
    qaProcess.kill();
    qaProcess = null;
  }
});

ipcMain.handle('get-screenshot', async (_e, filePath) => {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath).toString('base64');
  }
  return null;
});

ipcMain.handle('export-results', async (_e, results) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: 'qa-report.json',
    filters: [
      { name: 'JSON', extensions: ['json'] },
      { name: 'HTML', extensions: ['html'] },
    ],
  });
  if (result.canceled) return null;
  const ext = path.extname(result.filePath);
  let content;
  if (ext === '.html') {
    content = generateHTMLReport(JSON.parse(results));
  } else {
    content = results;
  }
  fs.writeFileSync(result.filePath, content);
  return result.filePath;
});

function generateHTMLReport(data) {
  const results = data.results || data;
  let html = `<html><head><title>QA Report</title>
<style>
body{font-family:system-ui;max-width:1200px;margin:40px auto;padding:0 20px;background:#1a1a2e;color:#eee}
h1{color:#60a5fa} .page{border:1px solid #333;border-radius:12px;padding:20px;margin:20px 0;background:#16213e}
.issue{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #222}
.sev-high{color:#ef4444} .sev-medium{color:#f59e0b} .sev-low{color:#60a5fa}
.score{font-size:24px;font-weight:bold;color:#22c55e}
img{max-width:300px;border-radius:8px;margin:10px 0}
</style></head><body><h1>Web QA Agent Report</h1>`;
  html += '<p>Generated: ' + new Date().toLocaleString() + '</p>';
  html += '<p>Total pages: ' + results.length + '</p>';
  for (const r of results) {
    html += '<div class="page"><h2>' + r.file + '</h2>';
    html += '<img src="file://' + r.screenshot + '" />';
    if (r.ai_result && r.ai_result.score !== undefined) {
      html += '<div class="score">Score: ' + r.ai_result.score + '/10</div>';
    }
    if (r.ai_result && r.ai_result.summary) {
      html += '<p><em>' + r.ai_result.summary + '</em></p>';
    }
    if (r.rule_issues && r.rule_issues.length) {
      html += '<h3>Rule Issues</h3>';
      for (const iss of r.rule_issues) {
        html += '<div class="issue">[' + (iss.type || '') + '] ' + (iss.src || iss.message || iss.text || '') + '</div>';
      }
    }
    if (r.ai_result && r.ai_result.issues && r.ai_result.issues.length) {
      html += '<h3>AI Findings</h3>';
      for (const iss of r.ai_result.issues) {
        html += '<div class="issue sev-' + iss.severity + '">[' + iss.category + '] ' + iss.description + ' <small>(' + (iss.location || '') + ')</small></div>';
      }
    }
    html += '</div>';
  }
  html += '</body></html>';
  return html;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (qaProcess) qaProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
