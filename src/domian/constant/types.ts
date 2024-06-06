export const TYPES = {
    Repository: {
        User: Symbol('UserRepository'),
        ProductCategory: Symbol('ProductCategoryRepository'),
        Product: Symbol('ProductRepository'),
    },
    Service: {
        User: Symbol('UserService'),
        ProductCategory: Symbol('ProductCategoryService'),
        Product: Symbol('ProductService'),
    }
}