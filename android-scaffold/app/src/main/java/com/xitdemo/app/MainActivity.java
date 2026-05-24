package com.xitdemo.app;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);

        webView.addJavascriptInterface(new Bridge(), "AndroidBridge");

        // Load the bundled web app. Place your files under app/src/main/assets/www/
        webView.loadUrl("file:///android_asset/www/index.html");
    }

    public class Bridge {
        @JavascriptInterface
        public void onToggle(String action) {
            // Safe UI feedback only
            runOnUiThread(() -> Toast.makeText(MainActivity.this, "Action: " + action, Toast.LENGTH_SHORT).show());
        }
    }
}
