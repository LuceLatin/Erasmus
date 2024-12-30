import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useGetCurrentUser } from '../hooks/useGetCurrentUser';
import { useNavigate } from 'react-router-dom';

function ActiveApplications() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useGetCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchActiveApplications = async () => {
            try {
                const response = await fetch(`/api/active-applications?userId=${user._id}&role=${user.role}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error fetching active applications:', error);
                setError('Failed to load active applications');
            }
        };

        fetchActiveApplications();
    }, [user]);

    const handleApplicationClick = (applicationId, competitionId) => {
        navigate(`/${competitionId}/applications/${applicationId}`);
    };

    return (
        <div>
            <h1 className="left-aligned heading">
                {user?.role === 'koordinator' ? 'Sve aktivne prijave' : 'Moje aktivne prijave'}
            </h1>
            {error && <p className="text-danger">{error}</p>}
            <Table striped bordered hover responsive>
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
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <tr
                                key={application._id}
                                onClick={() => handleApplicationClick(application._id, application.erasmusCompetition._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{application.erasmusCompetition.title}</td>
                                <td>{application.erasmusCompetition.institutionType}</td>
                                <td>{new Date(application.applicationDate).toLocaleDateString()}</td>
                                <td>{application.status}</td>
                                {user?.role === 'koordinator' && (
                                    <td>{`${application.user.firstName} ${application.user.lastName}`}</td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={user?.role === 'koordinator' ? 5 : 4}>Nema aktivnih prijava</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
}

export default ActiveApplications;
