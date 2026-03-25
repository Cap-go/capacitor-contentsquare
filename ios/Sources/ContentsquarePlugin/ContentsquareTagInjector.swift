import Foundation
import WebKit

class ContentsquareTagInjector {
    private var jsQueue = [JsTask]()
    private let webView: WKWebView
    private var isInjecting = false

    init(webView: WKWebView) {
        self.webView = webView
    }

    func addToJSQueue(tag: String, jsToInject: String) {
        jsQueue.append(JsTask(jsToInject: jsToInject, tag: tag))

        if !isInjecting {
            injectNextJSFromQueue()
        }
    }

    private func injectNextJSFromQueue() {
        guard !jsQueue.isEmpty else {
            isInjecting = false
            return
        }

        isInjecting = true
        injectJS(jsTask: jsQueue.removeFirst())
    }

    private func injectJS(jsTask: JsTask) {
        DispatchQueue.main.async {
            self.webView.evaluateJavaScript(jsTask.jsToInject) { _, error in
                if let error {
                    NSLog("ContentsquarePlugin JS injection error: %@", error.localizedDescription)
                }
                self.injectNextJSFromQueue()
            }
        }
    }
}

struct JsTask {
    let jsToInject: String
    let tag: String
}
