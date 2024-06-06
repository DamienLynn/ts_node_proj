import { Entity, Column, ObjectIdColumn } from "typeorm"
import { Default } from "./DefaultEntity";
import { ObjectId } from "mongodb";


@Entity()
export class Product extends Default {

    @ObjectIdColumn({ nullable: true, default: null }) 
    category_id: ObjectId | null = null; 

    @Column() 
    name: string = '';

    @Column({default : ''}) 
    brand_name: string = '';

    @Column({ default: ''})
    description: string = '';

    @Column({ default: '' })
    remark: string = '';

    @Column({ default: '' })
    unit: string = '';
    
    @Column({ default: 0})
    price: number = 0;

    @Column({ default: 0 })
    cost: number = 0;

    @Column({ default: 0 })
    margin: number = 0;

    @Column({ default: false })
    is_discounted: boolean = false;

    @Column({ default: 0 })
    discount_percent: number = 0;

    @Column({ default: 0 })
    discount_amount: number = 0;

    @Column({ default: false })
    stock_available: boolean = false;

    @Column({ default: false })
    track_stock: boolean = false;

    @Column({ default: 0 })
    in_stock: number = 0;

    @Column({ default: 0 })
    low_stock: number = 0;

    @Column({ default: [] })
    product_images: Array<string> = [];
}
