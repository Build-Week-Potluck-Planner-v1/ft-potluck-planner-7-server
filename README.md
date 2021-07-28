## API

- deployed to heroku at https://ft-potluck-planner-7-server.herokuapp.com/

- current endpoints are

| Endpoint | params | input | output | requires Auth token |
| -------- | ------ | ----- | ------ | ------------------- |
| [POST] /api/auth/login | none | username, password | message, token | Nope |
| [POST] /api/auth/register | none | username, password | message | Nope |
| [GET] /api/potlucks | none | none | all of the potlucks for the user | yes |
| [POST] /api/potlucks | none | name, date, time, location | added potluck | yes |
| [PUT] /api/potlucks/:id | id | date, time, location | updated potluck | yes |
| [GET] /api/potlucks/:potluck_id/foods | potluck_id | none | food requests for specified potluck | yes |
| [POST] /api/potlucks/:potluck_id/foods | potluck_id | quantity and food or name | added food request | yes |
| [PUT] /api/potlucks/:potluck_id/foods/:id | potluck_id, id for food request | bringing | updated food request | yes |
| [GET] /api/invites | none | none | an array of the users invites | yes |
| [POST] /api/invites | none | guest_id and potluck_id | created invite | yes |
| [PUT] /api/invites/:id | id for invite | has_rsvped | updated invite | yes |
| [GET] /api/foods | none | none | all of the foods in the database | yes |
| [POST] /api/foods | none | name | added food item | yes |

## Scripts

- **start**: Runs the app in production.
- **server**: Runs the app in development.
- **migrate**: Migrates the local development database to the latest.
- **rollback**: Rolls back migrations in the local development database.
- **seed**: Truncates all tables in the local development database, feel free to add more seed files.
- **test**: Runs tests.
- **deploy**: Deploys the main branch to Heroku.

**The following scripts NEED TO BE EDITED before using: replace `YOUR_HEROKU_APP_NAME`**

- **migrateh**: Migrates the Heroku database to the latest.
- **rollbackh**: Rolls back migrations in the Heroku database.
- **databaseh**: Interact with the Heroku database from the command line using psql.
- **seedh**: Runs all seeds in the Heroku database.

## Hot Tips

- Figure out the connection to the database and deployment before writing any code.

- If you need to make changes to a migration file that has already been released to Heroku, follow this sequence:

  1. Roll back migrations in the Heroku database
  2. Deploy the latest code to Heroku
  3. Migrate the Heroku database to the latest

- If your frontend devs are clear on the shape of the data they need, you can quickly build provisional endpoints that return mock data. They shouldn't have to wait for you to build the entire backend.

- Keep your endpoints super lean: the bulk of the code belongs inside models and other middlewares.

- Validating and sanitizing client data using a library is much less work than doing it manually.

- Revealing crash messages to clients is a security risk, but during development it's helpful if your frontend devs are able to tell you what crashed.

- PostgreSQL comes with [fantastic built-in functions](https://hashrocket.com/blog/posts/faster-json-generation-with-postgresql) for hammering rows into whatever JSON shape.

- If you want to edit a migration that has already been released but don't want to lose all the data, make a new migration instead. This is a more realistic flow for production apps: prod databases are never migrated down. We can migrate Heroku down freely only because there's no valuable data from customers in it. In this sense, Heroku is acting more like a staging environment than production.

- If your fronted devs are interested in running the API locally, help them set up PostgreSQL & pgAdmin in their machines, and teach them how to run migrations in their local. This empowers them to (1) help you troubleshoot bugs, (2) obtain the latest code by simply doing `git pull` and (3) work with their own data, without it being wiped every time you roll back the Heroku db. Collaboration is more fun and direct, and you don't need to deploy as often.
