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
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final String APP_URL="https://tnlxacc-sketch.github.io/smart-personal-finance/";
    private static final int FILE_CHOOSER_REQUEST=1001;
    private static final int BACKUP_SAVE_REQUEST=1002;
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private String pendingBackupJson;
    private static final String[] ENHANCEMENT_SCRIPTS=new String[]{"ux-income-label-v35.js?v=66","financial-health-v1.js?v=66","future-whatif-v1.js?v=66","history-insights-v1.js?v=66","quick-guide-fold-v1.js?v=66","health-simple-v1.js?v=66","position-easy-v1.js?v=66","settings-fold-v1.js?v=66","quick-guide-copy-v1.js?v=66","moji-elegant-ui-v1.js?v=66","moji-theme-fix-v2.js?v=66","moji-ui-skin-v2.js?v=66"};

    @Override protected void onCreate(Bundle savedInstanceState){
      super.onCreate(savedInstanceState);webView=new WebView(this);setContentView(webView);
      WebSettings s=webView.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setDatabaseEnabled(true);s.setAllowFileAccess(true);s.setAllowContentAccess(true);s.setLoadWithOverviewMode(false);s.setUseWideViewPort(false);s.setMediaPlaybackRequiresUserGesture(true);s.setCacheMode(WebSettings.LOAD_NO_CACHE);
      webView.addJavascriptInterface(new AndroidBridge(),"MojiAndroid");
      CookieManager.getInstance().setAcceptCookie(true);CookieManager.getInstance().setAcceptThirdPartyCookies(webView,false);
      webView.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){Uri u=r.getUrl();String h=u.getHost();if(h!=null&&h.equals("tnlxacc-sketch.github.io"))return false;try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(ActivityNotFoundException ignored){}return true;}@Override public void onPageFinished(WebView v,String url){super.onPageFinished(v,url);if(url!=null&&url.startsWith(APP_URL))injectEnhancements(v);}});
      webView.setWebChromeClient(new WebChromeClient(){@Override public boolean onShowFileChooser(WebView w,ValueCallback<Uri[]> cb,FileChooserParams p){if(filePathCallback!=null)filePathCallback.onReceiveValue(null);filePathCallback=cb;Intent i=p.createIntent();i.addCategory(Intent.CATEGORY_OPENABLE);try{startActivityForResult(i,FILE_CHOOSER_REQUEST);return true;}catch(ActivityNotFoundException e){filePathCallback=null;Toast.makeText(MainActivity.this,"ไม่พบแอปสำหรับเลือกไฟล์",Toast.LENGTH_SHORT).show();return false;}}});
      webView.setDownloadListener(new DownloadListener(){@Override public void onDownloadStart(String url,String ua,String cd,String mt,long len){if(url==null||(!url.startsWith("https://")&&!url.startsWith("http://"))){Toast.makeText(MainActivity.this,"ไม่สามารถดาวน์โหลดไฟล์รูปแบบนี้",Toast.LENGTH_LONG).show();return;}try{DownloadManager.Request r=new DownloadManager.Request(Uri.parse(url));r.setMimeType(mt);r.addRequestHeader("User-Agent",ua);r.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);r.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS,"moji-download");((DownloadManager)getSystemService(Context.DOWNLOAD_SERVICE)).enqueue(r);}catch(Exception e){Toast.makeText(MainActivity.this,"บันทึกไฟล์ไม่สำเร็จ",Toast.LENGTH_SHORT).show();}}});
      if(savedInstanceState==null)webView.loadUrl(APP_URL+"?android=v66");else webView.restoreState(savedInstanceState);
    }

    public class AndroidBridge{
      @JavascriptInterface public void saveBackup(String json){runOnUiThread(()->openBackupSaveDialog(json));}
    }

    private void openBackupSaveDialog(String json){
      try{
        pendingBackupJson=json;
        String stamp=new SimpleDateFormat("yyyyMMdd-HHmmss",Locale.US).format(new Date());
        Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE,"moji-backup-"+stamp+".json");
        startActivityForResult(intent,BACKUP_SAVE_REQUEST);
      }catch(Exception e){pendingBackupJson=null;Toast.makeText(this,"เปิดหน้าบันทึกไฟล์ไม่สำเร็จ",Toast.LENGTH_LONG).show();}
    }

    private void writeBackupToUri(Uri uri){
      if(uri==null||pendingBackupJson==null)return;
      try(OutputStream out=getContentResolver().openOutputStream(uri,"w")){
        if(out==null)throw new Exception("open failed");
        out.write(pendingBackupJson.getBytes(StandardCharsets.UTF_8));out.flush();
        Toast.makeText(this,"สำรองข้อมูลสำเร็จ",Toast.LENGTH_LONG).show();
      }catch(Exception e){Toast.makeText(this,"สำรองข้อมูลไม่สำเร็จ",Toast.LENGTH_LONG).show();}
      finally{pendingBackupJson=null;}
    }

    private void injectEnhancements(WebView view){
      StringBuilder js=new StringBuilder();js.append("(function(){const files=[");for(int i=0;i<ENHANCEMENT_SCRIPTS.length;i++){if(i>0)js.append(",");js.append("'").append(ENHANCEMENT_SCRIPTS[i]).append("'");}
      js.append("];let p=Promise.resolve();files.forEach(function(f){p=p.then(function(){return new Promise(function(resolve){const base=f.split('?')[0];document.querySelectorAll('script[data-moji-android]').forEach(function(s){if((s.src||'').indexOf(base)>=0)s.remove();});const s=document.createElement('script');s.dataset.mojiAndroid='1';s.src='./'+f+'&android='+(Date.now());s.onload=resolve;s.onerror=resolve;document.body.appendChild(s);});});});p.then(function(){if(window.MojiAndroid){window.backup=function(){try{MojiAndroid.saveBackup(JSON.stringify(S));}catch(e){alert('สำรองข้อมูลไม่สำเร็จ');}};}const b=[...document.querySelectorAll('header button')].find(x=>(x.getAttribute('onclick')||'').includes('settings(true)'));if(b){b.innerHTML='<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#342d25\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:28px;height:28px;display:block\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><circle cx=\"12\" cy=\"12\" r=\"7\"/><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12\"/></svg>';b.setAttribute('aria-label','ตั้งค่า');b.setAttribute('title','ตั้งค่า');b.style.display='inline-flex';b.style.alignItems='center';b.style.justifyContent='center';}});})();");view.evaluateJavascript(js.toString(),null);
    }

    @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){
      super.onActivityResult(requestCode,resultCode,data);
      if(requestCode==FILE_CHOOSER_REQUEST&&filePathCallback!=null){Uri[] results=WebChromeClient.FileChooserParams.parseResult(resultCode,data);filePathCallback.onReceiveValue(results);filePathCallback=null;return;}
      if(requestCode==BACKUP_SAVE_REQUEST){if(resultCode==RESULT_OK&&data!=null)writeBackupToUri(data.getData());else pendingBackupJson=null;}
    }
    @Override public void onBackPressed(){if(webView!=null&&webView.canGoBack())webView.goBack();else super.onBackPressed();}
    @Override protected void onSaveInstanceState(Bundle outState){if(webView!=null)webView.saveState(outState);super.onSaveInstanceState(outState);}
}
