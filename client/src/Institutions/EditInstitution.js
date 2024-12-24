import React, { useEffect, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function EditInstitution() {
  const { id } = useParams(); // Dohvaća ID iz URL-a
  const [institutionData, setInstitutionData] = useState({
    firstName: '',
    lastName: '',
    institutionname: '',
    dateOfBirth: '',
    OIB: '',
    address: '',
    city: '',
    country: '',
    email: '',
    password: '',
    role: 'student',
    branch: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Dohvati podatke o instituciji prema ID-ju
    fetch(`/api/institutions/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setInstitutionData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Greška pri dohvaćanju institucije:', error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setInstitutionData({
      ...institutionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ažuriraj podatke o instituciji
    fetch(`/api/institutions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(institutionData),
    })
      .then((response) => {
        if (response.ok) {
          navigate('/institutions'); // Preusmjeri na listu institucija
        } else {
          console.error('Greška pri ažuriranju institucije.');
        }
      })
      .catch((error) => {
        console.error('Greška pri ažuriranju:', error);
      });
  };

  if (loading) {
    return <Container className="my-5">Učitavanje...</Container>;
  }

  return (
    <Container className="my-5">
      <h1 className="mb-4">Uredi instituciju</h1>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <Form.Group controlId="OIB" className="mb-3">
          <Form.Label>OIB</Form.Label>
          <Form.Control
            type="number"
            name="OIB"
            value={institutionData.OIB}
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
            value={institutionData.address}
            onChange={handleChange}
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
        <Form.Group controlId="city" className="mb-3">
          <Form.Label>Grad</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={institutionData.city}
            onChange={handleChange}
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
          Spremi promjene
        </Button>
      </Form>
    </Container>
  );
}

export default EditInstitution;
