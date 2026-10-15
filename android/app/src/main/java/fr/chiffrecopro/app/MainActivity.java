package fr.chiffrecopro.app;

import android.app.Activity;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.graphics.Color;
import android.content.Context;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        // The Android app loads the same live web application as the desktop site.
        // Disable the WebView HTTP cache so old JavaScript cannot leave Android on a
        // different calculation build after the website has been updated. This does
        // not clear localStorage, saved estimates, or login data.
        webView.clearCache(true);
        WebSettings settings = webView.getSettings();
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
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
        // Native printing is required because window.print() alone is not implemented
        // by Android WebView. The bridge exposes only the print action to this trusted site.
        webView.addJavascriptInterface(new PrintBridge(), "AndroidPrint");

        webView.loadUrl("https://chiffreco-pro.fr/");
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
                        @Override
                        public void onStart() {
                            source.onStart();
                        }

                        @Override
                        public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
                                             CancellationSignal cancellationSignal,
                                             LayoutResultCallback callback, Bundle extras) {
                            source.onLayout(oldAttributes, newAttributes, cancellationSignal, callback, extras);
                        }

                        @Override
                        public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                                            CancellationSignal cancellationSignal, WriteResultCallback callback) {
                            source.onWrite(pages, destination, cancellationSignal, callback);
                        }

                        @Override
                        public void onFinish() {
                            source.onFinish();
                            if (webView != null) {
                                webView.evaluateJavascript("window.cePrintRestore && window.cePrintRestore()", null);
                            }
                        }
                    };
                    manager.print("ChiffrEcoPro", adapter,
                            new PrintAttributes.Builder()
                                    .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                                    .build());
                } catch (RuntimeException error) {
                    if (webView != null) {
                        webView.evaluateJavascript("window.cePrintRestore && window.cePrintRestore()", null);
                    }
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
