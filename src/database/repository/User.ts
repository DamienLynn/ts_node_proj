import { User } from "../entity/User";
import { AppDataSource } from "../db_client";

export const UserRepository = AppDataSource.getRepository(User);