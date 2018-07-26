const { ipcMain: ipc } = require('electron');
const fetchNewReleases = require('./services/newReleases');


ipc.on('FETCH_NEW_RELEASES', async ({ sender }) => {
  try {
    const payload = await fetchNewReleases();
    sender.send('NEW_RELEASES_SUCCESS', payload);
  } catch (error) {
    sender.send('NEW_RELEASES_FAILURE', error);
  }
})

