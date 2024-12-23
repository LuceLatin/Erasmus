import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import { useFetcher } from "../../hooks/useFetcher";
import ConfirmationModal from '../../components/Modal/modal';

const CompetitionsList = () => {
    const [competitions, setCompetitions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [competitionToDelete, setCompetitionToDelete] = useState(null);
    const [error, setError] = useState(null);
    const { isCoordinator } = useGetCurrentUser();
    const navigate = useNavigate();
    const { loading, response } = useFetcher({ endpoint: '/api/competitions' });

    useEffect(() => {
        if (response) {
            setCompetitions(response);
        }
    }, [response]);

    if (loading) {
        return null;
    }

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

    const handleAddErasmusCompetition = () => {
        navigate('/erasmus-competitions/add');
    };

    const competitionNameToDelete = competitions.find(competition => competition._id === competitionToDelete)?.title;

    return (
        <div>
            <h1 className="left-aligned heading">Svi natječaji</h1>
            <div className="d-flex justify-content-start mb-3">
                <Button variant="primary" onClick={handleAddErasmusCompetition}>
                    Dodaj natječaj
                </Button>
            </div>
            <Table striped bordered hover responsive>
                <thead>
                <tr>
                    <th>Natječaj</th>
                    <th>Vrsta korisnika</th>
                    <th>Vrsta institucije</th>
                    <th>Datum pocetka</th>
                    <th>Datum zavrsetka</th>
                    <th>Akcije</th>
                </tr>
                </thead>
                <tbody>
                {competitions.map((competition) => (
                    <tr key={competition._id}>
                        <td>{competition.title}</td>
                        <td>{competition.role}</td>
                        <td>{competition.institutionType}</td>
                        <td>{new Date(competition.startDate).toLocaleDateString()}</td>
                        <td>{new Date(competition.endDate).toLocaleDateString()}</td>
                        <td>
                            {isCoordinator && (
                                <>
                                    <Button variant="success" onClick={() => handleEdit(competition._id)}>
                                        Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(competition._id)} className="ms-2">
                                        Delete
                                    </Button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <ConfirmationModal
                show={showDeleteModal}
                handleClose={handleCloseModal}
                handleConfirm={confirmDelete}
                title="Potvrda brisanja"
                body={`Jeste li sigurni da želite obrisati natječaj: ${competitionNameToDelete}?`}
                confirmLabel="Delete"
                closeLabel="Close"
                error={error}
            />
        </div>
    );
};

export default CompetitionsList;