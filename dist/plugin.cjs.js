'use strict';

var core = require('@capacitor/core');

const Contentsquare = core.registerPlugin('Contentsquare', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.ContentsquareWeb()),
});
const notifyDomReady = async () => {
    if (core.Capacitor.getPlatform() === 'web') {
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

class ContentsquareWeb extends core.WebPlugin {
    async optIn() {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async optOut() {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendScreenName(options) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendTransaction(transactionItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendDynamicVarWithStringValue(dynamicVarItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async sendDynamicVarWithIntValue(dynamicVarItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async onReady() {
        return;
    }
    async excludeURLForReplay(options) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async setPIISelectors(pii) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async setCapturedElementsSelector(options) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
    async collect(telemetryItem) {
        throw new Error('Contentsquare is only available on native platforms.');
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ContentsquareWeb: ContentsquareWeb
});

exports.Contentsquare = Contentsquare;
exports.ContentsquarePlugin = ContentsquarePlugin;
//# sourceMappingURL=plugin.cjs.js.map
