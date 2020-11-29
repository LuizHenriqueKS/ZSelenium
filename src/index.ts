import { By, Key, until, Builder } from 'selenium-webdriver';
import { ChildProcess, FsPaths, install, InstallOpts, start } from 'selenium-standalone';
import SeleniumServer from './core/SeleniumServer';
import './core/WebDriverExtended';

export {
  Builder,
  By,
  Key,
  until,
  SeleniumServer,
  ChildProcess,
  FsPaths,
  install,
  InstallOpts,
  start
};

module.exports = {
  Builder,
  By,
  Key,
  until,
  SeleniumServer,
  // ChildProcess,
  // FsPaths,
  install,
  // InstallOpts,
  start
};
