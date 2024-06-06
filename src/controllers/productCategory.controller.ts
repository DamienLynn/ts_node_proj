import { controller, response, httpGet, queryParam, requestParam, httpPost, requestBody, httpPut, httpDelete } from "inversify-express-utils";
import * as express from "express";
import { inject } from "inversify";
import { TYPES } from "../domian/constant/types";
import { IProductCategory } from "../models/interfaces/productCategory.interface";
import { Delete, Get, Post, Put } from "tsoa";
import ProductCategoryService, { IProductCategoryService } from "../services/productCategory.service";

@controller("/categories")
export class ProductCategoryController {
    @inject(TYPES.Service.ProductCategory)
    private productCategoryService: IProductCategoryService = new ProductCategoryService;

    /**
     * Get all product categories
     */

    /** 
    * @swagger
    * components:
    *   securitySchemes:
    *       BearerAuth:
    *           type: http
    *           scheme: bearer
    *           bearerFormat: JWT
    *   schemas:
    *        productCategory:
    *            type: object
    *            properties:
    *               _id: 
    *                   type: string
    *               categoryName: 
    *                   type: string
    *               colorCode:
    *                   type: string
    *               created_at:
    *                   type: DateTime
    *               updated_at:
    *                   type: DateTime
    *            example: 
    *               _id: 63dcb5055c074d9459f8b270
    *               categoryName: တိုလီမိုလီ
    *               colorCode: #FFFFFF
    *               created_at: 2023-02-01T15:59:37.013+00:00
    *               updated_at: 2023-02-01T15:59:37.013+00:00
    * tags: 
    *  name:  ProductCategory
    */

   /**
    * @swagger
    * paths:
    *  /categories:
    *    get:
    *     summary: Return all categories list
    *     security:
    *      - BearerAuth: []
    *     tags: [ProductCategory]
    *     parameters:
    *      - in: params
    *        name: params
    *        schema: 
    *         type: object
    *         required: true
    *         properties:
    *          search:
    *           type: string
    *           example: "တိုလီမိုလီ"
    *          pageNo:
    *           type: number
    *           example: 1
    *          pageSize:
    *           type: number
    *           example: 10
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
        @queryParam("filter") filter: IProductCategory,
        @queryParam("search") search: string,
        @queryParam("pageNo") pageNo: number,
        @queryParam("pageSize") pageSize: number,
    ) {
        try {
            const productCategories = await this.productCategoryService.getProductCategories(search, pageNo, pageSize);
            res.status(200).json({
                code: 200,
                message: "Get all product categories success",
                data: productCategories
            });
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * Get product category by ID
     */

    /**
    * @swagger
    * paths:
    *  /categories/{category_id}:
    *    get:
    *     summary: Return category details
    *     security:
    *      - BearerAuth: []
    *     tags: [ProductCategory]
    *     responses:
    *      200: 
    *        description: success
    *        content: 
    *          application/json:
    *            schema: 
    *              type: object 
    *            example:
    *                "id": "63f5d2804772337bba1acbc7"
    *                "categoryName": "တိုလီမိုလီ"
    *                "colorCode": "#FFFFFF"
    *      404: 
    *        description: No category matching provided id
    */
    @Get("/:id")
    @httpGet("/:id")
    public async getById(
        @requestParam("id") id: any,
        @response() res: express.Response,
        @queryParam("filter") filter: IProductCategory
    ) {
        try {
            const productCategory = await this.productCategoryService.getProductCategoryById(id);
            res.status(200).json({
                code: 200,
                message: "Get product category success",
                data: productCategory
            });
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }


    /**
     * Create product category
     */

    /**
    * @swagger
    * paths:
    *  /categories:
    *    post:
    *     summary: Create new category
    *     security:
    *      - BearerAuth: []
    *     tags: [ProductCategory]
    *     parameters:
    *      - in: body
    *        name: category
    *        schema: 
    *         type: object
    *         required: true
    *         properties:
    *          categoryName:
    *           type: string
    *          colorCode:
    *           type: string
    *     responses:
    *      200: 
    *        description: Create shop success
    *        content: 
    *          application/json:
    *            schema: 
    *              type: object 
    *      401: 
    *        description: 'No Authorization'
    */
    @Post("/")
    @httpPost("/")
    public async createNew(
        @response() res: express.Response,
        @requestBody() bodyObj: IProductCategory
    ) {
        try {
            const newProductCategory = await this.productCategoryService.createNewProductCategory(bodyObj);
            res.status(200).json({
                code: 200,
                message: "Product category created successfully",
                data: newProductCategory
            });
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
    * Update product category
    */

    /**
    * @swagger
    * paths:
    *  /categories/{category_id}:
    *    put:
    *     summary: Update category
    *     security:
    *      - BearerAuth: []
    *     tags: [ProductCategory]
    *     parameters:
    *      - in: body
    *        name: category
    *        schema: 
    *         type: object
    *         required: true
    *         properties:
    *          categoryName:
    *           type: string
    *          colorCode:
    *           type: string
    *     responses:
    *      200: 
    *        description: Update shop success
    *        content: 
    *          application/json:
    *            schema: 
    *              type: object 
    *      401: 
    *        description: 'No Authorization'
    */
    @Put("/:id")
    @httpPut("/:id")
    public async update(
        @requestParam("id") id: any,
        @response() res: express.Response,
        @requestBody() bodyObj: IProductCategory
    ) {
        try {
            const updateProductCategory = await this.productCategoryService.updateProductCategory(id, bodyObj);
            res.status(200).json({
                code: 200,
                message: "Product category updated successfully",
                data: updateProductCategory
            });
        } catch (err) {
            res.status(500).json({ error: "Internal server error" });
        }
    }


     /**
    * @swagger
    * paths:
    *  /categories/{category_id}:
    *    delete:
    *     summary: Delete category
    *     security:
    *      - BearerAuth: []
    *     tags: [ProductCategory]
    *     parameters:
    *      - in: body
    *        name: category
    *        schema: 
    *         type: object
    *         required: true
    *     responses:
    *      200: 
    *        description: Delete shop success
    *        content: 
    *          application/json:
    *            schema: 
    *              type: object 
    *      401: 
    *        description: 'No Authorization'
    */
     @Delete("/:id")
     @httpDelete("/:id")
     public async delete(
         @requestParam("id") id: any,
         @response() res: express.Response,
        //  @requestBody() bodyObj: IProductCategory
     ) {
         try {
             await this.productCategoryService.deleteProductCategory(id);
             res.status(200).json({
                 code: 200,
                 message: "Product category deleted successfully",
             });
         } catch (err) {
             res.status(500).json({ error: "Internal server error" });
         }
     }
}