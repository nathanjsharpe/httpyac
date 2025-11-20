import { HookInterceptor, HookTriggerContext } from 'hookpoint';

import { ProcessorContext, TestResultStatus } from '../../../models';
import { addSkippedTestResult } from '../../../utils';

let bailInBeforeLoop = false;

export class BailOnFailedTestInterceptor implements HookInterceptor<[ProcessorContext], boolean> {
  id = 'bailOnFailed';

  async beforeLoop(hookContext: HookTriggerContext<[ProcessorContext], boolean>): Promise<boolean> {
    if (bailInBeforeLoop) {
      const [context] = hookContext.args;
      addSkippedTestResult(context.httpRegion, 'request skipped because of bail');
      return false;
    }
    return true;
  }

  async onError() {
    bailInBeforeLoop = true;
    return true;
  }

  async afterTrigger(hookContext: HookTriggerContext<[ProcessorContext], boolean>) {
    const context = hookContext.args[0];
    const failedTest = context.httpRegion.testResults?.find?.(obj => [TestResultStatus.FAILED].includes(obj.status));
    if (failedTest) {
      bailInBeforeLoop = true;
    }
    return true;
  }
}
