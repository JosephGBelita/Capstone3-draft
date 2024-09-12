import React, { useState } from 'react'; 
import CourseCard from './CourseCard';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap';

const CourseSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Sample course data for demonstration purposes (this should come from your API)
  const courses = [
    { _id: 1, name: 'React Basics', description: 'Learn the basics of React.', price: 500 },
    { _id: 2, name: 'Advanced React', description: 'Take your React skills to the next level.', price: 1500 },
    { _id: 3, name: 'JavaScript Essentials', description: 'Master JavaScript from scratch.', price: 1000 },
  ];

  const handleSearchByName = () => {
    if (searchQuery.trim() === '') {
      // If searchQuery is empty, do not filter the results
      setSearchResults([]);
      return;
    }

    const filteredCourses = courses.filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredCourses);
  };

  const handleSearchByPrice = () => {
    if (minPrice.trim() === '' && maxPrice.trim() === '') {
      // If both minPrice and maxPrice are empty, do not filter the results
      setSearchResults([]);
      return;
    }

    const filteredCourses = courses.filter(course =>
      (!minPrice || course.price >= parseFloat(minPrice)) &&
      (!maxPrice || course.price <= parseFloat(maxPrice))
    );
    setSearchResults(filteredCourses);
  };

  const handleClear = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSearchResults([]);
  };

  return (
    <div className="container mt-4">
      <h2>Course Search</h2>

      {/* Search Input for Course Name */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="courseName">Course Name:</Form.Label>
        <Form.Control
          type="text"
          id="courseName"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Enter course name"
        />
      </Form.Group>

      {/* Minimum Price Input */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="minPrice">Minimum Price:</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Enter minimum price"
          />
        </InputGroup>
      </Form.Group>

      {/* Maximum Price Input */}
      <Form.Group className="mb-3">
        <Form.Label htmlFor="maxPrice">Maximum Price:</Form.Label>
        <InputGroup>
          <Form.Control
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Enter maximum price"
          />
        </InputGroup>
      </Form.Group>

      {/* Buttons with Spacing */}
      <div className="mb-3">
        <Button className="me-2" variant="primary" onClick={handleSearchByName}>
          Search by Name
        </Button>
        <Button className="me-2" variant="info" onClick={handleSearchByPrice}>
          Search by Price
        </Button>
        <Button variant="danger" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Line separating search results and course cards */}
      <hr />

      <h3>Search Results:</h3>

      {/* Line below the text to separate from CourseCard */}
      <hr />

      {/* Course Cards displayed in rows of 3 */}
      <Row>
        {searchResults.map((course) => (
          <Col md={4} key={course._id}>
            <CourseCard courseProp={course} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CourseSearch;
