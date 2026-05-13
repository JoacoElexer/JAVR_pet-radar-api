import { Injectable } from '@nestjs/common';
import * as appInsights from 'applicationinsights';

@Injectable()
export class TelemetryService {
    private client: appInsights.TelemetryClient | null = null;

    constructor() {
        if (appInsights.defaultClient) {
            this.client = appInsights.defaultClient;
        }
    }

    trackEvent(name: string, properties?: Record<string, string>): void {
        if (!this.client) return;
        this.client.trackEvent({ name, properties });
    }

    trackMetric(name: string, value: number): void {
        if (!this.client) return;
        this.client.trackMetric({ name, value });
    }

    trackException(error: Error, properties?: Record<string, string>): void {
        if (!this.client) return;
        this.client.trackException({ exception: error, properties });
    }
}