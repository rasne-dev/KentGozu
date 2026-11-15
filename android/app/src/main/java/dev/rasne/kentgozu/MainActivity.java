package dev.rasne.kentgozu;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(KentGozuNativePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
