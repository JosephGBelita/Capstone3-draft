import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function EditProduct({product, fetchData}){

		const notyf = new Notyf();

		const [productId, setproductId] = useState(product._id);

        //Forms state
        //Add state for the forms of course
        const [name, setName] = useState(product.name);
        const [description, setDescription] = useState(product.description)
        const [price, setPrice] = useState(product.price)

        //state for editCourse Modals to open/close
        const [showEdit, setShowEdit] = useState(false)

        const openEdit = () => {
        	setShowEdit(true)
        }

        const closeEdit = () => {
        	setShowEdit(false);
        	setName('');
        	setDescription('');
        	setPrice(0)
        }

        const editCourse = (e, productId) => {
        	e.preventDefault();

        	fetch(`${process.env.REACT_APP_API_URL}/product/${courseId}`, {
        		method: 'PATCH',
        		headers: {
        			'Content-Type': 'application/json',
        			Authorization: `Bearer ${localStorage.getItem('token')}`
        		},
        		body:JSON.stringify({
        			name: name,
        			description: description,
        			price: price
        		})
        	})
        	.then(res => res.json())
        	.then(data => {
        		console.log(data)

        		if(data.success === true) {
        			notyf.success("Successfully Updated")
        			closeEdit();
        			fetchData();
        		} else {
        			notyf.error("Something went wrong")
        			closeEdit();
        			fetchData();
        		}
        	})
        }
    
    return(
        <>
            <Button variant="primary" size="sm" onClick={() => openEdit(course)}> Edit </Button>


            {/*EDIT MODAL*/}
            <Modal show={showEdit} onHide={closeEdit}>
                <Form onSubmit={e => editCourse(e, courseId)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Course</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                required/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control 
                                type="number" 
                                value={price} 
                                onChange={e => setPrice(e.target.value)} 
                                required/>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEdit}>Close</Button>
                        <Button variant="success" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </>
        )
}