// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "halfmoon-design",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "HalfmoonTokens", targets: ["HalfmoonTokens"]),
    ],
    targets: [
        .target(name: "HalfmoonTokens"),
    ]
)
