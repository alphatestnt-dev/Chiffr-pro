plugins {
    id("com.android.application")
}

android {
    // Namespace stays aligned with the existing MainActivity Java package.
    namespace = "fr.chiffrecopro.app"
    compileSdk = 36

    defaultConfig {
        // Must match the application already registered in Google Play.
        applicationId = "fr.chiffreco.pro"
        minSdk = 23
        targetSdk = 36
        versionCode = 2
        versionName = "1.0.1"
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.1")
}
