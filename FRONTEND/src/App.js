import './App.css';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Courses from './pages/Products';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Error from './pages/Error';
import Profile from './pages/Profile';
import CourseView from './pages/ProductView';
import AddCourse from './pages/AddProduct';
import AdminView from './components/AdminView'; // Ensure this path is correct
import AddToCart from './pages/AddToCart';
import CartView from './pages/CartView';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  const [coursesData, setCoursesData] = useState([]);

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.access !== undefined) {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin
          });
        } else {
          setUser({
            id: null,
            isAdmin: null
          });
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/courses`)
      .then(res => res.json())
      .then(data => setCoursesData(data))
      .catch(error => console.error('Error fetching courses data:', error));
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin" element={<AdminView coursesData={coursesData} fetchData={() => {/* Your fetch function */}} />}
            />
            <Route path="/add-to-cart" element={<AddToCart />} />
            <Route path="/cart" element={<CartView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addCourse" element={<AddCourse />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
