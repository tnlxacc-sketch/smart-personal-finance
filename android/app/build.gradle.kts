plugins { id("com.android.application") }

android {
    namespace = "com.tnlxacc.moji"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.tnlxacc.moji"
        minSdk = 26
        targetSdk = 36
        versionCode = 5
        versionName = "1.0.4-test-native-backup"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
