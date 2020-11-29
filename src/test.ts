import { By, SeleniumServer } from './index';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.urlencoded());

const page = `<html>
<body>
  <form action='/' method='post'>
    <div style='width: 200px'>Expression: </div>
    <input type='text' name='expression' value='{expression}'/>
    <input type='submit' value='Calc'/>
    <br/><br/>
    <div style='width: 200px'>Result: </div>
    <input type='text' name='result' value='{result}'/>
  </form>
</body>
</html>
`;

app.get('/', (req: express.Request, res: express.Response) => {
  res.send(page.replace('{result}', '').replace('{expression}', ''));
});

app.post('/', (req: express.Request, res: express.Response) => {
  // eslint-disable-next-line no-eval
  res.send(page.replace('{result}', eval(req.body.expression)).replace('{expression}', req.body.expression));
});

app.listen(port, () => {
  console.log(`Servidor de teste iniciado na porta: ${port}`);
});

(async function () {
  const seleniumServer = new SeleniumServer();
  await seleniumServer.installIfNeed(() => console.log('Download selenium server...'));
  await seleniumServer.start();
  const driver = await seleniumServer.builder().forBrowser('chrome').build();
  try {
    await driver.get(`http://localhost:${port}`);
    await driver.findElement(By.name('expression')).sendKeys('1 + 2');
    await (await driver.findElement(By.css('input[type=submit]'))).click();
    await driver.sleep(1000);
    const result = await (await driver.waitElement(By.name('result'))).getAttribute('value');
    if (result === '3') {
      console.log('Test: OK');
    } else {
      // eslint-disable-next-line no-throw-literal
      throw `Test: Invalid value: ${result}`;
    }
  } catch (e) {
    console.error(e);
  } finally {
    await seleniumServer.close();
    process.exit();
  }
})();
