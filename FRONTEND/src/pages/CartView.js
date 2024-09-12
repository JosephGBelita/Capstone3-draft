import React, { useState, useEffect } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Spinner, Alert } from 'react-bootstrap';

function CartView() {
  const [cart, setCart] = useState(null);  // Holds the entire cart object
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch cart items from the backend on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('/api/get-cart', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            setError('Your cart is empty.');
          } else {
            throw new Error('Failed to fetch cart items');
          }
        } else {
          const data = await response.json();
          setCart(data.cart[0]);  // Assuming data.cart is an array
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Function to handle removing an item from the cart
  const handleRemoveItem = async (productId) => {
    try {
      // You would call your backend API to remove the item here
      // After removing, update the cart in the frontend state
      const updatedCartItems = cart.cartItems.filter(item => item.productId._id !== productId);
      setCart(prevCart => ({
        ...prevCart,
        cartItems: updatedCartItems,
        totalPrice: updatedCartItems.reduce((total, item) => total + item.subtotal, 0),
      }));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Handle updating the quantity
  const handleQuantityChange = async (productId, newQuantity) => {
    const updatedCartItems = cart.cartItems.map(item =>
      item.productId._id === productId
        ? { ...item, quantity: newQuantity, subtotal: item.productId.price * newQuantity }
        : item
    );
    setCart(prevCart => ({
      ...prevCart,
      cartItems: updatedCartItems,
      totalPrice: updatedCartItems.reduce((total, item) => total + item.subtotal, 0),
    }));

    // Call your backend API to update the cart quantity
    // Example: PUT /api/cart/:productId
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading your cart...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Your cart is empty.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center">Your Shopping Cart</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.cartItems.map((item) => (
            <tr key={item.productId._id}>
              <td>
                <a href={`/product/${item.productId._id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                  {item.productId.name}
                </a>
              </td> {/* Product name */}
              <td>₱{item.productId.price}</td> {/* Product price */}
              <td>
                <InputGroup className="quantity-input">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuantityChange(item.productId._id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <FormControl
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId._id, parseInt(e.target.value, 10))}
                    className="text-center"
                    style={{ maxWidth: '50px' }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </InputGroup>
              </td>
              <td>₱{item.subtotal}</td> {/* Subtotal */}
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveItem(item.productId._id)}
                  className="btn-sm"
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between mt-4">
        <h4>Total: ₱{cart.totalPrice}</h4> {/* Total price */}
        <div>
          <Button variant="success" className="mr-2">Checkout</Button>
          <Button variant="danger" onClick={() => setCart(null)}>Clear Cart</Button>
        </div>
      </div>
    </Container>
  );
}

export default CartView;
