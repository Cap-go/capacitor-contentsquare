import { WebPlugin } from '@capacitor/core';
import type { ContentsquareNativePlugin, DynamicVarItem, PIIConfig, TelemetryItem, TransactionItem } from './definitions';
export declare class ContentsquareWeb extends WebPlugin implements ContentsquareNativePlugin {
    optIn(): Promise<void>;
    optOut(): Promise<void>;
    sendScreenName(_options: {
        name: string;
    }): Promise<void>;
    sendTransaction(_transactionItem: TransactionItem): Promise<void>;
    sendDynamicVarWithStringValue(_dynamicVarItem: DynamicVarItem): Promise<void>;
    sendDynamicVarWithIntValue(_dynamicVarItem: DynamicVarItem): Promise<void>;
    onReady(): Promise<void>;
    excludeURLForReplay(_options: {
        url: string;
    }): Promise<void>;
    setPIISelectors(_pii: PIIConfig): Promise<void>;
    setCapturedElementsSelector(_options: {
        elements: string;
    }): Promise<void>;
    collect(_telemetryItem: TelemetryItem): Promise<void>;
}
