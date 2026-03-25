// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorContentsquare",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapgoCapacitorContentsquare",
            targets: ["ContentsquarePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0"),
        .package(url: "https://github.com/ContentSquare/CS_iOS_SDK.git", exact: "4.45.4")
    ],
    targets: [
        .target(
            name: "ContentsquarePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "ContentsquareModule", package: "CS_iOS_SDK")
            ],
            path: "ios/Sources/ContentsquarePlugin"),
        .testTarget(
            name: "ContentsquarePluginTests",
            dependencies: ["ContentsquarePlugin"],
            path: "ios/Tests/ContentsquarePluginTests")
    ]
)
