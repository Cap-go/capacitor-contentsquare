import ContentsquareModule
import Foundation

@objc(CDVContentsquareTelemetry)
class ContentsquareTelemetry: NSObject {
    func collect(name: String, value: String) {
        let selector = ContentsquarePrivateAPI.telemetryCollectSelector
        if Contentsquare.responds(to: selector) {
            // appstore-2.5.2-allow: Undocumented Contentsquare telemetry collect; required for plugin collect().
            _ = Contentsquare.perform(selector, with: name, with: value)
        }
    }

    func setXPFType() {
        let selector = ContentsquarePrivateAPI.telemetrySetXPFTypeSelector
        if Contentsquare.responds(to: selector) {
            // appstore-2.5.2-allow: Undocumented Contentsquare XPF type registration at plugin load.
            _ = Contentsquare.perform(selector, with: ContentsquarePrivateAPI.xpfType)
        }
    }
}
