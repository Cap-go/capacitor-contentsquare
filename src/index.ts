import { Capacitor, registerPlugin } from '@capacitor/core';

import type {
  ContentsquareNativePlugin,
  ContentsquarePlugin as ContentsquarePluginType,
  DynamicVarItem,
  PIIConfig,
  TransactionItem,
} from './definitions';

const Contentsquare = registerPlugin<ContentsquareNativePlugin>('Contentsquare', {
  web: () => import('./web').then((m) => new m.ContentsquareWeb()),
});

const notifyDomReady = async (): Promise<void> => {
  if (Capacitor.getPlatform() === 'web') {
    return;
  }

  await Contentsquare.onReady();
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        void notifyDomReady();
      },
      { once: true },
    );
  } else {
    void notifyDomReady();
  }
}

const normalizeReplayPattern = (urlPattern: string | RegExp): string => {
  return urlPattern instanceof RegExp ? urlPattern.toString() : urlPattern;
};

const ContentsquarePlugin: ContentsquarePluginType = {
  async optIn(): Promise<void> {
    await Contentsquare.optIn();
  },

  async optOut(): Promise<void> {
    await Contentsquare.optOut();
  },

  async sendScreenName(name: string): Promise<void> {
    await Contentsquare.sendScreenName({ name });
  },

  async sendTransaction(transactionItem: TransactionItem): Promise<void> {
    await Contentsquare.sendTransaction(transactionItem);
  },

  async sendDynamicVar(dynamicVarItem: DynamicVarItem): Promise<void> {
    const { dynVarValue } = dynamicVarItem;

    if (typeof dynVarValue === 'string') {
      await Contentsquare.sendDynamicVarWithStringValue(dynamicVarItem);
      return;
    }

    if (Number.isInteger(dynVarValue) && dynVarValue >= 0) {
      await Contentsquare.sendDynamicVarWithIntValue(dynamicVarItem);
      return;
    }

    throw new TypeError('The value of the dynamic variable must be either a string or a non-negative integer.');
  },

  async excludeURLForReplay(url: string): Promise<void> {
    await Contentsquare.excludeURLForReplay({ url: normalizeReplayPattern(url) });
  },

  async setPIISelectors(pii: PIIConfig): Promise<void> {
    await Contentsquare.setPIISelectors(pii);
  },

  async setCapturedElementsSelector(elements: string): Promise<void> {
    await Contentsquare.setCapturedElementsSelector({ elements });
  },
};

export * from './definitions';
export { Contentsquare, ContentsquarePlugin };
