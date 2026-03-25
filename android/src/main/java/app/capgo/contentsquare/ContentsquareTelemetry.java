package app.capgo.contentsquare;

import java.lang.reflect.Method;

public class ContentsquareTelemetry {

    private static final String XPF_TYPE = "CAPACITOR";

    private final Object telemetryInstance;
    private final Method telemetryCollect;
    private final Method telemetrySetXPFType;

    public ContentsquareTelemetry() throws Exception {
        final Class<?> telemetryInterface = Class.forName("com.contentsquare.android.api.bridge.telemetry.TelemetryInterface");
        telemetryInstance = telemetryInterface.newInstance();

        Method collect = null;
        Method setType = null;

        for (Method method : telemetryInterface.getDeclaredMethods()) {
            if (method.getName().equals("telemetryCollect")) {
                collect = method;
            } else if (method.getName().equals("telemetrySetXPFType")) {
                setType = method;
            }
        }

        telemetryCollect = collect;
        telemetrySetXPFType = setType;
    }

    public void collect(final String name, final String value) throws Exception {
        if (telemetryCollect != null) {
            telemetryCollect.invoke(telemetryInstance, name, value);
        }
    }

    public void setXPFType() throws Exception {
        if (telemetrySetXPFType != null) {
            telemetrySetXPFType.invoke(telemetryInstance, XPF_TYPE);
        }
    }
}
