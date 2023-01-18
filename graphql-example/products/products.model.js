const products = [
    {
        id: 'redshoe',
        description: 'Red Shoe',
        price: 42.13,
        reviews: [],
    },
    {
        id: 'bluejean',
        description: 'Blue Jeans',
        price: 42.13,
        reviews: [],
    },
]

function getAllProducts() {
    return products;
}

function getProductsByPrice(minPrice, maxPrice) {
    return products.filter((product) => {
        return product.price >= minPrice && product.price <= maxPrice;
    })
}

function getProductById(id) {
    return products.find((product) => {
        return product.id === id;
    })
}

function addNewProduct(id, description, price) {
    const newProduct = {
        id,
        price,
        description,
        reviews: []
    }

    products.push(newProduct);
    return newProduct;
}

function addNewProductReview(id, rating, comment) {
    const matchedProduct = getProductById(id);
    if (matchedProduct) {
        const newProductReview = {
            rating,
            comment
        }

        matchedProduct.reviews.push(newProductReview)

        return newProductReview;
    }
    return null;
}

module.exports = {
    getAllProducts,
    getProductsByPrice,
    getProductById,
    addNewProduct,
    addNewProductReview
}