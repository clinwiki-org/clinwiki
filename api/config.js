let config = {};

export const loadConfig = () => {
    config.port=process.env.NODE_PORT || 8088;
    config.postgresUrl= process.env.DATABASE_URL || 'postgres://clinwiki:ZetIFOnXd78H@localhost:15432/clinwiki';
    config.elasticsearchHost= process.env.ELASTICSEARCH_HOSTS || 'http://localhost:9200';
    config.elasticsearchUsername= process.env.ELASTICSEARCH_USERNAME || 'elastic';
    config.elasticsearchPassword= process.env.ELASTICSEARCH_PASSWORD || 'k1o9sbDRgeq2';
    config.smtpHost= process.env.SMTP_HOST || 'smtp.mailtrap.io';
    config.smtpPort= process.env.SMTP_PORT || '2525';
    config.smtpUser= process.env.SMTP_USER || '1e772c663f814c';
    config.smtpPassword= process.env.SMTP_PASSWORD || 'b84846af96f031';
    config.outboundEmail= process.env.SMTP_OUTBOUND_EMAIL || 'no-reply@yourdomain.com';
    config.webUrl= process.env.WEB_URL || 'http://localhost:3001';
    config.jwtSecret = process.env.SECRET_KEY_BASE || 'InsertSecretHere';
    config.jwtExpire = process.env.JWT_EXPIRATION_TIME_SECS || 86400;
    config.googleClientId = process.env.GOOGLE_CLIENT_ID || 'GoogleIdHere'
    
}

export default config;