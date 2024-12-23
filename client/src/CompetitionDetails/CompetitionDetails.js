import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CompetitionDetails.css';
import { jwtDecode } from 'jwt-decode'; 

const CompetitionDetails = () => {
    const { id } = useParams()
    const [competition, setCompetition] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = document.cookie.split('access-token=')[1]?.split(';')[0];
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);  
                setUserRole(decodedToken.role);
            } 
            catch (err) {
                setError('Invalid token');
            }
        }
        else {
            setError('No token found');
        }
    }, []);
    

    useEffect(() => {
       
        const fetchCompetitionDetails = async () => {
            try {
                const response = await fetch(`/api/competitions/${id}`, {
                    method: 'GET',
                    credentials: 'include',  
                });
                

                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                    return;
                }

                setCompetition(data);
            } 
            catch (err) {
                setError('Failed to fetch competition details');
            }
        };

        fetchCompetitionDetails();
    }, [id]);

    if (error) {
        return <div className="alert-error">Error: {error}</div>;
    }

    if (!competition) {
        return <div>Loading...</div>;
    }

    return (
        <div className="competition-details-container">
            <h1 className="competition-title">{competition.title}</h1>
            <div className="competition-description">
                <p><strong>Opis:</strong> {competition.description}</p>
                <p><strong>Vrsta institucije:</strong> {competition.institutionType}</p>
                <p><strong>Vrijedi za rolu:</strong> {competition.role}</p>
            </div>

            <div className="date-section">
                <div>
                    <p><strong>Vrijedi od:</strong> {new Date(competition.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <p><strong>Vrijedi do:</strong> {new Date(competition.endDate).toLocaleDateString()}</p>
                </div>
            </div>

        </div>
    );
};

export default CompetitionDetails;
