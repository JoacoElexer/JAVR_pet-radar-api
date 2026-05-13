import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as appInsights from 'applicationinsights';

@Injectable()
export class TelemetryService implements OnModuleInit {
    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const connectionString = this.configService.get<string>('APPLICATIONINSIGHTS_CONNECTION_STRING');

        if (connectionString) {
            appInsights.setup(connectionString)
                .setAutoDependencyCorrelation(true)
                .setAutoCollectRequests(true)
                .setAutoCollectPerformance(true, true)
                .setAutoCollectExceptions(true)
                .setAutoCollectDependencies(true)
                .setAutoCollectConsole(true)
                .setUseDiskRetryCaching(true)
                .setSendLiveMetrics(true)
                .start();

            console.log('Application Insights inicializado correctamente');
        } else {
            console.warn('APPLICATIONINSIGHTS_CONNECTION_STRING no encontrada. Telemetría desactivada.');
        }
    }
}