Run migration before run app:

  Generate if needed (Optional):
  ```
    npm run migration:generate -- database/migrations/init
  ```
  If the database/migrations had enough file:
  ```
    npm run migration:run
  ```