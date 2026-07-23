plugins {
    id("com.android.library") version "8.9.1"
    id("org.jetbrains.kotlin.android") version "2.1.0"
    id("org.jetbrains.kotlin.plugin.compose") version "2.1.0"
    `maven-publish`
}

android {
    namespace = "halfmoon.tokens"
    compileSdk = 36

    defaultConfig {
        minSdk = 21
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    publishing {
        singleVariant("release") {
            withSourcesJar()
        }
    }
}

dependencies {
    // 공개 API에 노출되는 타입(Color, TextStyle, Dp 등) — api 스코프
    api("androidx.compose.ui:ui:1.7.6")
    api("androidx.compose.foundation:foundation:1.7.6")
}

publishing {
    publications {
        register<MavenPublication>("release") {
            groupId = "com.github.halfmoon-project"
            artifactId = "halfmoon-design"
            // JitPack이 빌드 시 VERSION 환경변수로 태그를 넘긴다
            version = System.getenv("VERSION") ?: "local"
            afterEvaluate { from(components["release"]) }
        }
    }
}
