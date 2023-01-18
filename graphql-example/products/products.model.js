const products = [
    {
        id: 'redshoe',
        description: 'Red Shoe',
        price: 42.13
    },
    {
        id: 'bluejean',
        description: 'Blue Jeans',
        price: 42.13
    },
]

function getAllProducts() {
    return products;
}

function getProductsByPrice(minPrice, maxPrice) {
    return products.filter((product) => {
        return product.price >= minPrice && product.price <= max;
    })
}

function getProductById(id) {
    return products.find((product) => {
        return product.id === id;
    })
}

module.exports = {
    getAllProducts,
    getProductsByPrice,
    getProductById
}