import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './ApplicationDetails.css';

const ApplicationDetails = () => {
    const [application, setApplication] = useState(null);
    const [choices, setChoices] = useState([]);  
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const { competitionId, id: applicationId } = useParams();

    console.log(competitionId, applicationId);

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
        const fetchApplicationDetails = async () => {
            try {
                const response = await fetch(`/api/${competitionId}/applications/${applicationId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                    return;
                }

                setApplication(data);
            } catch (err) {
                setError('Failed to fetch application details');
            }
        };

        fetchApplicationDetails();
    }, [competitionId, applicationId]);

    useEffect(() => {
        if (application) {
            const fetchChoices = async () => {
                try {
                    const response = await fetch(`/api/${applicationId}/choices`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (data.error) {
                        setError(data.error);
                        return;
                    }

                    setChoices(data);  
                } catch (err) {
                    setError('Failed to fetch choices');
                }
            };

            fetchChoices();
        }
    }, [application, competitionId, applicationId]);  

    console.log(application);
    console.log(choices);

    if (error) {
        return <div className="alert-error">Error: {error}</div>;
    }

    if (!application) {
        return <div>Loading...</div>;
    }

    return (
        <div className="application-details-container mt-3">
            <h1 className="application-title">Details for Application</h1>
            <div className="application-description">
                <p><strong>Status:</strong> {application.status}</p>
                <p><strong>Application Date:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
                <p><strong>User:</strong> {application.user?.username} ({application.user?.email})</p>
                <p><strong>Erasmus Competition:</strong> {application.erasmusCompetition.title}</p>
                <p><strong>Files:</strong></p>
                <ul>
                    {application.files.map((fileId, index) => (
                        <li key={index}>{fileId}</li>
                    ))}
                </ul>

                <p><strong>Choices:</strong></p>
                {choices.length > 0 ? (
                    <ul>
                        {choices.map((choice, index) => (
                            <li key={index}>{choice.branch.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No choices available.</p>
                )}
            </div>
        </div>
    );
};

export default ApplicationDetails;
