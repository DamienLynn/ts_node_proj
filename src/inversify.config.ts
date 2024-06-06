import { AsyncContainerModule } from "inversify";
import { Repository } from "typeorm";
import { User } from "./database/entity/User";
import { ProductCategory } from "./database/entity/ProductCategory";
import { TYPES } from "./domian/constant/types";
import { UserRepository } from "./database/repository/User";
import { ProductCategoryRepository } from "./database/repository/ProductCategory";
import UserService, { IUserService } from "./services/user.service";
import ProductCategoryService, { IProductCategoryService } from "./services/productCategory.service";
import { Product } from "./database/entity/Product";
import { ProductRepository } from "./database/repository/Product";
import ProductService, { IProductService } from "./services/product.service";

export const bindings = new AsyncContainerModule(async(bind) => {
    await require("./controllers/user.controller");
    await require("./controllers/productCategory.controller");
    await require("./controllers/product.controller");

    // Binding Repositories
    bind<Repository<User>>(TYPES.Repository.User).toDynamicValue(() => {
        return UserRepository;
    }).inRequestScope();
    bind<Repository<ProductCategory>>(TYPES.Repository.ProductCategory).toDynamicValue(() => {
        return ProductCategoryRepository;
    }).inRequestScope();
    bind<Repository<Product>>(TYPES.Repository.Product).toDynamicValue(() => {
        return ProductRepository;
    }).inRequestScope();

    // Binding services
    bind<IUserService>(TYPES.Service.User).to(UserService);
    bind<IProductCategoryService>(TYPES.Service.ProductCategory).to(ProductCategoryService);
    bind<IProductService>(TYPES.Service.Product).to(ProductService);
})