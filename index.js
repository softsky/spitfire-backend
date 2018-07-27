const path = require('path');
const fs = require('fs');
const { ipcMain: ipc, app } = require('electron');
const fetchNewReleases = require('./services/newReleases');
const checkLicense = require('./services/checkLicense');


class App {
  constructor(window) {
    this.window = window;

    const homePath = app.getPath('home')
    this.settingsFilePath = path.join(homePath, '.spitfire.settings.json');
    
    this.initIpcs();
  }

  getLicense() {
    const settings = fs.readFileSync(this.settingsFilePath);
    const { licenseKey } = JSON.parse(settings);      
    return licenseKey;
  }

  initIpcs() {
    ipc.on('FETCH_NEW_RELEASES', async ({ sender }) => {
      try {
        const payload = await fetchNewReleases();
        sender.send('NEW_RELEASES_SUCCESS', payload);
      } catch (error) {
        sender.send('NEW_RELEASES_FAILURE', error);
      }
    });

    ipc.on('VALIDATE_LICENSE_KEY', async ({ sender }, licenseKey) => {
      try {
        if (!licenseKey) {
          licenseKey = await this.getLicense();
        }
        
        const payload = checkLicense(licenseKey);
        const settings = { licenseKey };
        
        fs.writeFileSync(this.settingsFilePath, JSON.stringify(settings));
        this.window.setSize(1410, 690);
        
        sender.send('VALIDATE_LICENSE_KEY_SUCCESS', payload);
      } catch (error) {
        console.log('error', error);
        sender.send('VALIDATE_LICENSE_KEY_FAILURE', error);
      }
    });
  }
}

module.exports = App;

