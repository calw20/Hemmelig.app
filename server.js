import replace from 'replace-in-file';
import config from 'config';
import path from 'path';
import { fileURLToPath } from 'url';
import importFastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import fstatic from '@fastify/static';
import jwt from './src/server/decorators/jwt.js';
import oauthPlugin from '@fastify/oauth2';
import userFeatures from './src/server/decorators/user-features.js';
import rateLimit from './src/server/decorators/rate-limit.js';
import allowedIp from './src/server/decorators/allowed-ip.js';
import attachment from './src/server/decorators/attachment-upload.js';
import keyGeneration from './src/server/decorators/key-generation.js';

import authenticationRoute from './src/server/controllers/authentication.js';
import accountRoute from './src/server/controllers/account.js';
import downloadRoute from './src/server/controllers/download.js';
import secretRoute from './src/server/controllers/secret.js';
import statsRoute from './src/server/controllers/stats.js';
import healthzRoute from './src/server/controllers/healthz.js';

import * as redis from './src/server/services/redis.js';
import validator from 'validator';

const MAX_FILE_BYTES = 1024 * config.get('file.size') * 1000; // Example: 1024 * 2 * 1000 = 2 024 000 bytes

const fastify = importFastify({
    logger: config.get('logger'),
    bodyLimit: MAX_FILE_BYTES,
});

// https://github.com/fastify/fastify-helmet
fastify.register(helmet, { contentSecurityPolicy: false, crossOriginEmbedderPolicy: false });

// https://github.com/fastify/fastify-cors
fastify.register(cors, { origin: config.get('cors') });

// Define decorators
fastify.register(jwt);
fastify.register(userFeatures);
fastify.register(rateLimit);
fastify.register(allowedIp);
fastify.register(attachment);
fastify.register(keyGeneration);

fastify.register(oauthPlugin, {
    name: 'oauthPlugin',
    scope: config.get('auth.scope'),
    credentials: {
        client: {
            id: config.get('auth.id'),
            secret: config.get('auth.secret'),
        },
        auth: {
            authorizeHost: config.get('auth.authorizeHost'),
            authorizePath: config.get('auth.authorizePath'),
            tokenHost: config.get('auth.tokenHost'),
            tokenPath: config.get('auth.tokenPath'),
        },
    },
    startRedirectPath: config.get('auth.startRedirectPath'),
    callbackUri: config.get('auth.callbackHost') + config.get('auth.callbackPath'),
});

fastify.get(config.get('auth.callbackPath'), async (request, reply) => {
    const userToken = (await fastify.oauthPlugin.getAccessTokenFromAuthorizationCodeFlow(request))
        .token;
    const decodedAccessToken = fastify.jwt.decode(userToken.access_token);

    const userData = {
        username: decodedAccessToken.preferred_username,
        email: decodedAccessToken.email,
    };

    const user = await redis.getUser(validator.escape(userData.username));

    if (!user) {
        //Create the user if not existing
        const user = await redis.createUser(userData.username, userData.email, ''); //No passwords & can't auth anyway
    } else if (user.email != userData.email) {
        //Make sure the email is always correct.
        const user = await redis.updateUser(userData.email, {
            email: userData.email,
        });
    }

    const token = fastify.jwt.sign(
        {
            username: userData.username,
        },
        { expiresIn: '7d' }
    );

    let outDoc = '';
    outDoc += '<html><body><script>';
    outDoc += "window.localStorage.setItem('__HEMMELIG_TOKEN', '" + token + "');";
    outDoc += "window.location.replace('" + config.get('auth.callbackHost') + "');";
    outDoc += '</script></body></html>';

    return reply.status(200).type('text/html').send(outDoc);
});

fastify.register(authenticationRoute, {
    prefix: '/api/authentication',
});

fastify.register(accountRoute, {
    prefix: '/api/account',
});

fastify.register(downloadRoute, { prefix: '/api/download' });
fastify.register(secretRoute, { prefix: '/api/secret' });
fastify.register(statsRoute, { prefix: '/api/stats' });
fastify.register(healthzRoute, { prefix: '/api/healthz' });
fastify.register(healthzRoute, { prefix: '/healthz' });

// Static frontend for the production build
if (process.env.NODE_ENV !== 'development') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const staticPath = path.join(__dirname, 'build');

    replace.sync({
        files: staticPath + '/**/*.html',
        from: [/{{NODE_ENV}}/g, /__SECRET_CONFIG__/g],
        to: [process.env.NODE_ENV, `'${JSON.stringify(config.get('__client_config'))}';`],
    });

    fastify.register(fstatic, {
        root: staticPath,
        route: '/*',
    });

    function serveIndex(_, reply) {
        return reply.sendFile('index.html');
    }

    fastify.get('/secret/*', serveIndex);
    fastify.get('/about', serveIndex);
    fastify.get('/privacy', serveIndex);
    fastify.get('/api-docs', serveIndex);
    fastify.get('/account', serveIndex);
    fastify.get('/terms', serveIndex);
}

const startServer = async () => {
    try {
        await fastify.listen({ port: config.get('port'), host: config.get('localHostname') });
    } catch (err) {
        fastify.log.error(err);
    }
};

startServer();
