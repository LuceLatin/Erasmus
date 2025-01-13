import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const loginData = { email, password };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                navigate("/");
            } else {
                alert('Netočan email ili password');
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    };

    return (
        <Container>
            <h3 className="mb-4 mt-4">Prijava</h3>
            <Form style={{ maxWidth: '600px' }} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email adresa</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Unesite email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Lozinka</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Unesite lozinku"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Prijavi se
                </Button>
            </Form>
        </Container>
    );
};

export default Login;
