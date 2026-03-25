import { WebPlugin } from '@capacitor/core';

import type { ContentsquareNativePlugin, DynamicVarItem, PIIConfig, TelemetryItem, TransactionItem } from './definitions';

export class ContentsquareWeb extends WebPlugin implements ContentsquareNativePlugin {
  async optIn(): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async optOut(): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendScreenName(_options: { name: string }): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendTransaction(_transactionItem: TransactionItem): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendDynamicVarWithStringValue(_dynamicVarItem: DynamicVarItem): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendDynamicVarWithIntValue(_dynamicVarItem: DynamicVarItem): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async onReady(): Promise<void> {
    return;
  }

  async excludeURLForReplay(_options: { url: string }): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async setPIISelectors(_pii: PIIConfig): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async setCapturedElementsSelector(_options: { elements: string }): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async collect(_telemetryItem: TelemetryItem): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }
}
