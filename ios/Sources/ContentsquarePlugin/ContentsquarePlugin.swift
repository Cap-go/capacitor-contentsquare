import Capacitor
import ContentsquareModule
import Foundation

private enum ContentsquareIOSBridgeError {
    static let missingPublicTelemetryAPI =
        "Contentsquare iOS SDK 4.52.4 has no public API equivalent to Android TelemetryInterface " +
        "(telemetryCollect / telemetrySetXPFType). Private selectors were removed for App Store guideline 2.5.2. " +
        "See https://github.com/Cap-go/capacitor-contentsquare/pull/14 for the iOS XPF API gap."
}

@objc(ContentsquarePlugin)
public class ContentsquarePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "ContentsquarePlugin"
    public let jsName = "Contentsquare"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "optIn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "optOut", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendScreenName", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendTransaction", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendDynamicVarWithStringValue", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "sendDynamicVarWithIntValue", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setCapturedElementsSelector", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "excludeURLForReplay", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setPIISelectors", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "collect", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "onReady", returnType: CAPPluginReturnPromise)
    ]

    private var tagInjector: ContentsquareTagInjector?

    override public func load() {
        guard let webView = bridge?.webView else {
            NSLog("ContentsquarePlugin: WebView is not available.")
            return
        }

        Contentsquare.register(webView: webView)
        tagInjector = ContentsquareTagInjector(webView: webView)
    }

    @objc func optIn(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Contentsquare.optIn()
            call.resolve()
        }
    }

    @objc func optOut(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            Contentsquare.optOut()
            call.resolve()
        }
    }

    @objc func sendScreenName(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.reject("Missing 'name' parameter.")
            return
        }

        guard let tagInjector else {
            call.reject("Tag injector is not available.")
            return
        }

        do {
            let script = """
            window._uxa = window._uxa || [];
            window._uxa.push(["trackPageview", \(try javaScriptStringLiteral(name))]);
            """
            tagInjector.addToJSQueue(tag: "TrackPageview: \(name)", jsToInject: script)
            call.resolve()
        } catch {
            call.reject("Failed to serialize screen name.", error.localizedDescription, error)
        }
    }

    @objc func sendTransaction(_ call: CAPPluginCall) {
        let transactionValue = call.getFloat("transactionValue", 0)
        let transactionCurrency = call.getString("transactionCurrency", "")
        let transactionId = call.getString("transactionId", "")

        Contentsquare.send(transaction: CustomerTransaction(id: transactionId, value: transactionValue, currency: transactionCurrency))
        call.resolve()
    }

    @objc func sendDynamicVarWithStringValue(_ call: CAPPluginCall) {
        let dynVarKey = call.getString("dynVarKey", "")
        let dynVarValue = call.getString("dynVarValue", "")

        Contentsquare.send(dynamicVar: DynamicVar(key: dynVarKey, value: dynVarValue))
        call.resolve()
    }

    @objc func sendDynamicVarWithIntValue(_ call: CAPPluginCall) {
        let dynVarKey = call.getString("dynVarKey", "")
        let dynVarValue = UInt32(call.getInt("dynVarValue", 0))

        Contentsquare.send(dynamicVar: DynamicVar(key: dynVarKey, value: dynVarValue))
        call.resolve()
    }

    @objc func setCapturedElementsSelector(_ call: CAPPluginCall) {
        guard let elements = call.getString("elements") else {
            call.reject("Missing 'elements' parameter.")
            return
        }

        guard let tagInjector else {
            call.reject("Tag injector is not available.")
            return
        }

        do {
            let script = """
            window._uxa = window._uxa || [];
            window._uxa.push(["setCapturedElementsSelector", \(try javaScriptStringLiteral(elements))]);
            """
            tagInjector.addToJSQueue(tag: "setCapturedElementsSelector: \(elements)", jsToInject: script)
            call.resolve()
        } catch {
            call.reject("Failed to serialize elements selector.", error.localizedDescription, error)
        }
    }

    @objc func excludeURLForReplay(_ call: CAPPluginCall) {
        guard let urlPattern = call.getString("url") else {
            call.reject("Missing 'url' parameter.")
            return
        }

        guard let tagInjector else {
            call.reject("Tag injector is not available.")
            return
        }

        do {
            let serializedPattern = try javaScriptStringLiteral(urlPattern)
            let script = """
            window._uxa = window._uxa || [];
            window._uxa.push(["excludeURLforReplay", \(serializedPattern)]);
            """

            tagInjector.addToJSQueue(tag: "excludeURLForReplay: \(urlPattern)", jsToInject: script)
            call.resolve()
        } catch {
            call.reject("Failed to serialize URL pattern.", error.localizedDescription, error)
        }
    }

    @objc func setPIISelectors(_ call: CAPPluginCall) {
        guard let piiSelectors = call.getArray("PIISelectors") else {
            call.reject("Missing 'PIISelectors' parameter.")
            return
        }

        guard let piiAttributes = call.getArray("Attributes") else {
            call.reject("Missing 'Attributes' parameter.")
            return
        }

        guard let tagInjector else {
            call.reject("Tag injector is not available.")
            return
        }

        let piiObject: [String: Any] = [
            "PIISelectors": piiSelectors,
            "Attributes": piiAttributes
        ]

        do {
            let jsonData = try JSONSerialization.data(withJSONObject: piiObject, options: [])
            guard let jsonString = String(data: jsonData, encoding: .utf8) else {
                call.reject("Failed to encode PII configuration.")
                return
            }

            let script = """
            window._uxa = window._uxa || [];
            window._uxa.push(["setPIISelectors", \(jsonString)]);
            """
            tagInjector.addToJSQueue(tag: "setPIISelectors", jsToInject: script)
            call.resolve()
        } catch {
            call.reject("Failed to serialize PII configuration.", error.localizedDescription, error)
        }
    }

    @objc func collect(_ call: CAPPluginCall) {
        call.reject(ContentsquareIOSBridgeError.missingPublicTelemetryAPI)
    }

    @objc func onReady(_ call: CAPPluginCall) {
        call.resolve()
    }

    private func javaScriptStringLiteral(_ value: String) throws -> String {
        let data = try JSONSerialization.data(withJSONObject: [value], options: [])
        guard let serialized = String(data: data, encoding: .utf8),
              serialized.count >= 2
        else {
            throw NSError(domain: "ContentsquarePlugin", code: 1)
        }

        return String(serialized.dropFirst().dropLast())
    }
}
