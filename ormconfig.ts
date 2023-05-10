import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    "type": "postgres",
    "host": process.env.DBHOST,
    "port": parseInt(process.env.DBPORT),
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DB,
    "logging": true,
    "entities": [__dirname + '/**/*.entity.{js,ts}'],
    "migrations": [__dirname + '/migrations/*.ts'],
});
