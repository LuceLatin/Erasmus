import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const AddCategoryModal = ({ show, handleClose, refreshCategories }) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/categories/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName }),
            });

            if (response.ok) {
                refreshCategories(); 
                handleClose();
            } else {
                setError('Failed to add category');
            }
        } catch (err) {
            setError('Error adding category');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Dodaj Kategoriju</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="categoryName">
                        <Form.Label>Ime Kategorije</Form.Label>
                        <Form.Control
                            type="text"
                            value={categoryName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Dodaj
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCategoryModal;
