import React, { useEffect, useState } from 'react';
import { ListGroup, Alert, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/Modal/modal';
import AddCategoryModal from './AddCategoryModal'; // Add the AddCategoryModal
import EditCategoryModal from './EditCategoryModal'; // Add the EditCategoryModal

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal visibility
    const [showAddModal, setShowAddModal] = useState(false); // State for add modal visibility
    const [showEditModal, setShowEditModal] = useState(false); // State for edit modal visibility
    const [categoryToDelete, setCategoryToDelete] = useState(null); // State to store the category to delete
    const [categoryToEdit, setCategoryToEdit] = useState(null); // State to store the category to edit
    const navigate = useNavigate();

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                    return;
                }
                setCategories(data);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleDelete = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!categoryToDelete) return;

        fetch(`/api/categories/${categoryToDelete._id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setCategories(categories.filter((category) => category._id !== categoryToDelete._id));
                    setShowDeleteModal(false);
                } else {
                    setError('Failed to delete category');
                }
            })
            .catch(() => setError('Error deleting category'));
    };

    const handleEdit = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        setCategoryToEdit(category);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setShowAddModal(false);
        setShowEditModal(false);
    };

    const refreshCategories = () => {
        // Refresh the categories list after adding or editing
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError('Failed to fetch categories');
            }
        };
        fetchCategories();
    };

    return (
        <div className="mt-3 mb-3" style={{ maxWidth: '600px' }}>
            <Button variant="primary" className="mb-3" onClick={() => setShowAddModal(true)}>
                Dodaj kategoriju
            </Button>

            {categories.length === 0 ? (
                <Alert variant="info">Nema dostupnih kategorija.</Alert>
            ) : (
                <ListGroup>
                    {categories.map((category) => (
                        <ListGroup.Item
                            key={category._id}
                            className="d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{category.name}</strong>
                            </div>
                            <div>
                                <Button
                                    variant="success"
                                    className="me-2"
                                    onClick={() => handleEdit(category._id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(category._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                handleClose={handleCloseModal}
                handleConfirm={confirmDelete}
                title="Potvrda brisanja"
                body={`Jeste li sigurni da želite obrisati kategoriju: ${categoryToDelete?.name}?`}
                confirmLabel="Obriši"
                closeLabel="Zatvori"
                error={error}
            />

            {/* Add Category Modal */}
            <AddCategoryModal
                show={showAddModal}
                handleClose={handleCloseModal}
                refreshCategories={refreshCategories}
            />

            {/* Edit Category Modal */}
            <EditCategoryModal
                show={showEditModal}
                handleClose={handleCloseModal}
                categoryId={categoryToEdit?._id}
                refreshCategories={refreshCategories}
            />
        </div>
    );
};

export default CategoryList;
