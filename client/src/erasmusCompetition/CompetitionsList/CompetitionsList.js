import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CompetitionsList = () => {
    const [competitions, setCompetitions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [competitionToDelete, setCompetitionToDelete] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/competitions')
            .then((response) => response.json())
            .then((data) => setCompetitions(data))
            .catch((err) => console.error('Error fetching competitions:', err));
    }, []);

    const handleEdit = (id) => {
        navigate(`/competitions/edit/${id}`);
    };

    const handleDelete = (id) => {
        setCompetitionToDelete(id); 
        setShowDeleteModal(true);  
    };

    const confirmDelete = () => {
        fetch(`/api/competitions/${competitionToDelete}`, {
            method: 'DELETE',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                setCompetitions(prevCompetitions => 
                    prevCompetitions.filter(competition => competition._id !== competitionToDelete)
                );
                setShowDeleteModal(false); 
            } else {
                setError("Brisanje nije uspjelo.");
            }
        })
        .catch((error) => {
            console.error('Error deleting competition:', error);
            setError("An error occurred while deleting the competition.");
        });
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setError(null);
    };

    const competitionNameToDelete = competitions.find(competition => competition._id === competitionToDelete)?.title;

    return (
        <div>
            <h1 className="left-aligned heading">Svi natječaji</h1>
            {competitions.map((competition) => (
                <div key={competition._id} className="competition-item d-flex gap-3 mb-4">
                    <p className="mb-0">{competition.title}</p>
                    <Button variant="success" onClick={() => handleEdit(competition._id)}> 
                        Edit 
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(competition._id)} className="ms-2">
                        Delete
                    </Button>
                </div>
            ))}

            {/* Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseModal} className="mt-5">
                <Modal.Header closeButton>
                    <Modal.Title>Potvrda brisanja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Jeste li sigurni da želite obrisati natječaj: 
                    <strong> {competitionNameToDelete} </strong>?
                    {error && <div className="text-danger mt-3">{error}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompetitionsList;
