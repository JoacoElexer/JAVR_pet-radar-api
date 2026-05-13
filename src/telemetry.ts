import * as appInsights from 'applicationinsights';

export function initTelemetry(): void {
    const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

    if (!connectionString) {
        console.warn(
            '[Telemetry] APPLICATIONINSIGHTS_CONNECTION_STRING no definida — Application Insights deshabilitado.',
        );
        return;
    }

    appInsights
        .setup(connectionString)
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(true)
        .start();

    console.log('[Telemetry] Application Insights inicializado.');
}