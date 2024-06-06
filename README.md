# How to run this app:

## First create an .env file contains

```
  NODE_ENV="development" or "production"
```

## Secound create an .env.development.local file contains

```
  PORT=3000

  # Database connection
  DB_NAME="{your db name}"
  DB_HOST="{your db host}"
  DB_PORT={your db port}
  DB_USERNAME="{your db name}"
  DB_PASSWORD="{your db password}"
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
