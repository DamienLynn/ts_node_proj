import { ProductCategory } from "../entity/ProductCategory";
import { AppDataSource } from "../db_client";

export const ProductCategoryRepository = AppDataSource.getRepository(ProductCategory);