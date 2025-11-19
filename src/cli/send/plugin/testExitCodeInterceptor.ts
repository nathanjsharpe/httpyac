import { HookInterceptor, HookTriggerContext } from 'hookpoint';

import { ProcessorContext, TestResultStatus } from '@/models';

export class TestExitCodeInterceptor implements HookInterceptor<[ProcessorContext], boolean> {
  id = 'testExitCode';

  async onError(): Promise<boolean> {
    process.exitCode = 10;
    return true;
  }

  async afterTrigger(hookContext: HookTriggerContext<[ProcessorContext], boolean>) {
    const context = hookContext.args[0];

    if (context.httpRegion.testResults === undefined) {
      return true;
    }

    let hasErroredTestResult = false;
    let hasFailedTestResult = false;

    for (const testResult of context.httpRegion.testResults) {
      if (testResult.status === TestResultStatus.ERROR) {
        hasErroredTestResult = true;
        break;
      }
      if (testResult.status === TestResultStatus.FAILED) {
        hasFailedTestResult = true;
      }
    }

    if (hasErroredTestResult) {
      process.exitCode = 19;
    } else if (hasFailedTestResult) {
      process.exitCode = 20;
    }

    return true;
  }
}
