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
    const user = useGetCurrentUser();

    const { isCoordinator, isProfesor, isStudent } = useGetCurrentUser();
    const navigate = useNavigate();
    const { loading, response } = useFetcher({ endpoint: '/api/competitions' });

    useEffect(() => {
        if (response) {
            const today = new Date();

            // Filter natječaja na temelju uloge korisnika i provjere aktivnosti natječaja
            const filteredCompetitions = response.filter((competition) => {
                const endDate = new Date(competition.endDate);
                const isActive = endDate >= today; // Samo aktivni natječaji

                if (isCoordinator) {
                    return isActive;
                }
                if (isProfesor) {
                    return isActive && competition.role === 'profesor';
                }
                if (isStudent) {
                    return isActive && competition.role === 'student';
                }
                return false;
            });

            setCompetitions(filteredCompetitions);
        }
    }, [response, isProfesor, isCoordinator, isStudent]);

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

    const handleCompetitionClick = (id) => {
        navigate(`/erasmus-competitions/${id}`); 
    };

    const competitionNameToDelete = competitions.find(competition => competition._id === competitionToDelete)?.title;

    return (
        <div>
            <h1 className="left-aligned heading">Dostupni natječaji</h1>

            {competitions.length > 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Natječaj</th>
                            <th>Vrsta korisnika</th>
                            <th>Vrsta institucije</th>
                            <th>Datum pocetka</th>
                            <th>Datum zavrsetka</th>
                            {isCoordinator && <th>Akcije</th>}

                        </tr>
                    </thead>
                    <tbody>
                        {competitions.map((competition) => (
                            <tr key={competition._id} onClick={() => handleCompetitionClick(competition._id)} style={{ cursor: 'pointer' }}>
                                <td>{competition.title}</td>
                                <td>{competition.role}</td>
                                <td>{competition.institutionType}</td>
                                <td>{new Date(competition.startDate).toLocaleDateString()}</td>
                                <td>{new Date(competition.endDate).toLocaleDateString()}</td>
                                <td>
                                    {isCoordinator ? (
                                        <>
                                            <Button variant="success" onClick={(e) => { e.stopPropagation(); handleEdit(competition._id); }}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(competition._id); }} className="ms-2">
                                                Delete
                                            </Button>
                                        </>
                                    ) : (
                                        user?.role === competition?.role && (
                                            <Button variant="info" onClick={(e) => { e.stopPropagation(); navigate(`/erasmus-competitions/${competition._id}/apply/`); }}>
                                                Prijavi se
                                            </Button>
                                        )
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>Nema dostupnih natječaja.</p>
            )}

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
