import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { useContext } from 'react';

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container fluid>
                <Navbar.Brand as={NavLink} to="/">The Zuitt Shop</Navbar.Brand>
                
                {/* Show "Products" beside "The Zuitt Shop" for non-admin or non-logged-in users */}
                {!user.id || (user.id && !user.isAdmin) ? (
                    <Navbar.Brand as={NavLink} to="/courses" className="ms-2">
                        Products
                    </Navbar.Brand>
                ) : null}

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* Show "Admin Dashboard" link only for admin users */}
                        {user.id && user.isAdmin && (
                            <Nav.Link as={NavLink} to="/admin">Admin Dashboard</Nav.Link>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {user.id ? (
                            <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
