<div align="center">
  <img src="banner.png" alt="hemmelig" />
</div>

<h1 align="center">Free encrypted secret sharing for everyone! - With SSO Support!</h1>

<div align="center">
  This application is to be used to share encrypted secrets cross organizations, or as private persons. Hemmelig truly cares about your privacy, and will do everything to stay that way. I hope you enjoy the product.
</div>

## SaaS

The original Hemmelig app is available at [https://hemmelig.app](https://hemmelig.app)

![Desktop](desktop.png)


## How it works

You enter [https://hemmelig.app](https://hemmelig.app), write your sensitive information, expire time, optional password, and click create a secret link. You share the secret link. The receiver of the link opens it, writes the optional password, and retrieves the sensitive information.
When a secret link is created, it gets its unique encryption key that is not saved to the database and only will be part of the URL. This is how the encryption works: `encrypt(DATA, YOUR_UNIQUE_ENCRYPTION_KEY)`. The encryption of the text and files is done in the client; this means the server will get the encrypted information, and nothing in clear text.

This build uses [https://github.com/fastify/fastify-oauth2](fastify-oauth2) to handle authentication with all the original signup and signin ability removed. If you enable users, you will need to define the SSO Environment variables.

NOTE: I built this in half a day, I can not vouch for this codebase's security. I have made every effort to ensure it is safe and secure but am no expert. If you find an issue please do feel free to submit a pull request!   

## Features
- OpenID Connect SSO Support! 
- Client side encryption
- Encrypted sensitive information sharing
- Encrypted file upload for signed in users
- Secret lifetime
- Set max views per secret
- Optional encrypted title
- Optional password protection
- Optional IP address restriction
- QR Code of the secret link
- Encrypted key is part of the URL, and not saved to the database for an extra layer of security
- It will detect if the secret is base64 encoded, and add a button to convert it to plain text on read
- Self-hosted version. Keywords: Regulatory compliance
- CLI Support

## Self-hosting

```bash
# To use this image you need a redis database enabled.
# Example:
#
# $ docker run -p 6379:6379 --name some-redis -d redis
#

You can use [docker-compose](https://docs.docker.com/compose/):

```bash
# get the repo
git clone https://github.com/calw20/Hemmelig.app.git
cd Hemmelig.app

# edit docker-compose.yml to add your SSO details
vi docker-compose.yml

# start hemmelig & redis
docker-compose up -d

# stop container
docker-compose down
```

Have a look at the Dockerfile for a full example of how to run this application.

## CLI

Hemmelig can be used as a CLI to create secrets on the fly

```bash
# Pipe data to hemmelig
cat mysecretfile | npx hemmelig

# For the documentaiton
npx hemmelig --help
```

## Environment variables

| ENV vars                      | Description                                                           | Default            |
| ------------------------------|:---------------------------------------------------------------------:| ------------------:|
| `SECRET_LOCAL_HOSTNAME`       | The local hostname for the fastify instance                           | 0.0.0.0            |
| `SECRET_PORT`                 | The port number for the fastify instance                              | 3000               |
| `SECRET_HOST`                 | Used for i.e. set cors to your domain name                            | ""                 |
| `SECRET_REDIS_HOST`           | Override this for your redis host address                             | ""                 |
| `SECRET_REDIS_PORT`           | The redis port number                                                 | 6379               |
| `SECRET_REDIS_TLS`            | If the redis instance is using tls                                    | false              |
| `SECRET_REDIS_USER`           | Your redis user name                                                  | ""                 |
| `SECRET_REDIS_PASSWORD`       | Your redis password                                                   | ""                 |
| `SECRET_MAX_TEXT_SIZE`        | The max text size for the secret. Is set in kb. i.e. 256 for 256kb.   | 256                |
| `SECRET_JWT_SECRET`           | Override this for the secret signin JWT tokens for log in             | good_luck_have_fun |
| `SECRET_FILE_SIZE`            | Set the total allowed upload file size in mb.                         | 4                  |
| `SECRET_ENABLE_FILE_UPLOAD`   | Enable or disable file upload                                         | true               |
| `SECRET_DISABLE_USERS`        | Disable user registration                                             | false              |
| `SECRET_FORCED_LANGUAGE`      | Set the default language for the application.                         | en                 |
| `SECRET_DO_SPACES_ENDPOINT`   | The Digital Ocean Spaces/AWS s3 endpoint                              | ""                 |
| `SECRET_DO_SPACES_KEY`        | The Digital Ocean Spaces/AWS s3 key                                   | ""                 |
| `SECRET_DO_SPACES_SECRET`     | The Digital Ocean Spaces/AWS s3 secret                                | ""                 |
| `SECRET_DO_SPACES_BUCKET`     | The Digital Ocean Spaces/AWS s3 bucket name                           | ""                 |
| `SECRET_DO_SPACES_FOLDER`     | The Digital Ocean Spaces/AWS s3 folder for the uploaded files         | ""                 |
| `CLIENT_ID`                   | OpenID Connect Client ID                                              | ""                 |
| `CLIENT_SECRET`               | OpenID Connect Client Secret                                          | ""                 |
| `AUTH_HOST`                   | Authentication Host                                                   | ""                 |
| `AUTH_PATH`                   | Authentication Path                                                   | ""                 |
| `TOKEN_HOST`                  | Token Host                                                            | ""                 |
| `TOKEN_PATH`                  | Token Path                                                            | ""                 |
| `OAUTH_CALLBACK_HOST`         | oAuth Callback Host                                                   | ""                 |


## Supported languages

Have a look at the `public/locales/` folder.

## Run locally

```bash
# First you have to run redis
# Example by using docker
docker run -itd -p 6379:6379 redis

npm install

# Start the frontend/backend
npm run dev
# http://0.0.0.0:3000

```

## Contribution

Feel free to contribute to this repository. Have a look at CONTRIBUTION.md for guidelines.
