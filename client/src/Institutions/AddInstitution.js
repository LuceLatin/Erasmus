import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AddInstitution() {
  const [institutionData, setInstitutionData] = useState({
    OIB: '',
    name: '',
    address: '',
    city: '',
    country: '',
    type: 'company',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInstitutionData({
      ...institutionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/institutions/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(institutionData),
    })
      .then((response) => {
        if (response.ok) {
          navigate('/institutions');
        } else {
          console.error('Greška prilikom dodavanja institucije');
        }
      })
      .catch((error) => {
        console.error('Greška:', error);
      });
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Dodaj Instituciju</h1>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <Form.Group controlId="OIB" className="mb-3">
          <Form.Label>OIB</Form.Label>
          <Form.Control
            type="number"
            name="OIB"
            value={institutionData.OIB}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Naziv</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={institutionData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="address" className="mb-3">
          <Form.Label>Adresa</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={institutionData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="city" className="mb-3">
          <Form.Label>Grad</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={institutionData.city}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="country" className="mb-3">
          <Form.Label>Država</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={institutionData.country}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="type" className="mb-3">
          <Form.Label>Tip</Form.Label>
          <Form.Select
            name="type"
            value={institutionData.type}
            onChange={handleChange}
            required
          >
            <option value="company">Tvrtka</option>
            <option value="college">Fakultet</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Dodaj Instituciju
        </Button>
      </Form>
    </Container>
  );
}

export default AddInstitution;
