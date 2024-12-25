import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function EditBranch() {
  const { institutionId, id: branchId } = useParams();
  const [branchData, setBranchData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (response.ok) {
          setCategories(data);
        } else {
          setError(data.error || 'Greška prilikom učitavanja kategorija');
        }
      } catch {
        setError('Greška prilikom učitavanja kategorija');
      }
    };

    const fetchBranchData = async () => {
      try {
        const response = await fetch(`/api/branches/${branchId}`);
        const data = await response.json();
        if (response.ok) {
          setBranchData({
            name: data.name,
            address: data.address,
            city: data.city,
            country: data.country,
            category: data.category, // Map category correctly
          });
        } else {
          setError(data.error || 'Greška prilikom učitavanja podataka odjela');
        }
      } catch {
        setError('Greška prilikom učitavanja podataka odjela');
      }
    };

    fetchCategories();
    fetchBranchData();
  }, [branchId]);

  const handleChange = (e) => {
    setBranchData({ ...branchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/${institutionId}/branches/edit/${branchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...branchData,
        }),
      });

      if (response.ok) {
        navigate(`/institutions/${institutionId}`); // Navigate to branch list or success page
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Greška prilikom uređivanja odjela');
      }
    } catch {
      setError('Greška prilikom uređivanja odjela');
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Uredi Odjel</h1>
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
            as="select"
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
          Spremi Odjel
        </Button>
      </Form>
    </Container>
  );
}

export default EditBranch;
