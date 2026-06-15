import { WebPlugin } from '@capacitor/core';
export class ContentsquareWeb extends WebPlugin {
    async optIn() {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async optOut() {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendScreenName(options) {
        void options;
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendTransaction(transactionItem) {
        void transactionItem;
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendDynamicVarWithStringValue(dynamicVarItem) {
        void dynamicVarItem;
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendDynamicVarWithIntValue(dynamicVarItem) {
        void dynamicVarItem;
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async onReady() {
        return;
    }
    async excludeURLForReplay(options) {
        void options;
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async setPIISelectors(pii) {
        void pii;
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async setCapturedElementsSelector(options) {
        void options;
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async collect(telemetryItem) {
        void telemetryItem;
        throw new Error('Contentsquare is only available on native platforms.');
    }
}
//# sourceMappingURL=web.js.map