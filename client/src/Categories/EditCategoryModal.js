import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const EditCategoryModal = ({ show, handleClose, categoryId, refreshCategories }) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (categoryId) {
            // Fetch the category details to populate the modal fields
            fetch(`/api/categories/${categoryId}`)
                .then((response) => response.json())
                .then((data) => setCategoryName(data.name))
                .catch((err) => setError('Failed to fetch category'));
        }
    }, [categoryId]);

    const handleChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/categories/edit/${categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName }),
            });

            if (response.ok) {
                refreshCategories(); // Refresh the categories list
                handleClose();
            } else {
                setError('Failed to update category');
            }
        } catch (err) {
            setError('Error updating category');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Uredi Kategoriju</Modal.Title>
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
                        Spremi Promjene
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCategoryModal;
