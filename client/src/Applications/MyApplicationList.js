import React, { useEffect, useState } from 'react';
import { Button, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUser } from '../hooks/useGetCurrentUser';

function MyApplicationList() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications');
      }
    };

    fetchApplications();
  }, [user]);

  const handleDeleteClick = (application) => {
    setDeleteId(application._id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/applications-delete/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete application');
      }

      setApplications((prevApplications) => prevApplications.filter((app) => app._id !== deleteId));
      setShowConfirm(false);
    } catch (error) {
      console.error('Error deleting application:', error);
      setError('Failed to delete application');
    }
  };

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
              <td colSpan="5">No applications found</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this application?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyApplicationList;
