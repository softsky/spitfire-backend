const path = require('path');
const url = require('url');
const fs = require('fs');
const { ipcMain: ipc, app, BrowserWindow } = require('electron');
const fetchNewReleases = require('./services/newReleases');
const checkLicense = require('./services/checkLicense');

const delay = ms => new Promise(res => setTimeout(res, ms));

class App {
  constructor() {
    const homePath = app.getPath('home');

    this.windowBg = '#1c1e27'; // TODO: use constants
    this.settingsFilePath = path.join(homePath, '.spitfire.settings.json');
    this.preloaderPageUrl = this.createFileUrl(path.join(__dirname, '..' ,'frontend/preloader/index.html'));    
    this.welcomePageUrl = this.createFileUrl(path.join(__dirname, '..', 'frontend/welcome/index.html'));

    this.mainPageUrl = (
      process.env.ELECTRON_START_URL
      || this.createFileUrl(path.join(__dirname, '..', 'frontend/main/index.html'))
    );

    this.createPreloaderWindow();
    this.checkLicense();
    this.initIpcs();
  }

  createFileUrl(pathname) {
    return url.format({
      pathname,
      protocol: 'file:',
      slashes: true,
    });
  }

  hasWindow() {
    return Boolean(
      this.preloaderWindow
      || this.welcomeWindow
      || this.mainWindow
    );
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

  createPreloaderWindow() {
    this.preloaderWindow = new BrowserWindow({
      width: 300,
      height: 300,
      frame: false,
      backgroundColor: this.windowBg,
    });
    
    this.preloaderWindow.setResizable(false);
    this.preloaderWindow.loadURL(this.preloaderPageUrl);
    this.preloaderWindow.on('closed', () => this.preloaderWindow = null);
    // Open the DevTools.
    // this.preloaderWindow.webContents.openDevTools();
  }

  openWelcomePage() {    
    this.welcomeWindow = new BrowserWindow({
      width: 1155,
      height: 690,
      frame: false,
      backgroundColor: this.windowBg,
    });

    this.welcomeWindow.setResizable(false);
    this.welcomeWindow.loadURL(this.welcomePageUrl);
    this.welcomeWindow.on('closed', () => this.welcomeWindow = null);
  }

  openMainPage() {
    this.mainWindow = new BrowserWindow({
      width: 1410,
      height: 690,
      frame: false,
      backgroundColor: this.windowBg,
    });

    this.mainWindow.setResizable(false);
    this.mainWindow.loadURL(this.mainPageUrl);
    this.mainWindow.on('closed', () => this.mainWindow = null);
  }

  async checkLicense() {
    try {
      // it helps to make a better UX
      await delay(200);      
      const licenseKey = this.getLicense();      
      const response = await checkLicense(licenseKey);
      const { valid } = response.data.meta;

      if (valid) {
        this.openMainPage();
      } else {
        this.openWelcomePage();
      }
    } catch (error) {
      this.openWelcomePage();
    }

    this.preloaderWindow.close();
  }

  handleLicenseValid(sender, licenseKey) {
    const settings = { licenseKey };        
    fs.writeFileSync(this.settingsFilePath, JSON.stringify(settings));
    sender.send('VALIDATE_LICENSE_KEY_SUCCESS', licenseKey);
    
    if (this.welcomeWindow) {
      this.welcomeWindow.close();
    }
    
    this.openMainPage();
  }

  handleLicenseInvalid(sender, error) {
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

