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
    private final WebView webView;
    private boolean isInjecting = false;

    public ContentsquareJSInjector(final WebView webView) {
        this.webView = webView;
    }

    public void addToJSQueue(final String description, final String jsToInject) {
        jsQueue.add(new JsTask(jsToInject, description));

        if (!isInjecting) {
            injectNextJSFromQueue();
        }
    }

    private void injectNextJSFromQueue() {
        if (jsQueue.isEmpty()) {
            isInjecting = false;
            return;
        }

        isInjecting = true;
        injectJS(jsQueue.poll());
    }

    private void injectJS(final JsTask jsTask) {
        handler.post(() ->
            webView.evaluateJavascript(jsTask.jsToInject, (value) -> {
                Logger.debug("CSLIBCAP", "JSInjector: " + jsTask.description);
                isInjecting = false;
                injectNextJSFromQueue();
            })
        );
    }
}
