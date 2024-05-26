# How to run this app:

## First create an .env file contains
  ```
    NODE_ENV="development" or "production"
  ```

## Second create database named JWAT-Knowledge-Sharing

## Then run migration:

  Generate if needed (Optional):
  ```
    npm run migration:generate -- database/migrations/init
  ```
  If the database/migrations had enough file:
  ```
    npm run migration:run
  ```