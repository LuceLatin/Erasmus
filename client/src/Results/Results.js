import React, { useEffect, useState } from 'react';
import { Table, Form, Badge } from 'react-bootstrap';
import { useGetCurrentUser } from '../hooks/useGetCurrentUser';
import { useNavigate } from 'react-router-dom';

function Results() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCompetition, setSelectedCompetition] = useState("");  // Stanje za odabrano natjecanje
    const { user } = useGetCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchPastApplications = async () => {
            try {
                const response = await fetch(`/api/past-applications?userId=${user._id}&role=${user.role}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching past applications:', error);
                setError('Failed to load past applications');
            }
        };

        fetchPastApplications();
    }, [user]);

    // Funkcija za filtriranje aplikacija na osnovu odabranog natjecanja
    const filteredApplications = selectedCompetition
        ? applications.filter(application => application.erasmusCompetition._id === selectedCompetition)
        : applications;

    // Funkcija za sortiranje aplikacija po statusu
    const sortApplications = (applications) => {
        return applications.sort((a, b) => {
            const statusOrder = { approved: 1, rejected: 2, pending: 3 };  // Definiramo redoslijed statusa
            return statusOrder[a.status] - statusOrder[b.status];
        });
    };

    const handleApplicationClick = (applicationId, competitionId) => {
        navigate(`/${competitionId}/applications/${applicationId}`);
    };

    // Funkcija koja se poziva kad korisnik izabere natjecanje
    const handleCompetitionChange = (e) => {
        setSelectedCompetition(e.target.value);
    };

    // Dohvati jedinstvena natjecanja za dropdown
    const competitions = [
        ...new Map(applications.map(application => [application.erasmusCompetition._id, application.erasmusCompetition])).values()
    ];

    // Funkcija za dodavanje stilova prema statusu aplikacije
    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <Badge bg="success">Prihvaćeno</Badge>;
            case 'rejected':
                return <Badge bg="danger">Odbijeno</Badge>;
            case 'pending':
                return <Badge bg="warning">Na čekanju</Badge>;
            default:
                return <Badge bg="secondary">Nepoznato</Badge>;
        }
    };

    // Sortiramo aplikacije prema statusu prije nego ih prikažemo
    const sortedApplications = sortApplications(filteredApplications);

    return (
        <div>
            <h1 className="left-aligned heading">
                {user?.role === 'koordinator' ? 'Rezultati' : ''}
            </h1>

            {error && <p className="text-danger">{error}</p>}

            {/* Dropdown za izbor natjecanja */}
            <Form.Group controlId="competitionSelect">
                <Form.Label>Odaberi natječaj za koji želiš vidjeti rezultate: </Form.Label>
                <Form.Control as="select" value={selectedCompetition} onChange={handleCompetitionChange}>
                    <option value="">Svi natječaji</option>
                    {competitions.map(competition => (
                        <option key={competition._id} value={competition._id}>
                            {competition.title}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            <p></p>

            {/* Prikazivanje rezultata u tabeli */}
            <Table striped bordered hover responsive variant="dark">
                <thead>
                    <tr>
                        <th>Natječaj</th>
                        <th>Tip</th>
                        <th>Datum prijave</th>
                        <th>Status</th>
                        {user?.role === 'koordinator' && <th>Korisnik</th>}
                    </tr>
                </thead>
                <tbody>
                    {sortedApplications.length > 0 ? (
                        sortedApplications.map((application) => (
                            <tr
                                key={application._id}
                                onClick={() => handleApplicationClick(application._id, application.erasmusCompetition._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{application.erasmusCompetition.title}</td>
                                <td>{application.erasmusCompetition.institutionType}</td>
                                <td>{new Date(application.applicationDate).toLocaleDateString()}</td>
                                <td>{getStatusBadge(application.status)}</td>
                                {user?.role === 'koordinator' && (
                                    <td>{`${application.user.firstName} ${application.user.lastName}`}</td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={user?.role === 'koordinator' ? 5 : 4}>Nema prošlih prijava za odabrano natječaj</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default Results;
