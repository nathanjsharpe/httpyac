import { HttpyacHooksApi } from '../../../models';
import { BailOnFailedTestInterceptor } from './bailOnFailedTestInterceptor';
import { LoggerFlushInterceptor } from './loggerFlushInterceptor';
import { TestExitCodeInterceptor } from './testExitCodeInterceptor';

export function createCliPluginRegister(bail: boolean) {
  return function registerCliPlugin(api: HttpyacHooksApi) {
    api.hooks.execute.addInterceptor(new LoggerFlushInterceptor());
    api.hooks.execute.addInterceptor(new TestExitCodeInterceptor());
    if (bail) {
      api.hooks.execute.addInterceptor(new BailOnFailedTestInterceptor());
    }
  };
}
