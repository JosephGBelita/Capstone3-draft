const Cart = require("../models/Cart");
const auth = require("../auth");
const { errorHandler } = auth;

module.exports.addToCart = async (req, res) => {
    if (req.user.isAdmin) {
        return res.status(403).send({ message: 'Admin is forbidden' });
    }

    try {
        const productIds = req.body.cartItems.map(item => item.productId);

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).send({ message: 'No products provided' });
        }

        const products = await Product.find({ '_id': { $in: productIds } });

        if (products.length === 0) {
            return res.status(404).send({ message: 'No products found' });
        }

        const cartItems = products.map(product => {
            const cartItem = req.body.cartItems.find(item => item.productId.toString() === product._id.toString());
            return {
                productId: product._id,
                quantity: cartItem ? cartItem.quantity : 1,
                subtotal: product.price 
            };
        });

        const totalPrice = cartItems.reduce((total, item) => total + item.subtotal, 0);

        let newCart = new Cart({
            userId: req.user.id,
            cartItems,
            totalPrice
        });

        const cart = await newCart.save();
        return res.status(201).send({
            success: true,
            message: 'Items added to cart successfully',
            cart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


module.exports.getCart = (req, res) => {
    return Cart.find({userId : req.user.id})
        .then(cart => {
            if (cart.length > 0) {
                return res.status(200).send({cart});
            }
            return res.status(404).send({
                message: 'Cart is empty'
            });
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { itemId, quantity, subtotal } = req.body;
        const userId = req.user.id;

        if (!itemId || quantity === undefined || subtotal === undefined || quantity <= 0 || subtotal < 0) {
            return res.status(400).send({ message: 'Valid item ID, positive quantity, and non-negative subtotal are required.' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found.' });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).send({ message: 'Item not found in cart.' });
        }

        const item = cart.cartItems[itemIndex];
        item.quantity = quantity;
        item.subtotal = subtotal;

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: 'Item quantity updated successfully.',
            updatedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


module.exports.removeFromCart = async (req, res) => {
    try {
        if (!req.user || req.user.isAdmin) {
            return res.status(403).send({ message: 'Access forbidden for admin users.' });
        }

        const { productId } = req.params;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).send({ message: 'Product ID is required.' });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found.' });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).send({ message: 'Item not found in cart.' });
        }

        cart.cartItems.splice(itemIndex, 1);

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: 'Item removed from cart successfully.',
            updatedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};


module.exports.clearCart = async (req, res) => {
    try {
        if (!req.user || req.user.isAdmin) {
            return res.status(403).send({ message: 'Access forbidden for admin users.' });
        }

        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: 'Cart not found.' });
        }

        cart.cartItems = [];
        cart.totalPrice = 0;

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: 'Cart cleared successfully.',
            cart: updatedCart
        });
    } catch (error) {
        return errorHandler(error, req, res);
    }
};
