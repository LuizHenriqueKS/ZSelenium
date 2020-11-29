# Description

Simplify the use of selenium with javascript and typescript

# How to install

```
npm i z-selenium

```

# New features

`SeleniumServer`

`SeleniumServer.installIfNeed`

`SeleniumServer.close`

`WebDriver.waitElement`

`WebDriver.waitElements`

# Examples

TypeScript
```typescript
import { SeleniumServer, By, Key } from 'z-selenium';

(async function () {
  const seleniumServer = new SeleniumServer();
  await seleniumServer.installIfNeed(() => {
    console.log('Download selenium server...');
  });
  await seleniumServer.start();
  const driver = await seleniumServer.builder().forBrowser('chrome').build();
  try {
    await driver.get('http://www.google.com/');
    await driver.findElement(By.name('q')).sendKeys('1 + 2', Key.RETURN);
    const el = await driver.waitElement(By.id('cwos'), 3000);
    const result = await el.getText();
    if (result === '3') {
      console.log('Test: OK');
    } else {
      console.error('Test: Invalid value', result);
    }
  } finally {
    await driver.quit();
    seleniumServer.close(); // OPTIONAL
  }
})();
```


JavaScript
```javascript
const { SeleniumServer, By, Key } = require('z-selenium');

(async function () {
  const seleniumServer = new SeleniumServer();
  await seleniumServer.installIfNeed(() => {
    console.log('Download selenium server...');
  });
  await seleniumServer.start();
  const driver = await seleniumServer.builder().forBrowser('chrome').build();
  try {
    await driver.get('http://www.google.com/');
    await driver.findElement(By.name('q')).sendKeys('1 + 2', Key.RETURN);
    const el = await driver.waitElement(By.id('cwos'), 3000);
    const result = await el.getText();
    if (result === '3') {
      console.log('Test: OK');
    } else {
      console.error('Test: Invalid value', result);
    }
  } finally {
    await driver.quit();
    seleniumServer.close(); // OPTIONAL
  }
})();
```

# Dependencies

https://www.npmjs.com/package/selenium-standalone

https://www.npmjs.com/package/selenium-webdriver