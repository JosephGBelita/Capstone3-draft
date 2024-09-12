import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom'; // Import Link to handle navigation
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Register() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (
            firstName !== "" &&
            lastName !== "" &&
            email !== "" &&
            mobileNo !== "" &&
            password !== "" &&
            confirmPassword !== "" &&
            password === confirmPassword &&
            mobileNo.length === 11
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch('http://localhost:4000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                mobileNo,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'User registered successfully') {
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setMobileNo('');
                    setPassword('');
                    setConfirmPassword('');
                    notyf.success('Registration successful');
                } else {
                    notyf.error('Something went wrong.');
                }
            });
    }

    return user.id !== null ? (
        <Navigate to="/courses" />
    ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="p-4 border rounded shadow-sm w-50">
                <h1 className="my-4 text-center">Register</h1>
                <Form onSubmit={registerUser}>
                    <Form.Group>
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your First Name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Last Name:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your Last Name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Mobile Number:</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter your 11 digit mobile number"
                            required
                            value={mobileNo}
                            onChange={(e) => setMobileNo(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Verify Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Verify your password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    {isActive ? (
                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Register
                        </Button>
                    ) : (
                        <Button variant="danger" type="submit" className="w-100 mt-3" disabled>
                            Please enter your registration details
                        </Button>
                    )}
                </Form>

                <div className="mt-4 text-center">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Click here to log in</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
