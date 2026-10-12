package fr.chiffrecopro.app;

import android.app.Activity;
import android.content.Intent;
import android.view.ViewGroup;
import android.webkit.WebView;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

/**
 * Runs the real native Android WebView, not just a mobile-sized desktop browser.
 * Uses a calculation-only smoke test and does not save estimates or account data.
 */
@RunWith(AndroidJUnit4.class)
public class CalculatorParityInstrumentedTest {
    @Test
    public void nativeWebViewUsesSharedCalculatorAndShowsExpectedTotals() throws Exception {
        final Activity activity = InstrumentationRegistry.getInstrumentation().startActivitySync(
                new Intent(InstrumentationRegistry.getInstrumentation().getTargetContext(), MainActivity.class)
                        .putExtra("chiffreco_test_url", "http://10.0.2.2:4173/")
                        .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));

        try {
            final WebView webView = (WebView) ((ViewGroup) activity.findViewById(android.R.id.content)).getChildAt(0);
            assertNotNull("MainActivity should expose its WebView as the content view", webView);

            String ready = null;
            long deadline = System.nanoTime() + TimeUnit.SECONDS.toNanos(90);
            while (System.nanoTime() < deadline) {
                ready = evaluate(webView,
                        "JSON.stringify({ready:document.readyState,calc:typeof window.calc,docs:window.makeQuote&&window.makeQuote.name==='createQuote',part:typeof window.cePartPrepareQuote==='function',barometer:typeof window.ceBarometre==='function',runtimeCount:[...document.scripts].filter(s=>s.src.includes('runtime-stability.js')).length,qty:!!document.getElementById('hours')})");
                JSONObject state = new JSONObject(ready);
                if ("function".equals(state.optString("calc")) && state.optBoolean("docs") && state.optBoolean("part") && state.optBoolean("barometer") && state.optInt("runtimeCount") == 1 && state.optBoolean("qty")) {
                    break;
                }
                Thread.sleep(500);
            }
            assertNotNull("The live Chiffr’EcoPro page did not finish loading its calculator", ready);
            JSONObject state = new JSONObject(ready);
            assertEquals("function", state.optString("calc"));
            assertTrue("Current quote handler should be ready", state.optBoolean("docs"));
            assertTrue("Private workflow should be ready", state.optBoolean("part"));
            assertTrue("PRO barometer should be ready", state.optBoolean("barometer"));
            assertEquals("Runtime script should load once", 1, state.optInt("runtimeCount"));

            String resultJson = evaluate(webView,
                    "(function(){"
                    + "document.getElementById('hours').value='3';"
                    + "document.getElementById('rate').value='16';"
                    + "document.getElementById('travel').value='0';"
                    + "document.getElementById('other').value='0';"
                    + "document.getElementById('margin').value='25';"
                    + "document.getElementById('vat').value='20';"
                    + "document.getElementById('qty').value='0';"
                    + "document.getElementById('unit').value='forfait';"
                    + "var r=window.calc();"
                    + "return JSON.stringify({direct:r.direct,ht:r.ht,ttc:r.ttc,"
                    + "costText:document.getElementById('cost').textContent,"
                    + "htText:document.getElementById('ht').textContent,"
                    + "ttcText:document.getElementById('ttc').textContent,"
                    + "runtimeError:!!document.getElementById('ceRuntimeError')});"
                    + "})()");
            JSONObject result = new JSONObject(resultJson);
            assertEquals(48.0, result.getDouble("direct"), 0.001);
            assertEquals(64.0, result.getDouble("ht"), 0.001);
            assertEquals(76.8, result.getDouble("ttc"), 0.001);
            assertTrue("Cost must be visible", !result.optString("costText").trim().isEmpty());
            assertTrue("HT total must be visible", !result.optString("htText").trim().isEmpty());
            assertTrue("TTC total must be visible", !result.optString("ttcText").trim().isEmpty());
            assertTrue("Runtime error banner should not appear", !result.optBoolean("runtimeError"));

            String proQuantityJson = evaluate(webView,
                    "(function(){"
                    + "var q=document.getElementById('qty'),u=document.getElementById('unit');"
                    + "u.value='m²';q.value='2';var two=window.calc().direct;"
                    + "q.value='4';var four=window.calc().direct;"
                    + "return JSON.stringify({two:two,four:four});"
                    + "})()");
            JSONObject proQuantity = new JSONObject(proQuantityJson);
            assertTrue("PRO total must not fall when quantity rises from 2 to 4",
                    proQuantity.getDouble("four") >= proQuantity.getDouble("two"));

            // Also verify the private estimate cannot decrease when only quantity increases.
            String estimateJson = evaluate(webView,
                    "(function(){"
                    + "document.querySelectorAll('.page').forEach(function(s){s.classList.remove('active')});"
                    + "document.getElementById('particulier').classList.add('active');"
                    + "var q=document.getElementById('pq');"
                    + "q.value='1';window.estimate();var one=document.getElementById('range').textContent.match(/[0-9]+(?:[.,][0-9]+)?/g);"
                    + "q.value='6';window.estimate();var six=document.getElementById('range').textContent.match(/[0-9]+(?:[.,][0-9]+)?/g);"
                    + "return JSON.stringify({min1:Number(one[0].replace(',','.')),max1:Number(one[1].replace(',','.')),"
                    + "min6:Number(six[0].replace(',','.')),max6:Number(six[1].replace(',','.'))});"
                    + "})()");
            JSONObject estimate = new JSONObject(estimateJson);
            assertTrue("Minimum estimate must rise from quantity 1 to 6",
                    estimate.getDouble("min6") > estimate.getDouble("min1"));
            assertTrue("Maximum estimate must rise from quantity 1 to 6",
                    estimate.getDouble("max6") > estimate.getDouble("max1"));
        } finally {
            InstrumentationRegistry.getInstrumentation().runOnMainSync(activity::finish);
        }
    }

    private static String evaluate(WebView webView, String script) throws Exception {
        final CountDownLatch latch = new CountDownLatch(1);
        final AtomicReference<String> result = new AtomicReference<>();
        InstrumentationRegistry.getInstrumentation().runOnMainSync(
                () -> webView.evaluateJavascript(script, value -> {
                    result.set(value);
                    latch.countDown();
                }));
        assertTrue("WebView JavaScript evaluation timed out", latch.await(15, TimeUnit.SECONDS));
        String raw = result.get();
        assertNotNull("WebView returned no JavaScript result", raw);
        // evaluateJavascript JSON-encodes a returned JavaScript string.
        if (raw.startsWith("\"") && raw.endsWith("\"")) {
            raw = new org.json.JSONArray("[" + raw + "]").getString(0);
        }
        return raw;
    }
}
