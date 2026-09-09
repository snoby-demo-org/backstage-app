/*
 * OpenTelemetry SDK bootstrap for the Backstage backend.
 *
 * Imported FIRST in src/index.ts so auto-instrumentation patches
 * express/http/pg before any backend plugin loads them.
 *
 * Traces -> OTLP HTTP to the in-cluster collector (Tempo behind it).
 * Metrics -> Prometheus exporter on :9464 (scraped by Prometheus, B2 path).
 * All endpoints overridable via env; sane in-cluster defaults.
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'backstage';
const otlpEndpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
  'http://otel-collector.otel.svc.cluster.local:4318';
const metricsPort = Number(process.env.OTEL_PROMETHEUS_PORT ?? '9464');

const traceExporter = new OTLPTraceExporter({
  url: `${otlpEndpoint}/v1/traces`,
});
const prometheusExporter = new PrometheusExporter({ port: metricsPort });

const sdk = new NodeSDK({
  serviceName,
  traceExporter,
  metricReader: prometheusExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
    }),
  ],
});

try {
  sdk.start();
  // eslint-disable-next-line no-console
  console.log(
    `OTel: service=${serviceName} traces->${otlpEndpoint}/v1/traces metrics=:${metricsPort}/metrics`,
  );
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('OTel SDK failed to start, continuing without telemetry', err);
}
