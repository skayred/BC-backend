# BC Platforms test assignment

This is the backend, that allows to perform CRUD operations on the mock user profiles, and, in addition, allows to modify the roles for each profile.

## Configuration

Application requires the JSON configuration, that contains the mapping between the external roles and internal roles. Compose file has the working example that looks so:

```
{
  "001 - Admin":"BC_ADMIN",
  "002 - Clinical personnel":"BC_CLINICAL",
  "003 - Warehouse personnel": "BC_WAREHOUSE"
}
```

## Startup

Application is dockerized and can be run using the command:

```
PG_PASSWORD=your-db-password docker-compose up -d
```

*NB*: Password would be used for the initialization of the database and opens the superuser capabilities. Please make sure not to share the password!

## DB

Application uses PostgreSQL for the persistency purposes. In order to let application run correctly, you would need to initialize the database using the migration - it will create the needed tables.
After the Compose execution is done, you need to run the migrator:

```
docker run --name migrator -e DBPASSWORD='your-db-password' -e DBHOST='host.docker.internal' -e DBPORT='5432' -e DBUSER='bc' -e DB='bc' -it bc-roles:0.0.1  npm run typeorm migration:run -- -d ormconfig.ts
```

After the successful run, you need to remove the container and restart the Composed services.

## cURL commands

After the run, we first need to create a profile:

```
curl --location 'localhost:3000/profiles/' --header 'Content-Type: application/json' --data '{ "firstName": "First", "lastName": "Last" }'
```

This command should return you the initialized profile. You can run the following command to check the list of existing profiles:

```
curl 'localhost:3000/profiles/'
```

Copy the profile ID in order to operate the profile roles. Let's assign the roles to the profile:

```
curl -X PUT --location 'localhost:3000/profiles/1/roles' --header 'Content-Type: application/json' --data '["003 - Warehouse personnel", "002 - Clinical personnel"]'
curl 'localhost:3000/profiles/'
```

There you should see the detailed profile that includes the assigned roles.
