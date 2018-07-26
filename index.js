const { ipcMain: ipc } = require('electron');
const newReleases = require('./mock/newReleases');


ipc.on('FETCH_NEW_RELEASES', (event) => {
  event.sender.send('NEW_RELEASES', newReleases);
})

