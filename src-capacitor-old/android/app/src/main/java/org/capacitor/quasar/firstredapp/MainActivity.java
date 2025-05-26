package org.capacitor.quasar.firstredapp;

import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.Manifest;
import android.content.pm.PackageManager;


import com.getcapacitor.BridgeActivity;
//import com.google.firebase.dataconnect.LogLevel;
//import com.pusher.pushnotifications.PushNotifications;

import java.util.Set;
//import com.pusher.pushnotifications.logging.LogLevel;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 🔒 Solicitar permiso para notificaciones (Android 13+)
        /*if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1001);
            }
        }*/

        /*PushNotifications.start(getApplicationContext(), "e8768972-b1ad-41b2-91be-0b3a641439bd");
        PushNotifications.addDeviceInterest("hello");*/
    }
}
