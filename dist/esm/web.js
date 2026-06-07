import { WebPlugin } from '@capacitor/core';
export class ContentsquareWeb extends WebPlugin {
    async optIn() {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async optOut() {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendScreenName(_options) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendTransaction(_transactionItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendDynamicVarWithStringValue(_dynamicVarItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendDynamicVarWithIntValue(_dynamicVarItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async onReady() {
        return;
    }
    async excludeURLForReplay(_options) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async setPIISelectors(_pii) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async setCapturedElementsSelector(_options) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async collect(_telemetryItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
}
//# sourceMappingURL=web.js.map
