plugins { id("com.android.application") }

android {
    namespace = "com.tnlxacc.moji"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.tnlxacc.moji"
        minSdk = 26
        targetSdk = 36
        versionCode = 4
        versionName = "1.0.3-test-backup-gear"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
