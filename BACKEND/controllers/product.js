const Product = require("../models/Product");
const auth = require("../auth");
const { errorHandler } = auth;


module.exports.createProduct = (req, res) => {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    const newProduct = new Product({
        name,
        description,
        price
    });

     return newProduct.save()
        .then(product => res.status(201).send(product))
        .catch(error => res.status(500).send({ error: error.message }));
};

module.exports.getAllProducts = (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).send({ auth: 'Failed', message: 'Action Forbidden' });
    }

    return Product.find({})
        .then(products => res.status(200).send(products))
        .catch(error => res.status(500).send({ error: error.message }));
};

module.exports.getAllActiveProducts = (req, res) => {
    console.log('Request URL:', req.originalUrl); 
    Product.find({ isActive: true })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).send({ message: 'No active products found' });
            }
            res.status(200).send(products);
        })
        .catch(err => {
            res.status(500).send({
                error: 'Failed to retrieve active products',
                details: err.message
            });
        });
};

module.exports.retrieveSpecificProduct = (req, res) => {
    const { id } = req.params;

    return Product.findById(id)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send(product);
        })
        .catch(error => res.status(500).send({ error: error.message }));
};

module.exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    return Product.findByIdAndUpdate(id, { name, description, price }, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({
                success: true,
                message: 'Product updated successfully',
                updatedProduct
            });
        })
        .catch(error => res.status(500).send({ error: error.message }));
};



module.exports.archiveProduct = (req, res) => {
    const { id } = req.params;

    return Product.findById(id)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: 'Product not found' });
            }

            if (!product.isActive) {
                return res.status(400).send({
                    message: 'Product already archived',
                    archivedProduct: product
                });
            }

            product.isActive = false;
            return product.save()
                .then(archivedProduct => res.status(200).send({
                    success: true,
                    message: 'Product archived successfully',
                    archivedProduct
                }));
        })
        .catch(error => res.status(500).send({ error: error.message }));
};


module.exports.activateProduct = (req, res) => {
    const { id } = req.params;

    return Product.findById(id)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: 'Product not found' });
            }

            if (product.isActive) {
                return res.status(400).send({
                    message: 'Product already active',
                    activatedProduct: product
                });
            }

            product.isActive = true;
            return product.save()
                .then(activatedProduct => res.status(200).send({
                    success: true,
                    message: 'Product activated successfully',
                    activatedProduct
                }));
        })
        .catch(error => res.status(500).send({ error: error.message }));
};


module.exports.searchName = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({
            message: "Product name is required for search."
        });
    }

    return Product.find({ name: new RegExp(name, 'i') })
        .then(products => {
            if (products.length === 0) {
                return res.status(404).send({
                    message: "No products found with the given name."
                });
            }
            return res.status(200).send({
                products: products
            });
        })
        .catch(error => res.status(500).send({
            success: false,
            message: "An error occurred while searching for products.",
            error: error.message
        }));
};


module.exports.searchPrice = (req, res) => {
    const { minPrice, maxPrice } = req.body;

    if (minPrice === undefined || maxPrice === undefined) {
        return res.status(400).send({ error: "Both minPrice and maxPrice must be provided" });
    }

    return Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
        .then(products => {
            if (products.length > 0) {
                res.status(200).send(products);
            } else {
                res.status(404).send({ message: "No products found within the specified price range" });
            }
        })
        .catch(error => res.status(500).send({ error: error.message }));
};