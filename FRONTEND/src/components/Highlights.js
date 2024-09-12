// src/components/Highlights.js

import { Row, Col, Card, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Highlights() {
    const navigate = useNavigate();

    const handleDetailsClick = (product) => {
        navigate('/add-to-cart', { state: { product } });
    };

    const products = [
        {
            id: '1',
            name: 'REDRAGON ANVIL STEREO GAMING SPEAKER',
            description: 'The Redragon GS520 ANVIL 2X3W RGB PC Speakers is a great way to add some sound to your PC or laptop. It features a sleek design with RGB.',
            price: 9855,
        },
        {
            id: '2',
            name: 'Anya Mechanical Keyboard V2.0',
            description: 'Anya Version v2.0',
            price: 30599,
        },
        {
            id: '3',
            name: 'LOGITECH F310 GAMEPAD Pro',
            description: 'Play hits and classics. Play console ports with their native-style controller or adopt a more relaxed position while enjoying PC games.',
            price: 1234,
        },
        {
            id: '4',
            name: 'HYPERX QUADCAST S STANDALONE RGB USB MICROPHONE',
            description: 'Ideal standalone microphone for the aspiring streamer or podcaster looking for a condenser mic with quality sound.',
            price: 8395,
        },
        {
            id: '5',
            name: 'RAZER BASILISK X HYPERSPEED WIRELESS GAMING MOUSE',
            description: 'Play as you game in, hunt without restraint with the Razer Basilisk X HyperSpeed—a dual-mode wireless gaming mouse that provides low latency and reliable gaming performance.',
            price: 2395,
        },
    ];

    return (
        <Container fluid className="mt-3 mb-3">
            <Row className="justify-content-center">
                {products.map(product => (
                    <Col xs={12} sm={6} md={2} className="d-flex justify-content-center mb-3" key={product.id}>
                        <Card className="cardHighlight p-3" style={{ width: '14rem', height: '350px', overflowY: 'auto' }}>
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <Card.Title className="text-center" style={{ minHeight: '60px' }}>
                                    <span style={{ color: 'blue', textDecoration: 'none' }}>
                                        {product.name}
                                    </span>
                                </Card.Title>
                                <Card.Text className="flex-grow-1" style={{ minHeight: '80px' }}>
                                    <p>{product.description}</p>
                                </Card.Text>
                                <p className="text-center" style={{ color: 'orange' }}><strong>Price:</strong> ₱{product.price}</p>
                                <div className="text-center">
                                    <Button 
                                        variant="primary" 
                                        onClick={() => handleDetailsClick(product)}
                                    >
                                        Details
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
