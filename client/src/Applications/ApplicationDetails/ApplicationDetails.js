import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './ApplicationDetails.css';

const ApplicationDetails = () => {
  const [application, setApplication] = useState(null);
  const [choices, setChoices] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const { competitionId, id: applicationId } = useParams();
  const [statusOptions] = useState(['pending', 'approved', 'rejected']);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [statusOptionsForChoices] = useState(['pending', 'approved', 'rejected']);

  useEffect(() => {
    const token = document.cookie.split('access-token=')[1]?.split(';')[0];
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (err) {
        setError('Invalid token');
      }
    } else {
      setError('No token found');
    }
  }, []);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await fetch(`/api/${competitionId}/applications/${applicationId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        setApplication(data);
        setFiles(data.files || []);
        setSelectedStatus(data.status);
        setChoices(data.choices);
      } catch (err) {
        setError('Failed to fetch application details');
      }
    };

    fetchApplicationDetails();
  }, [competitionId, applicationId]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/${applicationId}/update-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      setSelectedStatus(newStatus);
      alert('Status successfully updated');
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update status');
    }
  };

  const handleStatusChange = async (newStatus, choiceId) => {
    try {
      const response = await fetch(`/api/${choiceId}/update-choices-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      setChoices((prevChoices) =>
        prevChoices.map((choice) => (choice._id === choiceId ? { ...choice, status: newStatus } : choice)),
      );

      alert('Status successfully updated');
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update status');
    }
  };

  const onFileDownload = async (fileId) => {
    try {
      const response = await fetch(`/api/download/${fileId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error downloading file');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;

      a.download = files[0].filename || 'downloadedFile';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file.');
    }
  };

  if (error) {
    return <div className="alert-error">Error: {error}</div>;
  }

  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div className="application-details-container mt-3">
      <h1 className="application-title">Detalji o prijavi</h1>
      <div className="application-description">
        {userRole !== 'koordinator' && (
          <p>
            <strong>Status:</strong> {selectedStatus}
          </p>
        )}
        <div>
          {userRole === 'koordinator' && (
            <p>
              <label htmlFor="status-select">
                <strong>Status: </strong>
              </label>
              <select id="status-select" value={selectedStatus} onChange={(e) => updateStatus(e.target.value)}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </p>
          )}
        </div>
        <p>
          <strong>Datum:</strong> {new Date(application.applicationDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Korisničko ime:</strong> {application.user?.username} ({application.user?.email})
        </p>
        <p>
          <strong>Korisnik:</strong> {`${application.user.firstName} ${application.user.lastName}`}
        </p>
        <p>
          <strong>Natječaj:</strong> {application.erasmusCompetition.title}
        </p>
        <p>
          <strong>Dokumenti:</strong>
        </p>
        <ul>
          <ul className="file-list">
            {files.length > 0 ? (
              files.map((file, index) => (
                <li key={file._id || index}>
                  <button onClick={() => onFileDownload(file._id, file.filename)}>{file.filename}</button>
                </li>
              ))
            ) : (
              <p>No files available.</p>
            )}
          </ul>
        </ul>
        <p>
          <strong>Izbori:</strong>
        </p>
        {choices !== null && choices.length > 0 ? (
          <ul>
            {choices.map((choice, index) => (
              <li key={index}>
                <strong>{choice.choice.charAt(0).toUpperCase() + choice.choice.slice(1)} Choice:</strong>{' '}
                {choice.branch.name}
                <br />
                <em>Address:</em> {choice.branch.address}, {choice.branch.city}, {choice.branch.country}
                <br />
                <em>Status:</em>
                <select value={choice.status} onChange={(e) => handleStatusChange(e.target.value, choice._id)}>
                  {statusOptionsForChoices.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p>No choices available.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;
