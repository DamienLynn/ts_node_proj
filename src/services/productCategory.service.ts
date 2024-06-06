import { inject, injectable } from "inversify";
import { TYPES } from "../domian/constant/types";
import { IProductCategory } from "../models/interfaces/productCategory.interface";
import { ProductCategoryRepository } from "../database/repository/ProductCategory";
import { Repository } from "typeorm";
import { ProductCategory } from "../database/entity/ProductCategory";
import { ObjectId } from "mongodb";

export interface IProductCategoryService {
    getProductCategories: (search: string, pageNo: number, pageSize: number) => Promise<Array<IProductCategory>>;
    getProductCategoryById: (id: string) => Promise<IProductCategory | null>;
    createNewProductCategory: (categoryData: Partial<ProductCategory>) => Promise<IProductCategory | null>;
    updateProductCategory: ( id: string, categoryData: Partial<ProductCategory>) => Promise<IProductCategory | null>;
    deleteProductCategory: (id: string) => Promise<IProductCategory | null>;
}

@injectable()
class ProductCategoryService implements IProductCategoryService {
    @inject(TYPES.Repository.ProductCategory)
    private ProductCategoryRepository: Repository<ProductCategory>;

    constructor() {
        this.ProductCategoryRepository =  ProductCategoryRepository;
    }

    getProductCategories = async (search: string, pageNo: number, pageSize: number): Promise<ProductCategory[]> => {
        try {
            let categories: ProductCategory[];

            if (search !== undefined) {
                categories = await this.ProductCategoryRepository.find({
                    where: {
                        categoryName: search
                    },
                });
            } else {
                categories = await this.ProductCategoryRepository.find({
                    order: {
                        created_at: -1,
                    },
                    skip: Number(pageSize * (pageNo - 1)),
                    take: Number(pageSize),
                    cache: 60000 // 1 minute
                });
            }
            
            return categories;
        } catch (e) {
            throw new Error("Unable to get product categories");
        }
    };

    getProductCategoryById = async (id: string): Promise<IProductCategory | null> => { // Accepts id parameter
        try {
            const categoryId = new ObjectId(id);
            const category = await this.ProductCategoryRepository.findOne({
                where: {
                    _id: categoryId,
                },
            });
    
            if (category) {
                return category;
            } else {
                throw new Error("no matching product category");
            }
        } catch (e) {
            console.error("Error fetching product category:", e);
            throw new Error("Unable to get product category");
        }
    };

    createNewProductCategory = async (categoryData: Partial<ProductCategory>): Promise<IProductCategory | null> => {
        try {
            if (!categoryData.categoryName || !categoryData.colorCode) {
                throw new Error("categoryName and colorCode are required fields.");
            }
            const newCategory = await this.ProductCategoryRepository.save(categoryData);
            return newCategory || null;
        } catch (e) {
            console.error("Error fetching product category:", e);
            throw new Error("Unable to get product category");
        }
    };

    updateProductCategory = async (id: string, categoryData: Partial<ProductCategory>): Promise<IProductCategory | null> => {
        try {
            if (!id) {
                throw new Error("_id is required for updating the product category.");
            }
            const categoryId = new ObjectId(id);

            const existingCategory = await this.ProductCategoryRepository.findOne({
                where: { _id: categoryId }
            });

            if (!existingCategory) {
                throw new Error("Product category with the provided _id does not exist.");
            }

            const updatedCategory = await this.ProductCategoryRepository.save({
                ...existingCategory, // Existing category properties
                ...categoryData // Updated category properties
            });

            return updatedCategory || null;
        } catch (e) {
            console.error("Error updating product category:", e);
            throw new Error("Unable to get update category");
        }
    };

    deleteProductCategory = async (id: string): Promise<IProductCategory | null> => {
        try {
            if (!id) {
                throw new Error("_id is required for deleteing the product category.");
            }
            const categoryId = new ObjectId(id);

            const category = await this.ProductCategoryRepository.findOne({
                where: { _id: categoryId }
            });

            if (!category) {
                throw new Error("Product category with the provided _id does not exist.");
            }

            const updatedCategory = await this.ProductCategoryRepository.remove(category);

            return updatedCategory || null;
        } catch (e) {
            console.error("Error deleting product category:", e);
            throw new Error("Unable to delete product category");
        }
    };
}

export default ProductCategoryService;