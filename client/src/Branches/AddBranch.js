import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function AddBranch() {
  const { institutionId } = useParams(); 

  const [branchData, setBranchData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    category: '', // Initial category state
  });
  const [categories, setCategories] = useState([]); // State to store categories
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setCategories(data); // Set categories to state
        }
      } catch (err) {
        setError('Greška prilikom učitavanja kategorija');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setBranchData({
      ...branchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sending data to API to add branch
    fetch('/api/branches/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...branchData,
        institution: institutionId,  // Include institution ID
      }),
    })
      .then((response) => {
        if (response.ok) {
          navigate(`/institutions/${institutionId}`);
        } else {
          setError('Greška prilikom dodavanja odjela');
        }
      })
      .catch((error) => {
        setError('Greška: ' + error.message);
      });
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Dodaj Odjel</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Naziv Odjela</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={branchData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Adresa</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={branchData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="city" className="mb-3">
          <Form.Label>Grad</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={branchData.city}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="country" className="mb-3">
          <Form.Label>Država</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={branchData.country}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="category" className="mb-3">
          <Form.Label>Kategorija</Form.Label>
          <Form.Control
            as="select" // Changed to select dropdown
            name="category"
            value={branchData.category}
            onChange={handleChange}
            required
          >
            <option value="">Odaberite kategoriju</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Dodaj Odjel
        </Button>
      </Form>
    </Container>
  );
}

export default AddBranch;
