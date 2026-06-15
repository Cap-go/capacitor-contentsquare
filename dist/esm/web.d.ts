import { WebPlugin } from '@capacitor/core';
import type { ContentsquareNativePlugin, DynamicVarItem, PIIConfig, TelemetryItem, TransactionItem } from './definitions';
export declare class ContentsquareWeb extends WebPlugin implements ContentsquareNativePlugin {
    optIn(): Promise<void>;
    optOut(): Promise<void>;
    sendScreenName(options: {
        name: string;
    }): Promise<void>;
    sendTransaction(transactionItem: TransactionItem): Promise<void>;
    sendDynamicVarWithStringValue(dynamicVarItem: DynamicVarItem): Promise<void>;
    sendDynamicVarWithIntValue(dynamicVarItem: DynamicVarItem): Promise<void>;
    onReady(): Promise<void>;
    excludeURLForReplay(options: {
        url: string;
    }): Promise<void>;
    setPIISelectors(pii: PIIConfig): Promise<void>;
    setCapturedElementsSelector(options: {
        elements: string;
    }): Promise<void>;
    collect(telemetryItem: TelemetryItem): Promise<void>;
}
