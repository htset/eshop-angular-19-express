import { DataSource } from "typeorm";
import { ItemEntity } from "../entities/itemEntity";
import { UserEntity } from "../entities/userEntity";
import { AddressEntity } from "../entities/addressEntity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "eshop_angular",
  schema: "eshop",
  synchronize: true,
  logging: true,
  entities: [ItemEntity, UserEntity, AddressEntity],
  subscribers: [],
  migrations: [],
});

//Initialize data source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized successfully!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
