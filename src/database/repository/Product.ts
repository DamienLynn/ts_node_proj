import { Product } from "../entity/Product";
import { AppDataSource } from "../db_client";

export const ProductRepository = AppDataSource.getRepository(Product);