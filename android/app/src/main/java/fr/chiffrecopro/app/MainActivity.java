package fr.chiffrecopro.app;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.ServiceWorkerController;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // The Android app deliberately uses the exact same live web app as the PWA.
        // Do not create a second calculator implementation in the Android wrapper.
        webView = new WebView(this);
        setContentView(webView);

        // Keep WebView's HTTP cache and the PWA service-worker cache from serving
        // stale JavaScript after a website update. minSdk is 24, so this API exists.
        webView.clearCache(true);
        WebSettings settings = webView.getSettings();
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        ServiceWorkerController.getInstance()
                .getServiceWorkerWebSettings()
                .setCacheMode(WebSettings.LOAD_NO_CACHE);

        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(false);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setMediaPlaybackRequiresUserGesture(false);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        webView.setBackgroundColor(Color.WHITE);
        webView.setWebViewClient(new WebViewClient());
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        // A local test URL is accepted only by debug builds and only for the CI host.
        // Release builds always open the production website.
        String testUrl = getIntent().getStringExtra("chiffreco_test_url");
        if (BuildConfig.DEBUG && testUrl != null
                && testUrl.startsWith("http://10.0.2.2:4173/")) {
            webView.loadUrl(testUrl);
        } else {
            webView.loadUrl("https://chiffreco-pro.fr/");
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
