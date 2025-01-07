import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function ApplicationSummaryForEdit({ user, userChoice, files, competitionData, branches, oldFiles, applicationId }) {
  const [cookies] = useCookies(['access-token']);
  const accessToken = cookies['access-token'];

  const [loading, setLoading] = useState(false);
  const [applicationResponse, setApplicationResponse] = useState(null);
  const [applicationError, setApplicationError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        user,
        competitionData,
        branches,
        userChoice,
        applicationId,
        files : {
          schoolGrades: files?.schoolGrades?.name ? files.schoolGrades.name : null,
          cv: files?.cv?.name ? files.cv.name : null,
          motivationalLetter: files?.motivationalLetter?.name ? files.motivationalLetter.name : null,
        }, 
      };

      const response = await fetch(`/api/erasmus-application/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the application');
      }

      const result = await response.json();
      setApplicationResponse(result);
      navigate(`/erasmus-competitions/${competitionData._id}`);
    } catch (error) {
      setApplicationError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Vaša prijava</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">Informacije o korisniku</div>
            <div className="card-body">
              <p>
                <strong>Ime:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>Datum rodjenja:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <strong>OIB:</strong> {user.OIB}
              </p>
              <p>
                <strong>Adresa:</strong> {user.address}, {user.city}, {user.country}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Uloga:</strong> {user.role}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-secondary text-white">Detalji o natjecaju</div>
            <div className="card-body">
              <p>
                <strong>Title:</strong> {competitionData.title}
              </p>
              <p>
                <strong>Description:</strong> {competitionData.description}
              </p>
              <p>
                <strong>Prijave dostupne do:</strong> {new Date(competitionData.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Za ulogu:</strong> {competitionData.role}
              </p>
              <p>
                <strong>Vrsta ustanove:</strong> {competitionData.institutionType}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header bg-warning text-dark">Učitane datoteke</div>
        <div className="card-body">

        {user.role === 'student' && (

          <p>
            <strong>School Grades:</strong>{' '}
            {files?.schoolGrades?.name
              ? files.schoolGrades.name
              : oldFiles[2]?.filename
                ? oldFiles[2].filename
                : 'Nije učitano'}
          </p>
        )}
          <p>
            <strong>CV:</strong>{' '}
            {files?.cv?.name ? files.cv.name : oldFiles[0]?.filename ? oldFiles[0].filename : 'Nije učitano'}
          </p>
          <p>
            <strong>Motivational Letter:</strong>{' '}
            {files?.motivationalLetter?.name
              ? files.motivationalLetter.name
              : oldFiles[1]?.filename
                ? oldFiles[1].filename
                : 'Nije učitano'}
          </p>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-header bg-info text-white">Korisnički odabiri</div>
        <div className="card-body">
          {Object.entries(userChoice).map(
            ([key, branch], index) =>
              branch && (
                <div key={key} className="card mb-3">
                  <div className="card-header bg-primary text-white">
                    {index === 0 ? 'Prvi odabir' : index === 1 ? 'Drugi odabir' : 'Treći odabir'}
                  </div>
                  <div className="card-body">
                    {branches.some((b) => b.branches.some((subBranch) => subBranch._id === branch._id)) &&
                      branches.map(
                        (b) =>
                          b.branches.some((subBranch) => subBranch._id === branch._id) && (
                            <div key={b.institution._id}>
                              <p>
                                <strong>Tvrtka:</strong> {b.institution.name}
                              </p>
                            </div>
                          ),
                      )}
                    <p>
                      <strong>Odjel:</strong> {branch.name}
                    </p>
                    <p>
                      <strong>Adresa:</strong> {branch.address}, {branch.city}, {branch.country}
                    </p>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>

      <div className="text-end">
        <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Završavanje prijave...' : 'Završi prijavu'}
        </button>
      </div>

      {applicationResponse && <div className="alert alert-success mt-3">Prijava uspješno poslata!</div>}
      {applicationError && <div className="alert alert-danger mt-3">{applicationError}</div>}
    </div>
  );
}
