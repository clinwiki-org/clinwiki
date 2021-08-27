let config = {};

export const loadConfig = () => {
  config.port = process.env.PORT || 8088;
  config.postgresUrl = process.env.DATABASE_URL_NODE || 'changeme';
  config.aactUrl = process.env.DATABASE_URL_NODE || 'changeme';
  config.hasuraUrl = process.env.HASURA_CLINWIKI_URL || 'changeme';
  config.hasuraUrlDIS = process.env.HASURA_DIS_URL || 'changeme';
  config.searchboxUrl = process.env.SEARCHBOX_URL_NODE || 'changeme';
  config.elasticMaxResults = process.env.ELASTICSEARCH_MAXRESULTS || 100;
  config.smtpHost = process.env.SMTP_HOST || 'changeme';
  config.smtpPort = process.env.SMTP_PORT || 'changeme';
  config.smtpUser = process.env.SMTP_USER || 'changeme';
  config.smtpPassword = process.env.SMTP_PASSWORD || 'changeme';
  config.outboundEmail = process.env.SMTP_OUTBOUND_EMAIL || 'no-reply@yourdomain.com';
  config.webUrl = process.env.WEB_URL || 'changeme';
  config.jwtSecret = process.env.SECRET_KEY_BASE_NODE || 'InsertSecretHere';
  config.jwtExpire = process.env.JWT_EXPIRATION_TIME_SECS || 86400;
  (config.googleClientId = process.env.GOOGLE_CLIENT_ID || 'GoogleIdHere'),
  (config.aactCronTab = process.env.AACT_CRONTAB || '0 1 * * *');
  config.clinwikiCronTab = process.env.CLINWIKI_CRONTAB || '*/1 * * * *';
  config.elasticIndex = process.env.ELASTICSEARCH_INDEX || 'studies_development';
  config.elasticIndexDIS = process.env.ELASTICSEARCH_INDEX_DIS || 'dis_development';
  config.secretKeyDis = process.env.HASURA_DIS_SECRET_KEY || 'changeme';
  config.secretKeyClinwiki = process.env.HASURA_CLINWIKI_SECRET_KEY || 'changeme';
  config.adminSecretKey = process.env.HASURA_ADMIN_SECRET_KEY || 'changeme';
  config.defaultApp = process.env.DEFAULT_APPLICATION || 'clinwiki';
};

export default config;
