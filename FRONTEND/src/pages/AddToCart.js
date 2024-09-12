// src/pages/AddToCart.js
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function AddToCart() {
  const location = useLocation();
  const product = location.state?.product || {}; // Extract the product from location state
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    console.log('Product:', product);
    if (!product || !product._id || !product.name || !product.price) {
      console.error('Product is missing required properties.');
      return;
    }

    try {
      const response = await fetch('/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          productName: product.name,
          productPrice: product.price,
          quantity,
        }),
      });

      console.log('Response Status:', response.status);
      if (response.ok) {
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          console.log('Navigating to /cart');
          navigate('/cart'); // Navigate to CartView
        }, 1000);
      } else {
        const errorText = await response.text();
        console.error('Failed to add item to cart:', errorText);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>
                <strong>Description:</strong> {product.description}
              </Card.Text>
              <Card.Text>
                <strong>Price:</strong> ₱{product.price}
              </Card.Text>
              <Form.Group as={Row} className="mb-3" controlId="formQuantity">
                <Form.Label column sm={2}>
                  Quantity:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  />
                </Col>
              </Form.Group>
              <Button variant="primary" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              {showAlert && <Alert variant="success">Added to Cart</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddToCart;
