import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function EditUser() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    dateOfBirth: '',
    OIB: '',
    address: '',
    city: '',
    country: '',
    email: '',
    password: '',
    role: 'student',
    branch: '', // This will hold the selected branch
  });

  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // Extract ID from the URL parameters
  console.log("ID ",id)

  // Fetch user data and branches
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userResponse = await fetch(`/api/users/${id}`);
        const user = await userResponse.json();
        if (user.error) {
          setError(user.error);
        } else {
          setUserData(user);
        }

        // Fetch branches
        const branchResponse = await fetch('/api/allbranches');
        const branchData = await branchResponse.json();
        if (branchData.error) {
          setError(branchData.error);
        } else {
          setBranches(branchData);
        }
        setLoading(false);
      } catch (err) {
        setError('Greška prilikom učitavanja podataka');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          navigate('/users');
        }
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        setError('Greška prilikom ažuriranja korisnika');
      });
  };

  if (loading) {
    return <Container className="my-5"><h1>Učitavanje...</h1></Container>;
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">Uredi korisnika</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>Ime</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Prezime</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="username" className="mb-3">
          <Form.Label>Korisničko ime</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
            minLength={4}
          />
        </Form.Group>
        <Form.Group controlId="dateOfBirth" className="mb-3">
          <Form.Label>Datum rođenja</Form.Label>
          <Form.Control
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="OIB" className="mb-3">
          <Form.Label>OIB</Form.Label>
          <Form.Control
            type="number"
            name="OIB"
            value={userData.OIB}
            onChange={handleChange}
            required
            minLength={11}
            maxLength={11}
          />
        </Form.Group>
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Adresa</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="city" className="mb-3">
          <Form.Label>Grad</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={userData.city}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="country" className="mb-3">
          <Form.Label>Država</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={userData.country}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Form.Group controlId="role" className="mb-3">
          <Form.Label>Uloga</Form.Label>
          <Form.Select
            name="role"
            value={userData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="profesor">Profesor</option>
            <option value="koordinator">Koordinator</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="branch" className="mb-3">
    <Form.Label>Odjel</Form.Label>
    <Form.Select
        name="branch"
        value={userData.branch || ''} 
        onChange={handleChange}
        required
    >
        {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
                {branch.name}
            </option>
        ))}
    </Form.Select>
</Form.Group>

        <Button variant="primary" type="submit">
          Spremi promjene
        </Button>
      </Form>
    </Container>
  );
}

export default EditUser;
