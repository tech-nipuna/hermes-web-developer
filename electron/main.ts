const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const net = require('net');
const fs = require('fs');

let mainWindow = null;
let qaProcess = null;
let backendReady = false;

// Find free port
function findFreePort(start) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(start, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => resolve(findFreePort(start + 1)));
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Web QA Agent',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:5173');
}

function startBackend(folderPath: string, config: object) {
  if (qaProcess) qaProcess.kill();

  const scriptPath = path.join(__dirname, '..', 'backend', 'qa_engine.py');
  const configStr = JSON.stringify(config);

  const venvPython = path.join(__dirname, '..', 'backend', '.venv', 'bin', 'python3');
  const pythonBin = fs.existsSync(venvPython) ? venvPython : 'python3';
  qaProcess = spawn(pythonBin, ['-u', scriptPath, folderPath, configStr], {
    env: {
    ...process.env,
    OPENROUTER_API_KEY: (config as any).openRouterKey || process.env.OPENROUTER_API_KEY || '',
    OLLAMA_BASE_URL: (config as any).ollamaUrl || 'http://localhost:11434',
    },
  });

  qaProcess.stdout.on('data', (data: Buffer) => {
    const text = data.toString();
    text.split('\n').forEach((line: string) => {
      if (!line.trim()) return;
      try {
        const msg = JSON.parse(line);
        mainWindow?.webContents.send('qa-event', msg);
      } catch {
        mainWindow?.webContents.send('qa-log', line);
      }
    });
  });

  qaProcess.stderr.on('data', (data: Buffer) => {
    mainWindow?.webContents.send('qa-error', data.toString());
  });

  qaProcess.on('close', (code: number) => {
    mainWindow?.webContents.send('qa-finished', { code });
  });
}

// IPC handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('start-qa', async (_e, folderPath: string, config: object) => {
  startBackend(folderPath, config);
  return { ok: true };
});

ipcMain.on('stop-qa', () => {
  if (qaProcess) qaProcess.kill();
});

ipcMain.handle('get-screenshot', async (_e, filePath: string) => {
  const fs = require('fs');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath).toString('base64');
  }
  return null;
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (qaProcess) qaProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
