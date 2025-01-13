import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import ConfirmationModal from '../components/Modal/modal';

function UserList() {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [userNameToDelete, setUserNameToDelete] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleEdit = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleDeleteClick = (userId, userName) => {
    setUserIdToDelete(userId);
    setUserNameToDelete(userName);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userIdToDelete) {
      fetch(`/api/users/${userIdToDelete}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user._id !== userIdToDelete)
            );
            setShowDeleteModal(false);
          } else {
            setError('Greška prilikom brisanja korisnika.');
          }
        })
        .catch((err) => {
          setError('Greška: ' + err.message);
        });
    }
  };

  const handleAddUserClick = () => {
    navigate('/users/add');
  };

  return (
    <div>
      <h1 className="left-aligned heading">Korisnici</h1>
      <div className="d-flex justify-content-start mb-3">
        <Button variant="primary" onClick={handleAddUserClick}>
          Dodaj korisnika
        </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Korisničko ime</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 &&
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.username}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handleEdit(user._id)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(user._id, user.username)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={confirmDelete}
        title="Potvrda brisanja"
        body={`Jeste li sigurni da želite obrisati korisnika: ${userNameToDelete}?`}
        confirmLabel="Delete"
        closeLabel="Close"
        error={error}
      />
    </div>
  );
}

export default UserList;
