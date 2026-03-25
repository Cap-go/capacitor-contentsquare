package app.capgo.contentsquare;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.WebView;

import androidx.annotation.NonNull;

import com.contentsquare.android.Contentsquare;
import com.contentsquare.android.api.CsWebViewManager;
import com.contentsquare.android.api.bridge.xpf.ExternalBridgeInterface;
import com.contentsquare.android.api.bridge.xpf.ExternalBridgeType;
import com.contentsquare.android.api.bridge.xpf.SDKState;
import com.contentsquare.android.api.bridge.xpf.SDKStateChangeType;
import com.contentsquare.android.api.bridge.xpf.XpfInterface;
import com.contentsquare.android.api.model.Transaction;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.lang.reflect.Method;

@CapacitorPlugin(name = "Contentsquare")
public class ContentsquarePlugin extends Plugin {

    private ContentsquareTelemetry telemetry;
    private ExternalBridgeInterface xpfBridge;
    private ContentsquareJSInjector jsInjector;

    @Override
    public void load() {
        try {
            final WebView webView = getBridge().getWebView();
            Contentsquare.unMask(webView);
            jsInjector = new ContentsquareJSInjector(webView);

            xpfBridge = new ExternalBridgeInterface() {
                @Override
                public void notifyShouldSendInitialInsertion() {
                }

                @Override
                public void updateBridgeConfig(@NonNull final String config) {
                }

                @Override
                public void notifySrMaskingHasChanged(final boolean enabled) {
                }

                @Override
                public void notifySDKStateChanges(@NonNull final SDKStateChangeType changeType, @NonNull final SDKState sdkState) {
                }

                @Override
                public void notifyCsInAppEnabled(final boolean enabled) {
                }

                @Override
                public void notifySessionReplayEnabled(final boolean enabled) {
                }

                @NonNull
                @Override
                public ExternalBridgeType getBridgeType() {
                    return null;
                }

                @Override
                public void notifySrMaskingIndicatorHasChanged(final boolean value) {
                }
            };

            webView.post(() -> {
                CsWebViewManager.INSTANCE.injectEventTrackingInterface(webView);
                webView.reload();
                Log.d("CSLIBCAP", "WebView injected, registering XPF bridge");
                registerXpfBridge();
            });

            telemetry = new ContentsquareTelemetry();
            telemetry.setXPFType();
        } catch (Exception exception) {
            Log.e("CSLIBCAP", "Failed to initialize plugin", exception);
        }
    }

    @Override
    protected void handleOnDestroy() {
        unregisterXpfBridge();
        super.handleOnDestroy();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void sendScreenName(final PluginCall call) {
        final String name = call.getString("name");
        if (name == null) {
            call.reject("Missing 'name' parameter.");
            return;
        }

        final String js = "window._uxa = window._uxa || [];\n"
            + "window._uxa.push([\"trackPageview\", " + JSONObject.quote(name) + "]);\n";
        jsInjector.addToJSQueue("TrackPageview: " + name, js);
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void optIn(final PluginCall call) {
        new Handler(Looper.getMainLooper()).post(() -> {
            Contentsquare.optIn(getContext());
            call.resolve();
        });
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void optOut(final PluginCall call) {
        new Handler(Looper.getMainLooper()).post(() -> {
            Contentsquare.optOut(getContext());
            call.resolve();
        });
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void sendTransaction(final PluginCall call) {
        try {
            final Float price = call.getFloat("transactionValue");
            final String currency = call.getString("transactionCurrency");
            final String transactionId = call.getString("transactionId");

            if (price == null || currency == null) {
                call.reject("Missing 'transactionValue' or 'transactionCurrency' parameter.");
                return;
            }

            if (transactionId == null || transactionId.isEmpty()) {
                Contentsquare.send(Transaction.Companion.builder(price, currency).build());
            } else {
                Contentsquare.send(Transaction.Companion.builder(price, currency).id(transactionId).build());
            }
            call.resolve();
        } catch (Exception exception) {
            Log.e("CSLIBCAP", "sendTransaction failed", exception);
            call.reject("sendTransaction failed.", exception);
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void sendDynamicVarWithIntValue(final PluginCall call) {
        try {
            final String key = call.getString("dynVarKey");
            final Integer value = call.getInt("dynVarValue");

            if (key == null || value == null) {
                call.reject("Missing 'dynVarKey' or 'dynVarValue' parameter.");
                return;
            }

            Contentsquare.send(key, value);
            call.resolve();
        } catch (Exception exception) {
            Log.e("CSLIBCAP", "sendDynamicVarWithIntValue failed", exception);
            call.reject("sendDynamicVarWithIntValue failed.", exception);
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void sendDynamicVarWithStringValue(final PluginCall call) {
        try {
            final String key = call.getString("dynVarKey");
            final String value = call.getString("dynVarValue");

            if (key == null || value == null) {
                call.reject("Missing 'dynVarKey' or 'dynVarValue' parameter.");
                return;
            }

            Contentsquare.send(key, value);
            call.resolve();
        } catch (Exception exception) {
            Log.e("CSLIBCAP", "sendDynamicVarWithStringValue failed", exception);
            call.reject("sendDynamicVarWithStringValue failed.", exception);
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void onReady(final PluginCall call) {
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void setCapturedElementsSelector(final PluginCall call) {
        final String elements = call.getString("elements");
        if (elements == null) {
            call.reject("Missing 'elements' parameter.");
            return;
        }

        final String js = "window._uxa = window._uxa || [];\n"
            + "window._uxa.push([\"setCapturedElementsSelector\", " + JSONObject.quote(elements) + "]);\n";
        jsInjector.addToJSQueue("setCapturedElementsSelector: " + elements, js);
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void excludeURLForReplay(final PluginCall call) {
        final String urlPattern = call.getString("url");
        if (urlPattern == null) {
            call.reject("Missing 'url' parameter.");
            return;
        }

        final String js = "window._uxa = window._uxa || [];\n"
            + "window._uxa.push([\"excludeURLforReplay\", " + urlPattern + "]);\n";
        jsInjector.addToJSQueue("excludeURLForReplay: " + urlPattern, js);
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void setPIISelectors(final PluginCall call) {
        final String js = "window._uxa = window._uxa || [];\n"
            + "window._uxa.push([\"setPIISelectors\", " + call.getData().toString() + "]);\n";
        jsInjector.addToJSQueue("setPIISelectors", js);
        call.resolve();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_PROMISE)
    public void collect(final PluginCall call) {
        try {
            final String name = call.getString("name");
            final String value = call.getString("value", "");

            if (telemetry == null) {
                call.reject("Telemetry is not available.");
                return;
            }

            if (name == null) {
                call.reject("Missing 'name' parameter.");
                return;
            }

            telemetry.collect(name, value);
            call.resolve();
        } catch (Exception exception) {
            Log.e("CSLIBCAP", "collect failed", exception);
            call.reject("collect failed.", exception);
        }
    }

    private void registerXpfBridge() {
        try {
            final Method registerMethod = XpfInterface.class.getDeclaredMethod("registerExternalBridge", ExternalBridgeInterface.class);
            registerMethod.setAccessible(true);
            final Object xpfInterfaceInstance = XpfInterface.class.getDeclaredField("INSTANCE").get(null);
            registerMethod.invoke(xpfInterfaceInstance, xpfBridge);
        } catch (Exception exception) {
            Log.e("CSLIBCAP", "registerXpfBridge failed", exception);
        }
    }

    private void unregisterXpfBridge() {
        try {
            if (xpfBridge == null) {
                return;
            }
            final Method unregisterMethod = XpfInterface.class.getDeclaredMethod("unregisterExternalBridge", ExternalBridgeInterface.class);
            unregisterMethod.setAccessible(true);
            final Object xpfInterfaceInstance = XpfInterface.class.getDeclaredField("INSTANCE").get(null);
            unregisterMethod.invoke(xpfInterfaceInstance, xpfBridge);
        } catch (Exception exception) {
            Log.e("CSLIBCAP", "unregisterXpfBridge failed", exception);
        }
    }
}
