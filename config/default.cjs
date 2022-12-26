const {
    SECRET_LOCAL_HOSTNAME = '0.0.0.0',
    SECRET_PORT = '3000',
    SECRET_HOST = '',
    SECRET_MASTER_KEY = '11111222223333344444555556666677', // has to be 32 in length
    SECRET_REDIS_HOST = '0.0.0.0',
    SECRET_REDIS_PORT = 6379,
    SECRET_REDIS_USER = null,
    SECRET_REDIS_PASSWORD = null,
    SECRET_REDIS_TLS = 'false',
    SECRET_JWT_SECRET = 'good_luck_have_fun',
    SECRET_ENABLE_FILE_UPLOAD = 'true',
    SECRET_DISABLE_USERS = 'false',
    SECRET_FILE_SIZE = 4, // 4 mb
    SECRET_FORCED_LANGUAGE = 'en',
    SECRET_DO_SPACES_ENDPOINT = 'https://fra1.digitaloceanspaces.com',
    SECRET_DO_SPACES_KEY = '',
    SECRET_DO_SPACES_SECRET = '',
    SECRET_DO_SPACES_BUCKET = 'hemmelig',
    SECRET_DO_SPACES_FOLDER = 'localhost.hemmelig.app',
    SECRET_MAX_TEXT_SIZE = 256, // 256 kb
    NODE_ENV = 'development',
    OAUTH_SCOPES = ['openid'],
    CLIENT_ID = '<CLIENT ID>',
    CLIENT_SECRET = '<CLIENT SECRET>',
    AUTH_HOST = '',
    AUTH_PATH = '',
    TOKEN_HOST = '',
    TOKEN_PATH = '',
    OAUTH_REDIRECT_PATH = '/signin',
    OAUTH_CALLBACK_HOST = '',
    OAUTH_CALLBACK_PATH = '/signin/callback',
} = process.env;

const config = {
    localHostname: SECRET_LOCAL_HOSTNAME,
    env: NODE_ENV,
    host: SECRET_HOST,
    port: SECRET_PORT,
    secret_key: SECRET_MASTER_KEY,

    auth: {
        scope: OAUTH_SCOPES,
        id: CLIENT_ID,
        secret: CLIENT_SECRET,
        authorizeHost: AUTH_HOST,
        authorizePath: AUTH_PATH,
        tokenHost: TOKEN_HOST,
        tokenPath: TOKEN_PATH,
        startRedirectPath: OAUTH_REDIRECT_PATH,
        callbackHost: OAUTH_CALLBACK_HOST,
        callbackPath: OAUTH_CALLBACK_PATH,
    },

    // choose digital ocean/s3 or disk
    file: {
        size: SECRET_FILE_SIZE,
        adapter: !!SECRET_DO_SPACES_SECRET ? 'do' : 'disk',
    },
    redis: {
        host: SECRET_REDIS_HOST,
        port: SECRET_REDIS_PORT,
        user: SECRET_REDIS_USER,
        password: SECRET_REDIS_PASSWORD,
        tls: SECRET_REDIS_TLS === 'true',
    },
    jwt: {
        secret: SECRET_JWT_SECRET,
    },
    api: {
        maxTextSize: SECRET_MAX_TEXT_SIZE * 1000, //  256 000 bytes
    },
    // Digital Ocean
    do: {
        spaces: {
            endpoint: SECRET_DO_SPACES_ENDPOINT,
            key: SECRET_DO_SPACES_KEY,
            secret: SECRET_DO_SPACES_SECRET,
            bucket: SECRET_DO_SPACES_BUCKET,
            folder: SECRET_DO_SPACES_FOLDER,
        },
    },
    disk: {
        // /var/tmp files can live up to 30 days
        folder: `/var/tmp/hemmelig/upload/files/`,
    },
    user: {
        disabled: JSON.parse(SECRET_DISABLE_USERS),
    },
    logger: true,
    cors: '*',
    __client_config: {
        api: {
            host: '/api',
        },
        settings: {
            enableFileUpload: JSON.parse(SECRET_ENABLE_FILE_UPLOAD),
            disableUsers: JSON.parse(SECRET_DISABLE_USERS),
            forcedLanguage: SECRET_FORCED_LANGUAGE,
        },
    },
};

module.exports = config;
