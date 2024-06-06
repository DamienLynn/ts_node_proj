import { ObjectId } from "typeorm";

export interface IProduct {
    _id: ObjectId;
    name: string;
    brand_name: string;
    category_id: ObjectId | null;
    description: string;
    remark: string;
    unit: string;
    price: number;
    cost: number;
    margin: number;
    is_discounted: boolean;
    discount_percent: number;
    discount_amount: number;
    in_stock: number;
    stock_available: boolean;
    track_stock: boolean;
    low_stock: number;
    product_images: Array<string>;
    created_at: Date;
    updated_at: Date;
}
