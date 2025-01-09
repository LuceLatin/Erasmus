import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Table } from 'react-bootstrap';
import './PastCompetitions.css';

const PastCompetitions = () => {
    const [competitions, setCompetitions] = useState([]);
    const [filteredCompetitions, setFilteredCompetitions] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = document.cookie.split('access-token=')[1]?.split(';')[0];
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (err) {
                setError('Invalid token');
            }
        } else {
            setError('No token found');
        }
    }, []);

    useEffect(() => {
        if (userRole === null) return;

        const fetchCompetitions = async () => {
            try {
                const response = await fetch('/api/competitions', {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                    return;
                }

                const filtered = data.filter((competition) => {
                    const endDate = new Date(competition.endDate);
                    const today = new Date();
                    return endDate < today;
                });

                const roleMapping = {
                    student: 'student',
                    profesor: 'professor', // profesor -> professor
                };

                const filteredByRole = filtered.filter((competition) => {
                    if (userRole === 'koordinator') {
                        return true; 
                    }
                    const competitionRole = roleMapping[userRole]; 
                    return competition.role === competitionRole; 
                });

                setCompetitions(data); 
                setFilteredCompetitions(filteredByRole); 
            }
            catch (err) {
                setError('Failed to fetch competitions');
            }
        };

        fetchCompetitions();
    }, [userRole]);

    const handleCompetitionClick = (id) => {
        navigate(`/erasmus-competitions/${id}`); 
    };

    if (error) {
        return <div className="past-error-message">Error: {error}</div>;
    }

    return (
        <div className="past-competitions-container">
            <h1 className="past-competitions-heading">Prošli natječaji</h1><br/>
            <div className="past-competitions-list">
                {filteredCompetitions.length === 0 ? (
                    <p>
                        {userRole === 'student'
                            ? "Nema prošlih natječaja za studente."
                            : userRole === 'profesor'
                                ? "Nema prošlih natječaja za profesore."
                                : "Nema prošlih natječaja."
                        }
                    </p>
                ) : (
                    <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Natječaj</th>
                            <th>Vrsta korisnika</th>
                            <th>Vrsta institucije</th>
                            <th>Datum početka</th>
                            <th>Datum završetka</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCompetitions.map((competition) => (
                            <tr key={competition._id} onClick={() => handleCompetitionClick(competition._id)} style={{ cursor: 'pointer' }}>
                                <td>{competition.title}</td>
                                <td>{competition.role}</td>
                                <td>{competition.institutionType}</td>
                                <td>{new Date(competition.startDate).toLocaleDateString()}</td>
                                <td>{new Date(competition.endDate).toLocaleDateString()}</td>
                               
                            </tr>
                        ))}
                    </tbody>
                </Table>

            )}
            </div>
        </div>
    );
};

export default PastCompetitions;
