plugins {
    id("com.android.application")
}

android {
    namespace = "fr.chiffrecopro.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "fr.chiffrecopro.app"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
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
