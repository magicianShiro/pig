// import { Context, IDefaultCtx } from '../index'
import defaultConfig, { Config } from '../config'

export interface Context {
  onerror: (err: Error) => void
  respond: (ctx: Context) => void
  rootPath: string;
  targetPath: string;
  // template: string;
  compareOrigin?: {
    [key: string]: string
  };
  compareOriginFile?: string;
  // compareTemplate: string;
  lackTemplate: string,
  extraTemplate: string,
  allTemplate: string,
  extname: string[];
  ignoreDir: string[];
  output: {
    filename: string;
    dirpath: string;
  };
  chineseMap: {
    [key: string]: string[];
  };
  outputData: string;
  compareData?: string;
  config: Config
}

type IMiddleWare = (ctx: Context, next?: any) => Promise<any>

class Pig {
  private middleware: Array<IMiddleWare> = []

  private createContext(): Context {
    return {
      onerror: (err) => console.log(err),
      respond: (ctx) => console.log('结束'),
      rootPath: '',
      targetPath: '',
      // template: '',
      compareOrigin: {},
      // compareTemplate: '',
      lackTemplate: '',
      extraTemplate: '',
      allTemplate: '',
      extname: [],
      ignoreDir: [],
      output: {
        filename: '',
        dirpath: '',
      },
      chineseMap: {},
      outputData: '',
      compareData: '',
      config: defaultConfig
    }
  }

  private handleRequest(ctx: Context,  fnMiddleware: IMiddleWare) {
    const onerror = (err: Error) => ctx.onerror(err);
    const handleResponse = () => ctx.respond(ctx)
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
  private callback() {
    const fn = this.compose(this.middleware);
    const ctx = this.createContext();
    return this.handleRequest(ctx, fn);
  }
  private compose (middleware: Array<IMiddleWare>) {
    return function (context: Context, next?: any) {
      let index = -1
      return dispatch(0)
      function dispatch (i: number) {
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))
        index = i
        let fn = middleware[i]
        if (i === middleware.length) fn = next
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, function next () {
            return dispatch(i + 1)
          }))
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }
  use(fn: IMiddleWare) {
    this.middleware.push(fn);
    return this;
  }
  exec() {
    return this.callback()
  }
}

export default Pig