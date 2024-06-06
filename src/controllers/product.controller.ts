import { controller, queryParam, response, httpGet, httpPost, requestBody, requestParam, httpPut } from "inversify-express-utils";
import * as express from "express";
import { TYPES } from "../domian/constant/types";
import { inject } from "inversify";
import { Get, Post, Put, Route } from "tsoa";
import ProductService, { IProductService, Ifilter, Ipagination } from "../services/product.service";
import { IProduct } from "../models/interfaces/IProduct";
import { calculateMargin } from "../utils/math.utils";
import { handleError, handleResponse } from "../utils/api-response-format.utils";

@controller("/products")
@Route("ping")
export class ProductController {

    private productService: IProductService;

    constructor(@inject(TYPES.Service.Product) productService: IProductService) {
        this.productService = productService;
    }

    /** 
     * @swagger
     * components:
     *   securitySchemes:
     *     BearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     *   schemas:
     *     Product:
     *       type: object
     *       properties:
     *         _id: 
     *           type: string
     *         name: 
     *           type: string
     *         category_id:
     *           type: string
     *         description:
     *           type: string
     *         price:
     *           type: number
     *         cost:
     *           type: number
     *         margin:
     *           type: number
     *         in_stock:
     *           type: number
     *         stock_available:
     *           type: boolean
     *         track_stock:
     *           type: boolean
     *         low_stock:
     *           type: number
     *         product_visual:
     *           type: object
     *           properties:
     *             color:
     *               type: string
     *             shape:
     *               type: string
     *             image:
     *               type: string
     *         created_at:
     *           type: string
     *           format: date-time
     *         updated_at:
     *           type: string
     *           format: date-time
     *       example: 
     *         _id: "660b7e1b1f1cdb5ea4603328"
     *         name: "Product-X"
     *         category_id: "1"
     *         description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
     *         price: 1000
     *         cost: 900
     *         margin: 10
     *         in_stock: 100
     *         stock_available: true
     *         track_stock: true
     *         low_stock: 20
     *         product_visual:
     *           color: "#CC3333"
     *           shape: "circle"
     *           image: ""
     * tags: 
     *   - name: Product
     */


    /**
    * @swagger
    * paths:
    *  /products:
    *    get:
    *     summary: Return filtered products list
    *     security:
    *      - BearerAuth: []
    *     tags: [Product]
    *     responses:
    *      200: 
    *        description: success
    *        content: 
    *          application/json:
    *            schema: 
    *              type: array 
    */
    @Get("/")
    @httpGet("/")
    public async getAll(
        @response() res: express.Response,
        @queryParam("f") filter: Ifilter,
        @queryParam("p") pagination: Ipagination,
        @queryParam("search") search_key: string,
    ) {
        try {

            const { data, meta } = await this.productService.getProducts(
                search_key,
                pagination,
                filter,
            );

            res.status(200).json(
                handleResponse(200, data, meta, "Get all products success")
            );
        } catch (err) {
            res.status(500).json(handleError(500, "Internal server error", err || null));
        }
    }

    /**
     * Create product
     */

    /**
    * @swagger
    * paths:
    *   /products:
    *     post:
    *       summary: Create new product
    *       security:
    *         - BearerAuth: []
    *       tags: [Product]
    *       requestBody:
    *         required: true
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 name: 
    *                   type: string
    *                 category_id:
    *                   type: string
    *                 description:
    *                   type: string
    *                 price:
    *                   type: number
    *                 cost:
    *                   type: number
    *                 in_stock:
    *                   type: number
    *                 stock_available:
    *                   type: boolean
    *                 track_stock:
    *                   type: boolean
    *                 low_stock:
    *                   type: number
    *                 product_visual:
    *                   type: object
    *                   properties:
    *                     color:
    *                       type: string
    *                     shape:
    *                       type: string
    *                     image:
    *                       type: string
    *       responses:
    *         '200':
    *           description: Creating product success
    *           content:
    *             application/json:
    *               schema:
    *                 type: object
    *         '400':
    *           description: 'Something went wrong: creating product failed'
    *         '500':
    *           description: 'Internal Server Error'
    */

    @Post("/")
    @httpPost("/")
    public async createNewProduct(
        @response() res: express.Response,
        @requestBody() data: IProduct,
    ) {
        try {
            let product = {
                ...data,
                margin: calculateMargin(data.price, data.cost)
            };
            const product_added = await this.productService.createProduct(product);
            if (!product_added) {
                res.status(400).json({
                    code: 400,
                    message: "Something went wrong: creating product failed"
                })
            }
            res.status(200).json(
                handleResponse(200, product_added, {}, "Creating new product succeed")
            );
        } catch (err) {
            res.status(500).json(handleError(500, "Internal server error", err || null));
        }
    }

    /**
     * @swagger
     * components:
     *   securitySchemes:
     *     BearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     *   schemas:
     *     product:
     *       type: object
     *       properties:
     *         _id:
     *           type: string
     *           description: The unique identifier of the product.
     *         name:
     *           type: string
     *           description: The name of the product.
     *         category_id:
     *           type: string
     *           description: The category ID of the product.
     *         description:
     *           type: string
     *           description: The description of the product.
     *         price:
     *           type: number
     *           format: double
     *           description: The price of the product.
     *         cost:
     *           type: number
     *           format: double
     *           description: The cost of the product.
     *         margin:
     *           type: number
     *           format: double
     *           description: The margin percentage of the product.
     *         in_stock:
     *           type: integer
     *           format: int32
     *           description: The total stock available of the product.
     *         stock_available:
     *           type: boolean
     *           description: Indicates whether the product is currently available in stock.
     *         track_stock:
     *           type: boolean
     *           description: Indicates whether the stock of the product is being tracked.
     *         low_stock:
     *           type: integer
     *           format: int32
     *           description: The low stock threshold of the product.
     *         product_visual:
     *           type: object
     *           properties:
     *             color:
     *               type: string
     *               description: The color of the product.
     *             shape:
     *               type: string
     *               description: The shape of the product.
     *             image:
     *               type: string
     *               description: The image URL of the product.
     *         created_at:
     *           type: string
     *           format: date-time
     *           description: The timestamp when the product was created.
     *         updated_at:
     *           type: string
     *           format: date-time
     *           description: The timestamp when the product was last updated.
     *       example:
     *         _id: "1"
     *         name: "Product 1"
     *         category_id: "1"
     *         description: "This is product 1 description."
     *         price: 100
     *         cost: 80
     *         margin: 20
     *         in_stock: 50
     *         stock_available: true
     *         track_stock: true
     *         low_stock: 10
     *         product_visual:
     *           color: "blue"
     *           shape: "rectangle"
     *           image: "https://example.com/product1.jpg"
     *         created_at: "2022-04-01T12:00:00Z"
     *         updated_at: "2022-04-01T13:30:00Z"
     * paths:
     *   /products/{id}:
     *     get:
     *       summary: Get product details by ID
     *       tags: [Product]
     *       parameters:
     *         - in: path
     *           name: id
     *           required: true
     *           description: ID of the product to retrieve
     *           schema:
     *             type: string
     *       responses:
     *         '200':
     *           description: Product details retrieved successfully
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     *         '404':
     *           description: Product not found
     *         '500':
     *           description: Internal Server Error
     * tags:
     *   - name: Product
     */
    @Get("/:id")
    @httpGet("/:id")
    public async getProductById(
        @response() res: express.Response,
        @requestParam("id") id: string,
    ) {
        try {
            const product = await this.productService.getProductDetails(id);
            if (!product) {
                res.status(404).json(handleError(404, "Something went wrong: Product not found", null))
            }
            res.status(200).json(handleResponse(200, product, {}, "Creating new product succeed"));
        } catch (err) {
            res.status(500).json(handleError(500, "Internal server error", err || null));
        }
    }

    /**
     * @swagger
     * components:
     *   securitySchemes:
     *     BearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     *   schemas:
     *     ProductUpdate:
     *       type: object
     *       properties:
     *         _id:
     *           type: string
     *           description: The unique identifier of the product.
     *         name:
     *           type: string
     *           description: The name of the product.
     *         category_id:
     *           type: string
     *           description: The category ID of the product.
     *         description:
     *           type: string
     *           description: The description of the product.
     *         price:
     *           type: number
     *           format: double
     *           description: The price of the product.
     *         cost:
     *           type: number
     *           format: double
     *           description: The cost of the product.
     *         margin:
     *           type: number
     *           format: double
     *           description: The margin percentage of the product.
     *         in_stock:
     *           type: integer
     *           format: int32
     *           description: The total stock available of the product.
     *         stock_available:
     *           type: boolean
     *           description: Indicates whether the product is currently available in stock.
     *         track_stock:
     *           type: boolean
     *           description: Indicates whether the stock of the product is being tracked.
     *         low_stock:
     *           type: integer
     *           format: int32
     *           description: The low stock threshold of the product.
     *         product_visual:
     *           type: object
     *           properties:
     *             color:
     *               type: string
     *               description: The color of the product.
     *             shape:
     *               type: string
     *               description: The shape of the product.
     *             image:
     *               type: string
     *               description: The image URL of the product.
     *         created_at:
     *           type: string
     *           format: date-time
     *           description: The timestamp when the product was created.
     *         updated_at:
     *           type: string
     *           format: date-time
     *           description: The timestamp when the product was last updated.
     *       example:
     *         _id: "1"
     *         name: "Updated Product"
     *         category_id: "2"
     *         description: "This is an updated product description."
     *         price: 120
     *         cost: 90
     *         margin: 30
     *         in_stock: 70
     *         stock_available: true
     *         track_stock: true
     *         low_stock: 15
     *         product_visual:
     *           color: "green"
     *           shape: "circle"
     *           image: "https://example.com/updated-product.jpg"
     *         created_at: "2022-04-01T12:00:00Z"
     *         updated_at: "2022-04-01T13:30:00Z"
     *   parameters:
     *     productIdParam:
     *       in: path
     *       name: id
     *       required: true
     *       description: ID of the product to update
     *       schema:
     *         type: string
     *   requestBody:
     *     required: true
     *     content:
     *       application/json:
     *         schema:
     *           $ref: '#/components/schemas/ProductUpdate'
     * paths:
     *   /products/{id}:
     *     put:
     *       summary: Update a product by ID
     *       tags: [Product]
     *       parameters:
     *         - $ref: '#/parameters/productIdParam'
     *       requestBody:
     *         $ref: '#/requestBody'
     *       responses:
     *         '200':
     *           description: Product updated successfully
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/ProductUpdate'
     *         '400':
     *           description: Bad request
     *         '404':
     *           description: Product not found
     *         '500':
     *           description: Internal Server Error
     * tags:
     *   - name: Product
     */
    @Put("/:id")
    @httpPut("/:id")
    public async update(
        @requestParam("id") id: any,
        @response() res: express.Response,
        @requestBody() body: IProduct
    ) {
        try {
            const product_update = await this.productService.updateProduct(id, body);
            res.status(200).json(handleResponse(200, product_update, {}, "Product category updated successfully"));
        } catch (err) {
            res.status(500).json(handleError(500, "Internal server error", err || null));
        }
    }

    // @Post("/:id/images")
    // @httpPost("/:id/images")
    // public async uploadImage(
    //     @requestParam("id") id: string,
    //     @response() res: express.Response,
    //     @requestBody() body: Express.Multer.File
    // ) {
    //     try {
            
    //     } catch (err) {

    //     }
    // }
}