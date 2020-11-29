import { Locator, until, WebDriver, WebElement, WebElementPromise } from 'selenium-webdriver';

declare module 'selenium-webdriver' {
  export interface WebDriver {

    waitElement(locator: Locator, optTimeout?: number): WebElementPromise;
    waitElements(locator: Locator, optTimeout?: number): Promise<WebElement[]>;

  }
}

WebDriver.prototype.waitElement = function (locator: Locator, optTimeout?: number): WebElementPromise {
  const webdriver: WebDriver = this;
  return new WebElementPromise(webdriver, new Promise<WebElement>((resolve, reject) => {
    webdriver.wait(until.elementLocated(locator), optTimeout).then(() => {
      webdriver.findElement(locator).then(resolve).catch(reject);
    }).catch(reject);
  }));
};

WebDriver.prototype.waitElements = function (locator: Locator, optTimeout?: number): Promise<WebElement[]> {
  const webdriver: WebDriver = this;
  return new Promise<WebElement[]>((resolve, reject) => {
    webdriver.wait(until.elementLocated(locator), optTimeout).then(() => {
      webdriver.findElements(locator).then(resolve).catch(reject);
    }).catch(reject);
  });
};
