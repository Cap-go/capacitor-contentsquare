import Foundation

/// Compile-time constants for undocumented Contentsquare SDK selectors (Capacitor XPF integration).
enum ContentsquarePrivateAPI {
    static let xpfType = "CAPACITOR"

    // appstore-2.5.2-allow: Undocumented Contentsquare telemetry selector; no public Capacitor XPF equivalent on iOS.
    static let telemetryCollectSelector = Selector("_telemetryCollect:withValue:")

    // appstore-2.5.2-allow: Undocumented Contentsquare telemetry selector; no public Capacitor XPF equivalent on iOS.
    static let telemetrySetXPFTypeSelector = Selector("_telemetrySetXPFType:")

    // appstore-2.5.2-allow: Undocumented Contentsquare external bridge selector; no public Capacitor XPF equivalent on iOS.
    static let registerExternalBridgeSelector = Selector("_registerExternalBridgeWithParameters:")
}
