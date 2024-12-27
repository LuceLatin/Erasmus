import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCurrentUser } from '../hooks/useGetCurrentUser';  

function MyApplicationList() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useGetCurrentUser();  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;  

    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/applications/${user._id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();

        setApplications(data);

        console.log(applications)
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications');
      }
    };

    fetchApplications();
  }, [user]);

  const handleDeleteClick = (institution) => {}

  const handleApplicationClick = (applicationId, competitionId) => {
    navigate(`/${competitionId}/applications/${applicationId}`);
  };


  

  return (
    <div>
      <h1 className="left-aligned heading">Moje prijave</h1>
      {error && <p className="text-danger">{error}</p>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Natječaj</th>
            <th>Tip</th>
            <th>Datum Prijave</th>
            <th>Status</th>
            <th>Akcije</th>
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
                <td>
                <Button
                  variant="success"
                  className="me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/${application.erasmusCompetition._id}/applications/edit/${application._id}`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(application);
                  }}
                >
                  Delete
                </Button>
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No applications found</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default MyApplicationList;
