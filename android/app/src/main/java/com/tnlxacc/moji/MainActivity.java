package com.tnlxacc.moji;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String APP_URL = "https://tnlxacc-sketch.github.io/smart-personal-finance/";
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;

    private static final String[] ENHANCEMENT_SCRIPTS = new String[]{
            "ux-income-label-v35.js?v=66",
            "financial-health-v1.js?v=66",
            "future-whatif-v1.js?v=66",
            "history-insights-v1.js?v=66",
            "quick-guide-fold-v1.js?v=66",
            "health-simple-v1.js?v=66",
            "position-easy-v1.js?v=66",
            "settings-fold-v1.js?v=66",
            "quick-guide-copy-v1.js?v=66",
            "moji-elegant-ui-v1.js?v=66",
            "moji-theme-fix-v2.js?v=66",
            "moji-ui-skin-v2.js?v=66"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();
                if (host != null && host.equals("tnlxacc-sketch.github.io")) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (ActivityNotFoundException ignored) {}
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (url != null && url.startsWith(APP_URL)) injectEnhancements(view);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallbackNew, FileChooserParams fileChooserParams) {
                if (filePathCallback != null) filePathCallback.onReceiveValue(null);
                filePathCallback = filePathCallbackNew;
                Intent intent = fileChooserParams.createIntent();
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                try {
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                    return true;
                } catch (ActivityNotFoundException e) {
                    filePathCallback = null;
                    Toast.makeText(MainActivity.this, "ไม่พบแอปสำหรับเลือกไฟล์", Toast.LENGTH_SHORT).show();
                    return false;
                }
            }
        });

        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                if (url == null || (!url.startsWith("https://") && !url.startsWith("http://"))) {
                    Toast.makeText(MainActivity.this, "ไฟล์รูปแบบนี้จะเพิ่มการรองรับในรอบทดสอบถัดไป", Toast.LENGTH_LONG).show();
                    return;
                }
                try {
                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                    request.setMimeType(mimetype);
                    request.addRequestHeader("User-Agent", userAgent);
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "moji-backup");
                    DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                    manager.enqueue(request);
                    Toast.makeText(MainActivity.this, "กำลังบันทึกไฟล์ลง Downloads", Toast.LENGTH_SHORT).show();
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "บันทึกไฟล์ไม่สำเร็จ", Toast.LENGTH_SHORT).show();
                }
            }
        });

        if (savedInstanceState == null) webView.loadUrl(APP_URL + "?android=v66");
        else webView.restoreState(savedInstanceState);
    }

    private void injectEnhancements(WebView view) {
        StringBuilder js = new StringBuilder();
        js.append("(function(){");
        js.append("const files=");
        js.append("[");
        for (int i = 0; i < ENHANCEMENT_SCRIPTS.length; i++) {
            if (i > 0) js.append(",");
            js.append("'").append(ENHANCEMENT_SCRIPTS[i]).append("'");
        }
        js.append("];let p=Promise.resolve();files.forEach(function(f){p=p.then(function(){return new Promise(function(resolve){");
        js.append("const base=f.split('?')[0];document.querySelectorAll('script[data-moji-android]').forEach(function(s){if((s.src||'').indexOf(base)>=0)s.remove();});");
        js.append("const s=document.createElement('script');s.dataset.mojiAndroid='1';s.src='./'+f+'&android='+(Date.now());s.onload=resolve;s.onerror=resolve;document.body.appendChild(s);});});});");
        js.append("})();");
        view.evaluateJavascript(js.toString(), null);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST && filePathCallback != null) {
            Uri[] results = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }
}
