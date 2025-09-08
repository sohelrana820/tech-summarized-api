export const appConfig = () => ({
  env: process.env.NODE_ENV || 'development',
  appTimezone: process.env.TZ || 'asia/dhaka',
  name: process.env.APP_NAME || 'NODE APP',
  version: parseFloat(process.env.APP_VERSION || '1.0'),
  protocol: process.env.APP_PROTOCOL || 'https',
  host: process.env.APP_HOST || 'localhost',
  port: parseInt(process.env.PORT || '3000', 10),
  proxyIp: process.env.PROXY_IP || '192.168.128.5',
  proxyPort: parseInt(process.env.PROXY_PORT || '3829', 10),
  url:
    process.env.APP_URL ||
    `${process.env.APP_PROTOCOL || 'https'}://${process.env.APP_HOST || 'localhost'}:${process.env.APP_PORT || 3000}`,
  connectTimeout: parseInt(process.env.APP_CONNECT_TIMEOUT || '5', 10),
  requestTimeout: parseInt(process.env.APP_REQUEST_TIMEOUT || '15', 10),
  basicAuthUser: process.env.BASIC_AUTH_USER || 'pol',
  basicAuthPass: process.env.BASIC_AUTH_PASS || 'secret',
  lang: process.env.APP_LANG || 'en',
  sslCertPath:
    process.env.SSL_CERT_PATH || '/etc/ssl/certs/ssl-cert-snakeoil.pem',
  sslKeyPath:
    process.env.SSL_KEY_PATH || '/etc/ssl/certs/ssl-cert-snakeoil.key',
  allowedUnauthenticatedUrls: [
    '/health-check/liveness/queue',
    '/health-check/readiness',
  ],
  apiRequestTimeout: parseInt(process.env.API_REQUEST_TIMEOUT || '30000', 10),
  slaGraceTimeInSec: parseInt(process.env.SLA_GRACE_TIME_IN_SEC || '120', 10),
  solRedirectUrl: process.env.SOL_REDIRECT_URL,
  headerRemoveFromLog:
    process.env.SENSITIVE_HEADER_LISTS ||
    'Authorization, service-id, service-key, X-app-Key, X-app-Secret, X-Authorization-Key, X-Client-Secret, sourceSystemId',
  offerIdIneligibleChannels:
    process.env.OFFER_ID_INELIGIBLE_CHANNELS || 'skitto',
  customerNotificationIneligibleChannels:
    process.env.CUSTOMER_NOTIFICATION_INELIGIBLE_CHANNELS || 'skitto',
  lockTimeoutInSeconds: Number(process.env.LOCK_TIMEOUT_IN_SECONDS) || 30,
  pollingIntervalInMs: Number(process.env.POLLING_INTERVAL_IN_MS) || 100,
  fetchHourlyCrmDataCronEnabled:
    process.env.FETCH_HOURLY_CRM_DATA_CRON_ENABLED !== 'false',
});
