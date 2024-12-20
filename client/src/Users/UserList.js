import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));
  }, []);

  const handleEdit = (userId) => {
    // Add your edit functionality here
    console.log('Edit user with id:', userId);
  };

  const handleDelete = (userId) => {
    // Add your delete functionality here
    console.log('Delete user with id:', userId);
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
            <th>ID</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Korisničko ime</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
              <td>
                <Button variant="success" onClick={() => handleEdit(user.id)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserList;
