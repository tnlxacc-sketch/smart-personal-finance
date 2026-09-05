plugins { id("com.android.application") }

android {
    namespace = "com.tnlxacc.moji"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.tnlxacc.moji.rc1"
        minSdk = 26
        targetSdk = 36
        versionCode = 7
        versionName = "1.0.5-commercial-rc1-parallel"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
