plugins {
    id("com.android.application")
}

android {
    namespace = "fr.chiffrecopro.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "fr.chiffreco.pro"
        minSdk = 24
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

configurations.configureEach {
    resolutionStrategy.force(
        "org.jetbrains.kotlin:kotlin-stdlib:1.8.22",
        "org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.8.22",
        "org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.8.22"
    )
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.1")
}
