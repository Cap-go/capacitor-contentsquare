import XCTest

final class ContentsquarePluginTests: XCTestCase {
    private static let forbiddenPatterns = [
        "NSSelectorFromString",
        "performSelector",
        "NSClassFromString",
        "method_exchangeImplementations",
        "class_replaceMethod",
        "dlopen(",
        "dlsym("
    ]

    func testIOSPluginSourcesAvoidDynamicDispatchPatterns() throws {
        let testFile = URL(fileURLWithPath: #filePath)
        let pluginRoot = testFile
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()

        let sourcesDirectory = pluginRoot.appendingPathComponent("ios/Sources/ContentsquarePlugin", isDirectory: true)
        let swiftFiles = try FileManager.default.subpathsOfDirectory(atPath: sourcesDirectory.path)
            .filter { $0.hasSuffix(".swift") }
            .map { sourcesDirectory.appendingPathComponent($0) }

        XCTAssertFalse(swiftFiles.isEmpty, "Expected Contentsquare iOS plugin sources.")

        for file in swiftFiles {
            let source = try String(contentsOf: file, encoding: .utf8)
            for pattern in Self.forbiddenPatterns {
                XCTAssertFalse(
                    source.contains(pattern),
                    "Forbidden pattern \(pattern) found in \(file.lastPathComponent)"
                )
            }
        }
    }
}
