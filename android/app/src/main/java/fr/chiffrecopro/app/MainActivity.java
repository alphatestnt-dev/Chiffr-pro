package fr.chiffrecopro.app;

import android.app.Activity;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.content.Context;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.graphics.Color;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
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
        // Native print bridge: Android WebView does not reliably implement window.print().
        // Only the trusted Chiffr’EcoPro page is loaded in this WebView.
        webView.addJavascriptInterface(new PrintBridge(), "AndroidPrint");

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


    private final class PrintBridge {
        @JavascriptInterface
        public void printPage() {
            runOnUiThread(() -> {
                if (webView == null) return;
                try {
                    PrintManager manager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    if (manager == null) {
                        webView.evaluateJavascript("window.cePrintRestore && window.cePrintRestore()", null);
                        return;
                    }
                    PrintDocumentAdapter source = webView.createPrintDocumentAdapter("ChiffrecoPro-facture");
                    PrintDocumentAdapter adapter = new PrintDocumentAdapter() {
                        @Override public void onStart() { source.onStart(); }
                        @Override public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
                                CancellationSignal cancellationSignal, LayoutResultCallback callback, Bundle extras) {
                            source.onLayout(oldAttributes, newAttributes, cancellationSignal, callback, extras);
                        }
                        @Override public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                                CancellationSignal cancellationSignal, WriteResultCallback callback) {
                            source.onWrite(pages, destination, cancellationSignal, callback);
                        }
                        @Override public void onFinish() {
                            source.onFinish();
                            if (webView != null) webView.evaluateJavascript(
                                    "window.cePrintRestore && window.cePrintRestore()", null);
                        }
                    };
                    manager.print("ChiffrEcoPro", adapter,
                            new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
                } catch (RuntimeException error) {
                    if (webView != null) webView.evaluateJavascript(
                            "window.cePrintRestore && window.cePrintRestore()", null);
                }
            });
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
