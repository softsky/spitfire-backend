const { ipcMain: ipc } = require('electron');

// just to make sure that IPC works well
ipc.on('PING', (event) => {
  event.sender.send('PONG', new Date().valueOf());
})
