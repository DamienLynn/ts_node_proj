import { inject, injectable } from "inversify";
import { IProduct } from "../models/interfaces/IProduct";
import { TYPES } from "../domian/constant/types";
import { MongoRepository } from "typeorm";
import { Product } from "../database/entity/Product";
import { ObjectId } from "mongodb";
import { aggregatePaginate } from "../utils/aggregate-utils";

const lookupPipeline = [
    {
        $lookup: {
            from: 'product_category',
            let: { category_id: "$category_id"},
            pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$category_id"] } }, },
                { $project: { categoryName: 1, colorCode: 1 } }
            ],
            as: 'categories'
        }
    },
    {
        $addFields: {
            category: { $first: '$categories'}
        }
    },
    {
        $unset: ['categories']
    }
];

export interface IProductListResponse{
    data: Array<IProduct>;
    meta: any;
}

export interface Ipagination {
    page_no: string;
    page_size: string;
}

export interface Ifilter {
    category_id: string;
    stock_available: string;
}

export interface IProductService {
    getProducts: (
        search_key: string, 
        pagination: Ipagination, 
        filter: Ifilter
    ) => Promise<IProductListResponse>;
    createProduct: ( data: IProduct ) => Promise<IProduct>;
    getProductDetails: (id: string) => Promise<IProduct>;
    updateProduct: (id: string, data: IProduct ) => Promise<IProduct>;
}

@injectable()
class ProductService implements IProductService {
    @inject(TYPES.Repository.Product)
     private productRepository: MongoRepository<Product>;
    //  private mongoManager: get();

    constructor(
        @inject(TYPES.Repository.Product)
        productRepository: MongoRepository<Product>
    ) {
        this.productRepository = productRepository;
    }

    getProducts = async (
        search_key: string = '', 
        pagination: Ipagination = { page_no: '0', page_size: '0' }, 
        filter: Ifilter = { category_id: '', stock_available: 'true' }
    ) : Promise<IProductListResponse> => {
        try {
            let pipeline = [];
            let $match: any = {};
            const { page_no, page_size } = pagination;
            const { category_id, stock_available } = filter;

            search_key && ( $match.name = new RegExp(search_key, 'gi'));
            category_id && ( $match.category_id = new ObjectId(category_id));
            if(stock_available  === 'false') {
                $match.stock_available = false
            } else {
                $match.stock_available = true
            }

            Object.keys($match).length > 0 && ( pipeline.push({$match: $match}) );

            const res: IProductListResponse = await aggregatePaginate(this.productRepository, pipeline, page_no, page_size, lookupPipeline);
            return res;
        } catch (error) {
            throw new Error("Unable to aggregate products");
        }
    };

    createProduct = async ( data: IProduct ) : Promise<IProduct> => {
        try {
            const newProduct = await this.productRepository.save(data);
            return newProduct || null;
        } catch (e) {
            throw new Error("Unable to get product category");
        }
    };

    getProductDetails = async (id: string) : Promise<IProduct> => {
        try {
            let pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id)
                    }
                }
            ]
            // const product = await this.productRepository.findOne( {
            //     where: {_id: new ObjectId(id)
            // }});
            let res: IProductListResponse = await aggregatePaginate(this.productRepository, pipeline, '0', '0', lookupPipeline);
            let products= res.data;
            let product = products[0];
            // return res;
            if(product){
                return product
            } else {
                throw new Error("no matching product");
            }

        } catch (e) {
            throw new Error("Unable to get product details")
        }
    }

    updateProduct = async (id: string, data: IProduct ) : Promise<IProduct> => {
        try {
            if (!id) {
                throw new Error("_id is required for updating the product.");
            }
            const productId = new ObjectId(id);

            const existingProduct = await this.productRepository.findOne({
                where: { _id: productId }
            });

            if (!existingProduct) {
                throw new Error("Product with the provided _id does not exist.");
            }

            const updatedProduct = await this.productRepository.save({
                ...existingProduct, // Existing product properties
                ...data // Updated product properties
            });

            return updatedProduct || null;
        } catch (e) {
            throw new Error("Unable to get update product");
        }
        
    }
}

export default ProductService;