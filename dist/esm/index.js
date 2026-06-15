import { Capacitor, registerPlugin } from '@capacitor/core';
const Contentsquare = registerPlugin('Contentsquare', {
    web: () => import('./web').then((m) => new m.ContentsquareWeb()),
});
const notifyDomReady = async () => {
    if (Capacitor.getPlatform() === 'web') {
        return;
    }
    await Contentsquare.onReady();
};
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            void notifyDomReady();
        }, { once: true });
    }
    else {
        void notifyDomReady();
    }
}
const normalizeReplayPattern = (urlPattern) => {
    return urlPattern instanceof RegExp ? urlPattern.toString() : urlPattern;
};
const ContentsquarePlugin = {
    async optIn() {
        await Contentsquare.optIn();
    },
    async optOut() {
        await Contentsquare.optOut();
    },
    async sendScreenName(name) {
        await Contentsquare.sendScreenName({ name });
    },
    async sendTransaction(transactionItem) {
        await Contentsquare.sendTransaction(transactionItem);
    },
    async sendDynamicVar(dynamicVarItem) {
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
    async excludeURLForReplay(url) {
        await Contentsquare.excludeURLForReplay({ url: normalizeReplayPattern(url) });
    },
    async setPIISelectors(pii) {
        await Contentsquare.setPIISelectors(pii);
    },
    async setCapturedElementsSelector(elements) {
        await Contentsquare.setCapturedElementsSelector({ elements });
    },
};
export * from './definitions';
export { Contentsquare, ContentsquarePlugin };
//# sourceMappingURL=index.js.map