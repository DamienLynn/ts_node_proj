import { CreateDateColumn, UpdateDateColumn, ObjectIdColumn, ObjectId } from "typeorm";
  
 export abstract class Default {
    @ObjectIdColumn()
    _id!: ObjectId
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  }
  
  