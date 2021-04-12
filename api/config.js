let config = {};

export const loadConfig = () => {
    config.port=process.env.NODE_PORT || 8088;
    config.postgresUrl= process.env.DATABASE_URL_NODE || 'changeme';
    config.searchboxUrl= process.env.SEARCHBOX_URL_NODE || 'changeme';
    config.elasticMaxResults = process.env.ELASTICSEARCH_MAXRESULTS || 100;
    config.smtpHost= process.env.SMTP_HOST || 'changeme';
    config.smtpPort= process.env.SMTP_PORT || 'changeme';
    config.smtpUser= process.env.SMTP_USER || 'changeme';
    config.smtpPassword= process.env.SMTP_PASSWORD || 'changeme';
    config.outboundEmail= process.env.SMTP_OUTBOUND_EMAIL || 'no-reply@yourdomain.com';
    config.webUrl= process.env.WEB_URL || 'changeme';
    config.jwtSecret = process.env.SECRET_KEY_BASE_NODE || 'InsertSecretHere';
    config.jwtExpire = process.env.JWT_EXPIRATION_TIME_SECS || 86400;
    config.googleClientId = process.env.GOOGLE_CLIENT_ID || 'GoogleIdHere'
    
}

export default config;