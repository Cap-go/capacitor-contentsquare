import { WebPlugin } from '@capacitor/core';

import type {
  ContentsquareNativePlugin,
  DynamicVarItem,
  PIIConfig,
  TelemetryItem,
  TransactionItem,
} from './definitions';

export class ContentsquareWeb extends WebPlugin implements ContentsquareNativePlugin {
  async optIn(): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async optOut(): Promise<void> {
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendScreenName(options: { name: string }): Promise<void> {
    void options;
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendTransaction(transactionItem: TransactionItem): Promise<void> {
    void transactionItem;
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendDynamicVarWithStringValue(dynamicVarItem: DynamicVarItem): Promise<void> {
    void dynamicVarItem;
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async sendDynamicVarWithIntValue(dynamicVarItem: DynamicVarItem): Promise<void> {
    void dynamicVarItem;
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async onReady(): Promise<void> {
    return;
  }

  async excludeURLForReplay(options: { url: string }): Promise<void> {
    void options;
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async setPIISelectors(pii: PIIConfig): Promise<void> {
    void pii;
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async setCapturedElementsSelector(options: { elements: string }): Promise<void> {
    void options;
    throw new Error('Contentsquare is only available on native platforms.');
  }

  async collect(telemetryItem: TelemetryItem): Promise<void> {
    void telemetryItem;
    throw new Error('Contentsquare is only available on native platforms.');
  }
}
