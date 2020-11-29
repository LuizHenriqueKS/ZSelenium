import path from 'path';
import fs from 'fs';
import { ChildProcess, FsPaths, install, InstallOpts, start, Builder } from '..';
import AlreadyStartedException from '../exception/AlreadyStartedException';
import ServerNotStartedException from '../exception/ServerNotStartedException';
import { StartOpts } from 'selenium-standalone';

class SeleniumServer {
  process?: ChildProcess;
  address?: string;

  isInstalled(): boolean {
    return fs.existsSync(this.getFsPathsFile());
  }

  install(opts?: InstallOpts): Promise<FsPaths> {
    return new Promise((resolve, reject) => {
      install((error: Error | undefined, fsPaths: FsPaths) => {
        if (error) {
          reject(error);
        } else {
          this.saveFsPaths(opts, fsPaths);
          resolve(fsPaths);
        }
      });
    });
  }

  async installIfNeed(beforeInstall?: () => void, opts?: InstallOpts): Promise<FsPaths> {
    if (this.isInstalled()) {
      return this.loadFsPaths(opts);
    } else {
      if (beforeInstall) beforeInstall();
      return await this.install(opts);
    }
  }

  start(opts?: StartOpts): Promise<ChildProcess> {
    this.requireNonStarted();
    return new Promise((resolve, reject) => {
      const cb = async (error: Error | null, selenium: ChildProcess) => {
        if (error) {
          reject(error);
        } else {
          this.process = selenium;
          await this.captureAddress();
          resolve(selenium);
        }
      };
      if (opts) {
        start(opts, cb);
      } else {
        start(cb);
      }
    });
  }

  close(): boolean {
    if (this.process) {
      return this.process.kill();
    } else {
      throw new ServerNotStartedException();
    }
  }

  builder(): Builder {
    if (this.address) {
      return new Builder().usingServer(this.address);
    } else {
      throw new ServerNotStartedException();
    }
  }

  private async captureAddress(): Promise<void> {
    const it = this;
    return new Promise((resolve, reject) => {
      this.process!.stderr!.on('data', function (data) {
        const text: string = data.toString();
        const matchResult = (/Server on port (\d+)/g).exec(text);
        if (matchResult) {
          const port = matchResult[1];
          it.address = `http://localhost:${port}/wd/hub`;
          resolve();
        }
      });
    });
  };

  private requireNonStarted() {
    if (process && process.connected) {
      throw new AlreadyStartedException();
    }
  }

  private loadFsPaths(opts?: InstallOpts): FsPaths {
    const content = fs.readFileSync(this.getFsPathsFile());
    return content.toJSON();
  }

  private saveFsPaths(opts: InstallOpts | undefined, fsPaths: FsPaths): void {
    fs.writeFileSync(this.getFsPathsFile(), JSON.stringify(fsPaths));
  }

  private getFsPathsFile(): string {
    return path.join(require.resolve('selenium-standalone'), '../.selenium/fsPaths.json');
  }
}

export default SeleniumServer;
