# How to run this app:

## Run with docker-compose:

### First create a docker-compose file

```
  version: '1.0'

services:

  redis:
    image: redis
    ports:
      - 6379:6379
    volumes:
      - redis-data:/data
    healthcheck:
      test: [ "CMD", "redis-cli", "--raw", "incr", "ping" ]
      interval: 2s
      timeout: 2s
      retries: 2

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.14.1
    environment:
      - node.name=elasticsearch
      - cluster.name=datasearch
      - xpack.security.enabled=false
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - cluster.initial_master_nodes=elasticsearch
    ulimits:
      memlock:
        soft: -1
        hard: -1
    ports:
      - "9200:9200"
    volumes:
      - esdata:/usr/share/elasticsearch/data
    healthcheck:
      test:
        [
          "CMD",
          "curl",
          "-f",
          "http://localhost:9200/_cluster/health"
        ]
      interval: 30s
      timeout: 10s
      retries: 5

  backend:
    image: rockyoperation/knowledge-sharing-backend
    ports:
      - 3001:3001
    environment:
      PORT: ${PORT}
      DB_NAME: ${DB_NAME}
      DB_PORT: ${DB_PORT}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_HOST: ${DB_HOST}
      ACCESS_TOKEN_KEY: ${ACCESS_TOKEN_KEY}
      REFRESH_TOKEN_KEY: ${REFRESH_TOKEN_KEY}
      CLOUDINARY_NAME: ${CLOUDINARY_NAME}
      CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY}
      CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET}
      MAIL_HOST: ${MAIL_HOST}
      MAIL_PORT: ${MAIL_PORT}
      MAIL_USER: ${MAIL_USER}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
      DEFAULT_MAIL_FROM: ${DEFAULT_MAIL_FROM}
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT}
      ELASTICSEARCH_NODE: ${ELASTICSEARCH_NODE}
    depends_on:
      redis:
        condition: service_healthy
      elasticsearch:
        condition: service_healthy

volumes:
  redis-data:
  esdata:
    driver: local

```

### Second create an .env file contains all the infomation (provided later)

### Finally run docker-compose

```
  docker-compose -f docker-compose.yml up -d
```

## Run with only the backend server

### First create an .env file contains

```
  NODE_ENV="development" or "production"
```

### Second create an .env.development.local file contains

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

  # Elastic connection
  ELASTICSEARCH_NODE=http://localhost:9200

```

### Third create database named JWAT-Knowledge-Sharing in the postgres database

### Then run migration:

Generate if needed (Optional):

```
  npm run migration:generate -- database/migrations/init
```

If the database/migrations had enough file:

```
  npm run migration:run
```

## Last run the app

```
  npm run start:dev
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
