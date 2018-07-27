const path = require('path');
const fs = require('fs');
const { ipcMain: ipc, app } = require('electron');
const fetchNewReleases = require('./services/newReleases');
const checkLicense = require('./services/checkLicense');


class App {
  constructor(window) {
    this.window = window;

    const homePath = app.getPath('home');
    this.settingsFilePath = path.join(homePath, '.spitfire.settings.json');
    
    this.initIpcs();
  }

  initIpcs() {
    ipc.on('FETCH_NEW_RELEASES', this.fetchReleases.bind(this));
    ipc.on('VALIDATE_LICENSE_KEY', this.validateLicense.bind(this));
  }

  getLicense() {
    const settings = fs.readFileSync(this.settingsFilePath);
    const { licenseKey } = JSON.parse(settings);      
    return licenseKey;
  }

  handleLicenseValid(sender, licenseKey) {
    const settings = { licenseKey };        
    fs.writeFileSync(this.settingsFilePath, JSON.stringify(settings));
    this.window.setSize(1410, 690);        
    sender.send('VALIDATE_LICENSE_KEY_SUCCESS', licenseKey);
  }

  handleLicenseInvalid(sender) {
    sender.send('VALIDATE_LICENSE_KEY_FAILURE', error);
  }

  async fetchReleases({ sender }) {
    try {
      const payload = await fetchNewReleases();
      sender.send('NEW_RELEASES_SUCCESS', payload);
    } catch (error) {
      sender.send('NEW_RELEASES_FAILURE', error);
    }
  }

  async validateLicense({ sender }, licenseKey) {
    try {
      if (!licenseKey) {
        licenseKey = this.getLicense();
      }
      
      const response = await checkLicense(licenseKey);
      const { valid, detail } = response.data.meta;

      if (valid) {
        this.handleLicenseValid(sender, licenseKey);
      } else {
        this.handleLicenseInvalid(sender, detail);
      }

    } catch (error) {
      this.handleLicenseInvalid(sender, error);
    }
  }
}

module.exports = App;

