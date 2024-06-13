# How to run this app:

## First create an .env file contains

```
  NODE_ENV="development" or "production"
```

## Secound create an .env.development.local file contains

```
  PORT=3001

  # Database connection
  DB_NAME="{your database name}"
  DB_HOST="{your database host}"
  DB_PORT={your database port}
  DB_USERNAME="{your database username}"
  DB_PASSWORD="{your database password}"

  # Token Key Validate User
  ACCESS_TOKEN_KEY="{your access token jwt key}"
  REFRESH_TOKEN_KEY="{your refresh token jwt key}"

  # Cloudinary connection
  CLOUDINARY_NAME={your cloudinary name}
  CLOUDINARY_API_KEY={your cloudinary api key}
  CLOUDINARY_API_SECRET={your cloudinary api secret}

  # Mail Service
  MAIL_HOST=smtp.gmail.com
  MAIL_PORT=587
  MAIL_USER={your email}
  MAIL_PASSWORD={your email password}
  DEFAULT_MAIL_FROM={your email}

  # Redis connection
  REDIS_HOST=localhost
  REDIS_PORT=6379



```

## Third create database named JWAT-Knowledge-Sharing

## Then run migration:

Generate if needed (Optional):

```
  npm run migration:generate -- database/migrations/init
```

If the database/migrations had enough file:

```
  npm run migration:run
```

# How to debug this app:

### First open this project folder in a whole new vscode

### Then run the command

```
  npm run start:debug
```

### After that open the debug window in the sidebar of vscode and click the 'start debug' icon

### Finally put the break point to anywhere you want to debug

# How to backup the database

### First now need to access to the cloud database using dbeaver

### Then open the server -> open the database -> right click on it -> tools -> backup

### When the dialog appears -> click all to backup all tables -> next -> encoding: UTF-8 -> change the stored file backup if needed

### In that window, click to the local client (button) -> point to the directory that store psql version 16 cause the cloud run on psql 16

### Finally start backup
