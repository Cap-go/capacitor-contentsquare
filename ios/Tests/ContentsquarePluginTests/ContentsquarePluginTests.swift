import XCTest

final class ContentsquarePluginTests: XCTestCase {
    private static let runtimeBuiltNamePatterns = [
        #"NSSelectorFromString\s*\([^)]*\\\("#,
        #"NSSelectorFromString\s*\([^)]*\+"#,
        #"NSSelectorFromString\s*\(\s*(?!")[^)]+\)"#,
        #"(?<![A-Za-z])Selector\s*\([^)]*\\\("#,
        #"(?<![A-Za-z])Selector\s*\([^)]*\+"#,
        #"(?<![A-Za-z])Selector\s*\(\s*(?!")[^)]+\)"#,
        #"NSClassFromString\s*\([^)]*\\\("#,
        #"NSClassFromString\s*\([^)]*\+"#,
        #"NSClassFromString\s*\(\s*(?!")[^)]+\)"#,
    ]

    func testIOSPluginSourcesUseStaticSelectorNames() throws {
        let testFile = URL(fileURLWithPath: #filePath)
        let pluginRoot = testFile
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()
            .deletingLastPathComponent()

        let sourcesDirectory = pluginRoot.appendingPathComponent("ios/Sources", isDirectory: true)
        let swiftFiles = try FileManager.default.subpathsOfDirectory(atPath: sourcesDirectory.path)
            .filter { $0.hasSuffix(".swift") }
            .map { sourcesDirectory.appendingPathComponent($0) }

        XCTAssertFalse(swiftFiles.isEmpty, "Expected Contentsquare iOS plugin sources.")

        for file in swiftFiles {
            let source = try String(contentsOf: file, encoding: .utf8)
            for pattern in Self.runtimeBuiltNamePatterns {
                let regex = try NSRegularExpression(pattern: pattern)
                let range = NSRange(source.startIndex ..< source.endIndex, in: source)
                let match = regex.firstMatch(in: source, range: range)
                XCTAssertNil(
                    match,
                    "Runtime-built selector or class name pattern \(pattern) found in \(file.lastPathComponent)",
                )
            }
        }
    }
}
