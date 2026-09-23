package app.capgo.contentsquare;

import android.os.Handler;
import android.os.Looper;
import android.webkit.WebView;
import app.capgo.contentsquare.util.JsTask;
import com.getcapacitor.Logger;
import java.util.LinkedList;
import java.util.Queue;

public class ContentsquareJSInjector {

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Queue<JsTask> jsQueue = new LinkedList<>();
    private WebView webView;
    private boolean isInjecting = false;
    private boolean destroyed = false;

    public ContentsquareJSInjector(final WebView webView) {
        this.webView = webView;
    }

    public void addToJSQueue(final String description, final String jsToInject) {
        if (destroyed) {
            return;
        }

        jsQueue.add(new JsTask(jsToInject, description));

        if (!isInjecting) {
            injectNextJSFromQueue();
        }
    }

    public void destroy() {
        if (destroyed) {
            return;
        }

        destroyed = true;
        final Runnable cleanup = () -> {
            handler.removeCallbacksAndMessages(null);
            jsQueue.clear();
            isInjecting = false;
            webView = null;
        };

        if (Looper.myLooper() == Looper.getMainLooper()) {
            cleanup.run();
        } else {
            handler.post(cleanup);
        }
    }

    private void injectNextJSFromQueue() {
        if (destroyed || jsQueue.isEmpty()) {
            isInjecting = false;
            return;
        }

        isInjecting = true;
        injectJS(jsQueue.poll());
    }

    private void injectJS(final JsTask jsTask) {
        handler.post(() -> {
            final WebView currentWebView = webView;
            if (!isWebViewUsable(currentWebView)) {
                Logger.debug("CSLIBCAP", "JSInjector: dropped task " + jsTask.description + " (WebView unavailable)");
                isInjecting = false;
                injectNextJSFromQueue();
                return;
            }

            try {
                currentWebView.evaluateJavascript(jsTask.jsToInject, (value) -> {
                    if (destroyed) {
                        return;
                    }
                    Logger.debug("CSLIBCAP", "JSInjector: " + jsTask.description);
                    isInjecting = false;
                    injectNextJSFromQueue();
                });
            } catch (RuntimeException exception) {
                Logger.debug("CSLIBCAP", "JSInjector: dropped task " + jsTask.description + " (evaluateJavascript failed)");
                isInjecting = false;
                injectNextJSFromQueue();
            }
        });
    }

    private boolean isWebViewUsable(final WebView currentWebView) {
        if (destroyed || currentWebView == null) {
            return false;
        }

        try {
            return currentWebView.isAttachedToWindow();
        } catch (RuntimeException exception) {
            return false;
        }
    }
}
