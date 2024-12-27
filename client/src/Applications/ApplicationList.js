import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [competition, setCompetition] = useState([]);
  const [error, setError] = useState(null);
  const { competitionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await fetch(`/api/competitions/${competitionId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();

        setCompetition(data); 

      } catch (error) {
        console.error('Error fetching competition:', error);
      }
    };

    if (competitionId) {
      fetchCompetition();
    }
  }, [competitionId]);

  useEffect(() => {
    fetch(`/api/${competitionId}/applications`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setApplications(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications');
      });
  }, [competitionId]);

  const handleApplicationClick = (applicationId) => {
    navigate(`/${competitionId}/applications/${applicationId}`);
  };

  console.log(applications)

  return (
    <div>
      <h1 className="left-aligned heading">Prijave za: {competition.title}</h1>
      {error && <p className="text-danger">{error}</p>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Korisničko Ime</th>
            <th>Email</th>
            <th>Datum Prijave</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr
              key={application._id}
              onClick={() => handleApplicationClick(application._id)}
              style={{ cursor: 'pointer' }}
            >
              <td>{application.user.username}</td>
              <td>{application.user.email}</td>
              <td>{new Date(application.applicationDate).toLocaleDateString()}</td>
              <td>{application.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default ApplicationList;
