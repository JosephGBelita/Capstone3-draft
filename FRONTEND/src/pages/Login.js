import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom'; // Import Link to handle navigation
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Login() {
    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    function authenticate(e) {
        e.preventDefault();

        fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.access !== undefined) {
                    localStorage.setItem('token', data.access);
                    retrieveUserDetails(data.access);

                    setEmail('');
                    setPassword('');
                    notyf.success('Successful Login');
                } else if (data.message === 'Incorrect email or password') {
                    notyf.error('Incorrect Credentials. Try Again');
                } else {
                    notyf.error('User Not Found. Try Again.');
                }
            });
    }

    function retrieveUserDetails(token) {
        fetch('http://localhost:4000/users/details', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUser({
                    id: data._id,
                    isAdmin: data.isAdmin,
                });
            });
    }

    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return user.id !== null ? (
        <Navigate to="/" />
    ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-4 border rounded shadow-sm w-50">
                <h1 className="my-4 text-center">Login</h1>
                <Form onSubmit={authenticate}>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    {isActive ? (
                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Login
                        </Button>
                    ) : (
                        <Button variant="danger" type="submit" className="w-100 mt-3" disabled>
                            Login
                        </Button>
                    )}
                </Form>

                <div className="mt-4 text-center">
                    <p>
                        Don't have an account yet?{' '}
                        <Link to="/register">Click here to register</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
