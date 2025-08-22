package org.firstred.jpcustody.com;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;


import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Enable edge-to-edge y control insets
//        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Apply the edge-to-edge mode official recommended
//        EdgeToEdge.enable(this);
    }
}
