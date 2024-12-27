import React, { useEffect, useState } from 'react';
import { ListGroup, Alert, Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/Modal/modal';
import './BranchList.css';

const BranchList = ({ institutionId }) => {
    const [branches, setBranches] = useState([]);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);
    const [open, setOpen] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await fetch(`/api/branches?institution=${institutionId}`);
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                    return;
                }
                setBranches(data);
            } catch (err) {
                setError('Failed to fetch branches');
            }
        };
        fetchBranches();
    }, [institutionId]);

    const handleShowModal = (branch) => {
        setBranchToDelete(branch);
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setBranchToDelete(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!branchToDelete) return;

        try {
            const response = await fetch(`/api/branches/${branchToDelete._id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
                return;
            }
            setBranches((prev) => prev.filter((branch) => branch._id !== branchToDelete._id));
            handleCloseModal();
        } catch (err) {
            setError('Failed to delete branch');
        }
    };

    const handleEdit = (id) => {
        navigate(`/${institutionId}/branches/edit/${id}`);
    };

    if (error) {
        return <Alert variant="danger">Error: {error}</Alert>;
    }

    return (
        <div className="branches-section black-border gray-background mt-2 mb-2">
            <div onClick={() => setOpen(!open)}
                aria-controls="branch-list"
                aria-expanded={open}
                style={{ cursor: 'pointer' }}
                >
              <h2>Odjeli</h2>
            </div>
            
            <Collapse in={open}>
                <div id="branch-list">
                    <Button variant="primary" className="mb-2" onClick={() => navigate(`/${institutionId}/branches/add`)}>
                        Dodaj odjel
                    </Button>
                    {branches.length === 0 ? (
                        <Alert variant="info">Nema dostupnih odjela za ovu instituciju.</Alert>
                    ) : (
                        <ListGroup>
                            {branches.map((branch) => (
                                <ListGroup.Item key={branch._id} className="d-flex justify-content-between align-items-center gray-background">
                                    <div>
                                        <strong>{branch.name}</strong> - {branch.address}, {branch.city}, {branch.country}
                                    </div>
                                    <div>
                                        <Button
                                            variant="success"
                                            className="me-2"
                                            onClick={() => handleEdit(branch._id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleShowModal(branch)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </div>
            </Collapse>
            <ConfirmationModal
                show={showDeleteModal}
                handleClose={handleCloseModal}
                handleConfirm={confirmDelete}
                title="Potvrda brisanja"
                body={`Jeste li sigurni da želite obrisati odjel: ${branchToDelete?.name}?`}
                confirmLabel="Obriši"
                closeLabel="Zatvori"
                error={error}
            />
        </div>
    );
};

export default BranchList;
