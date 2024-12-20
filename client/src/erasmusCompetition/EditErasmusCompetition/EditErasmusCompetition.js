import { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function EditErasmusCompetition() {
  const [competitionData, setCompetitionData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    role: 'student',
    institutionType: 'company',
  });

  const { id } = useParams();  
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetch(`/api/competitions/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCompetitionData({
          title: data.title,
          description: data.description,
          startDate: formatDate(data.startDate), 
          endDate: formatDate(data.endDate),     
          role: data.role,
          institutionType: data.institutionType,
        });
      })
      .catch((error) => {
        console.error('Error fetching competition data:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    setCompetitionData({
      ...competitionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`/api/competitions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(competitionData),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate('/erasmus-competitions/list');
      })
      .catch((error) => {
        console.error('Error updating competition:', error);
      });
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Uredi natječaj</h1>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={competitionData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={competitionData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="startDate" className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            value={competitionData.startDate}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="endDate" className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            value={competitionData.endDate}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="role" className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select
            name="role"
            value={competitionData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="professor">Professor</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="institutionType" className="mb-3">
          <Form.Label>Institution Type</Form.Label>
          <Form.Select
            name="institutionType"
            value={competitionData.institutionType}
            onChange={handleChange}
            required
          >
            <option value="company">Company</option>
            <option value="college">College</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Save changes
        </Button>
      </Form>
    </Container>
  );
}

export default EditErasmusCompetition;
