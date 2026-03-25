import ContentsquareModule
import Foundation

@objc(CDVContentsquareTelemetry)
class ContentsquareTelemetry: NSObject {
    private let xpfType = "CAPACITOR"

    func collect(name: String, value: String) {
        let selector = NSSelectorFromString("_telemetryCollect:withValue:")
        if Contentsquare.responds(to: selector) {
            _ = Contentsquare.perform(selector, with: name, with: value)
        }
    }

    func setXPFType() {
        let selector = NSSelectorFromString("_telemetrySetXPFType:")
        if Contentsquare.responds(to: selector) {
            _ = Contentsquare.perform(selector, with: xpfType)
        }
    }
}
