import { Entity, Column } from "typeorm"
import { Default } from "./DefaultEntity";


@Entity()
export class ProductCategory extends Default {

    @Column({ nullable: true }) 
    categoryName!: string; 

    @Column({ nullable: true })
    colorCode!: string;
    
}
