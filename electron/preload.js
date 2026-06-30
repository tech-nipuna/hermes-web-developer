const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  startQA: (folderPath, config) => ipcRenderer.invoke('start-qa', folderPath, config),
  stopQA: () => ipcRenderer.send('stop-qa'),
  getScreenshot: (filePath) => ipcRenderer.invoke('get-screenshot', filePath),
  onQAEvent: (cb) => ipcRenderer.on('qa-event', (_e, data) => cb(data)),
  onQALog: (cb) => ipcRenderer.on('qa-log', (_e, data) => cb(data)),
  onQAError: (cb) => ipcRenderer.on('qa-error', (_e, data) => cb(data)),
  onQAFinished: (cb) => ipcRenderer.on('qa-finished', (_e, data) => cb(data)),
});
