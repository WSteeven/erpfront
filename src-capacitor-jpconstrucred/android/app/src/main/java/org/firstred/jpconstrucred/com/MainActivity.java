package org.firstred.jpconstrucred.com;

import static android.util.Log.INFO;

import android.util.Log;
import android.view.View;

import com.getcapacitor.BridgeActivity;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

import java.util.Objects;

public class MainActivity extends BridgeActivity {
    private static final int UPDATE_REQUEST_CODE = 123;
    private AppUpdateManager appUpdateManager;
    private InstallStateUpdatedListener installStateUpdatedListener;


    @Override
    public void onResume() {
        super.onResume();

        appUpdateManager = AppUpdateManagerFactory.create(this);

        // Listener for detect state changes during update
        installStateUpdatedListener = state -> {
            if (state.installStatus() == InstallStatus.DOWNLOADED) {
                // show message to refresh the app
                showUpdateSnackbar();
            }
        };

        appUpdateManager.registerListener(installStateUpdatedListener);

        // verify if there are update available
        appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {

                try {
                    appUpdateManager.startUpdateFlowForResult(appUpdateInfo, this, AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build(), UPDATE_REQUEST_CODE);
                } catch (Exception e) {
                    Log.println(INFO, "MainActivityInApp", Objects.requireNonNull(e.getMessage()));
                }
            }
        });
    }

    @Override
    public void onDestroy() {
        if (appUpdateManager != null && installStateUpdatedListener != null) {
            appUpdateManager.unregisterListener(installStateUpdatedListener);
        }
        super.onDestroy();
    }

    // Method for showing the Snackbar
    private void showUpdateSnackbar() {
        View rootView = findViewById(android.R.id.content);
        Snackbar.make(rootView, "Nueva versión descargada", Snackbar.LENGTH_INDEFINITE).setAction("Reiniciar", v -> {
            if (appUpdateManager != null) {
                appUpdateManager.completeUpdate();
            }
        }).show();
    }
}
