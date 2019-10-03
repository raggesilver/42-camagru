# Camagru

First project @ 42SiliconValley's web branch.

## ENV

There are a few **required environment variables** for Camagru server to run:
- `DB_URL`: String, connection string for mongodb
- `DEV`: Boolean, controls debug level
- `JWT_KEY`: String, random hash to secure json-web-tokens
- `MAIL_USER`: String, email address used to send application emails to users
- `MAIL_PASS`: String, email password
- `APP_URL`: String, base url for the app (on dev should be `localhost:3000`)

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
