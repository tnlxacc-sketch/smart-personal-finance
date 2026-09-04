plugins { id("com.android.application") }

android {
    namespace = "com.tnlxacc.moji"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.tnlxacc.moji"
        minSdk = 26
        targetSdk = 36
        versionCode = 3
        versionName = "1.0.2-test-iconfix"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
