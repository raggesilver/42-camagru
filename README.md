# Camagru

First project @ 42SiliconValley's web branch.

Camagru is a small web application that allows you to take and edit pictures to share them with the other users (Instagram inspired).

## Screenshots

| Feed | Photo | Profile editing |
| ---- | ----- | --------------- |
| ![Feed](https://imgur.com/RT04FtE.png) | ![Photo](https://imgur.com/7kRfHVg.png) | ![Photo](https://imgur.com/vRRSjfN.png) |

## ENV

There are a few **required environment variables** for Camagru server to run:
- `DB_URL`: String, connection string for mongodb
- `DEV`: Boolean, controls debug level
- `JWT_KEY`: String, random hash to secure json-web-tokens
- `MAIL_USER`: String, email address used to send application emails to users
- `MAIL_PASS`: String, email password
- `APP_URL`: String, base url for the app (on dev should be `http://localhost:8080`)
> :8080 is webpack's default port, even tho this setting is only for back-end it is used for front-end resources such as email links
- `IMGUR_CLIENT_ID`: String, credentials for imgur API
- `IMGUR_CLIENT_SECRET`: String, credentials for imgur API

## Setup/Install

```bash
git clone git@gitlab.com:raggesilver/camagru
cd camagru
yarn install
# Get .env file
# Modify APP_URL to whatever makes sense
cd front
yarn install
yarn run build
cd ..
node -r dotenv/config server # or yarn run server
```

## API

API endpoints can be accessed from `/api`.

### `/api/user`

| Endpoint | Type | Body | Response | Description |
| -------- | ---- | ---- | -------- | ----------- |
| `/api/user/me` | GET | | JSON     | Get logged user info |

### `/api/auth`

| Endpoint | Type | Body | Response | Description |
| -------- | ---- | ---- | -------- | ----------- |
| `/api/auth/register` | POST | JSON Object | OK/\<ERROR_MESSAGE> | Register a new user |

### `/api/post`

| Endpoint | Type | Body | Response | Description |
| -------- | ---- | ---- | -------- | ----------- |
| `/api/post` | GET | JSON Array | OK/\<ERROR_MESSAGE> | Get all posts |

> Default error for API is: `{ error: 'Human readable error' }`. For API error identifing the status code should be checked

## Todo

- Delete posts
- Login with username
- Thumbnails with previous pictures
- Forgot password email link

## Bonuses

- "AJAXIFIED" - it's axios actually
- Infinite gallery
- Time ago countdown
- Hashtag highlight
- Filters
- Auto login on register
