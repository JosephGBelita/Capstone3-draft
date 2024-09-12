// src/components/CourseCard.js

import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const isLoggedIn = () => {
  return !!localStorage.getItem('userToken'); // Example: check token presence
};

export default function CourseCard({ courseProp }) {
  const { _id, name, description, price } = courseProp;
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    if (isLoggedIn()) {
      navigate('/add-to-cart', { state: { product: courseProp } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="col-md-4 mb-4"> {/* Ensures 3 cards per row */}
      <Card className="h-100">
        <Card.Body>
          <Card.Title
            className="text-primary clickable-title"
            onClick={handleDetailsClick}
            style={{ cursor: 'pointer' }}
          >
            {name}
          </Card.Title>
          <Card.Subtitle className="mb-2">Description:</Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <Card.Subtitle className="mb-2">Price:</Card.Subtitle>
          <Card.Text className="text-warning">₱{price}</Card.Text>
          <hr />
          <button
            className="btn btn-primary w-100"
            onClick={handleDetailsClick}
          >
            Details
          </button>
        </Card.Body>
      </Card>
    </div>
  );
}

CourseCard.propTypes = {
  courseProp: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};
