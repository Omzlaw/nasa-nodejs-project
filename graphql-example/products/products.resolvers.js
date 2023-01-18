const productsModel = require('./products.model')

module.exports = {
    Query: {
        products: () => {
            return productsModel.getAllProducts();
        },
        productsByPrice: (_, args) => {
            return productsModel.getProductsByPrice(args.minPrice, args.maxPrice)
        },
        product: (_, args) => {
            return productsModel.getProductById(args.id);
        }
    }
}