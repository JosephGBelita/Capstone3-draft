const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { errorHandler } = require('../auth');


module.exports.createOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).send('No cart found for user.');
    }
    const order = new Order({
      userId: userId,
      productsOrdered: cart.cartItems,
      totalPrice: cart.totalPrice,
      orderedOn: new Date(),
      status: 'Pending',
    });
    await order.save();

    res.status(201).send("Ordered Successfully");
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId: userId });

    if (orders.length === 0) {
      return res.status(404).send('No orders found for this user.');
    }

    res.status(200).send({orders}); 
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).send('Internal server error');
  }
};


module.exports.getAllOrders = async (req, res) => {
  const userId = req.user.id; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    if (!user.isAdmin) {
      return res.status(403).send('Access denied. Admins only.');
    }
    const orders = await Order.find();
    if (orders.length === 0) {
      return res.status(404).send('No orders found.');
    }
    res.status(200).send({orders});
  } catch (error) {
    console.error('Error retrieving all orders:', error);
    res.status(500).send('Internal server error');
  }
};