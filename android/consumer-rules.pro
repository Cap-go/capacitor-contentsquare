# Consumer ProGuard rules for @capgo/capacitor-contentsquare.
# Apps that enable R8 in release (Capacitor 9 default) merge these rules automatically via consumerProguardFiles.

# Capacitor core already ships consumer rules for @CapacitorPlugin classes (see @capacitor/android proguard-rules.pro). This file only adds keeps the Contentsquare SDK needs beyond that.

# ContentsquareTelemetry uses Class.forName on this type, constructs it with newInstance, then getDeclaredMethods plus invoke for telemetryCollect and telemetrySetXPFType.
-keep class com.contentsquare.android.api.bridge.telemetry.TelemetryInterface { *; }

# ContentsquarePlugin uses getDeclaredMethod for registerExternalBridge and unregisterExternalBridge and getDeclaredField for INSTANCE on this Kotlin object.
-keep class com.contentsquare.android.api.bridge.xpf.XpfInterface { *; }
