import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import ResetPassword from '../components/ResetPassword'; 
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Profile() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [details, setDetails] = useState({ firstName: '', lastName: '', mobileNo: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                setDetails(data);
            } else {
                notyf.error(data.error || "Something went wrong. Contact your system admin.");
            }
        });
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsUpdating(true);

        fetch(`http://localhost:4000/users/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                firstName: details.firstName,
                lastName: details.lastName,
                mobileNo: details.mobileNo
            })
        })
        .then(res => res.json())
        .then(data => {
            setIsUpdating(false);
            if (data.success) {
                notyf.success("Profile updated successfully!");
            } else {
                notyf.error(data.error || "Failed to update profile.");
            }
        });
    };

    return (
        user.id === null ? 
            <Navigate to="/courses" />
            :
            <Container className="mt-5 p-5 bg-primary text-white">
                <Row>
                    <Col className="p-5 bg-primary text-white">
                        <h1 className="my-5">Profile</h1>
                        <Form onSubmit={handleUpdate}>
                            <Form.Group controlId="formFirstName" className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={details.firstName}
                                    onChange={(e) => setDetails({...details, firstName: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formLastName" className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={details.lastName}
                                    onChange={(e) => setDetails({...details, lastName: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formMobileNo" className="mb-4">
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={details.mobileNo}
                                    onChange={(e) => setDetails({...details, mobileNo: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3" disabled={isUpdating}>
                                {isUpdating ? 'Updating...' : 'Update Profile'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="pt-4 mt-4">
                    <Col>
                        <ResetPassword />
                    </Col>
                </Row>
            </Container>
    );
}
