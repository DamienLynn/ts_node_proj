import { ObjectId } from "typeorm";

export interface IProductCategory {
    _id: ObjectId;
    categoryName: string;
    colorCode: string;
    created_at: Date;
    updated_at: Date;

}
