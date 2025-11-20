import { HookInterceptor, HookTriggerContext } from 'hookpoint';

import { ProcessorContext } from '../../../models';

export class LoggerFlushInterceptor implements HookInterceptor<[ProcessorContext], boolean> {
  id = 'loggerFlush';
  async afterLoop(hookContext: HookTriggerContext<[ProcessorContext], boolean>): Promise<boolean> {
    const context = hookContext.args[0];
    context?.scriptConsole?.flush?.();
    return true;
  }
}
