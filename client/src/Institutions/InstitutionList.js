import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/Modal/modal';

function InstitutionList() {
  const [institutions, setInstitutions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/institutions')
      .then((response) => response.json())
      .then((data) => setInstitutions(data))
      .catch((err) => console.error('Error fetching institutions:', err));
  }, []);

  const handleInstitutionClick = (id) => {
    navigate(`/institutions/${id}`);
  };

  const handleDeleteClick = (institution) => {
    setInstitutionToDelete(institution);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setInstitutionToDelete(null);
    setError('');
  };

  const confirmDelete = () => {
    fetch(`/api/institutions/${institutionToDelete._id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setInstitutions((prev) =>
            prev.filter((inst) => inst._id !== institutionToDelete._id)
          );
          handleCloseModal();
        } else {
          setError('Greška prilikom brisanja institucije.');
        }
      })
      .catch((err) => {
        console.error('Error deleting institution:', err);
        setError('Došlo je do greške. Pokušajte ponovno.');
      });
  };

  return (
    <div>
      <h1 className="left-aligned heading">Institucije</h1>
      <div className="d-flex justify-content-start mb-3">
        <Button variant="primary" onClick={() => navigate('/institutions/add')}>
          Dodaj instituciju
        </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>OIB</th>
            <th>Naziv</th>
            <th>Adresa</th>
            <th>Grad</th>
            <th>Država</th>
            <th>Tip</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution) => (
            <tr
              key={institution._id}
              onClick={() => handleInstitutionClick(institution._id)}
              style={{ cursor: 'pointer' }}
            >
              <td>{institution.OIB}</td>
              <td>{institution.name}</td>
              <td>{institution.address}</td>
              <td>{institution.city}</td>
              <td>{institution.country}</td>
              <td>{institution.type}</td>
              <td>
                <Button
                  variant="success"
                  className="me-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/institutions/edit/${institution._id}`);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(institution);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ConfirmationModal
        show={showDeleteModal}
        handleClose={handleCloseModal}
        handleConfirm={confirmDelete}
        title="Potvrda brisanja"
        body={`Jeste li sigurni da želite obrisati instituciju: ${institutionToDelete?.name}?`}
        confirmLabel="Obriši"
        closeLabel="Zatvori"
        error={error}
      />
    </div>
  );
}

export default InstitutionList;
