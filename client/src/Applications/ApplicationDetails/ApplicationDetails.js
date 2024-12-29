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
                console.log("data", data.files)
    
                if (data.error) {
                    setError(data.error);
                    return;
                }

                const processedFiles = data.files.map(file => ({
                    _id: file._id,  
                    filename: file.filename,  
                }));
    
                console.log("Processed files:", processedFiles);
    
                setApplication(data);
                setFiles(processedFiles);
            } catch (err) {
                setError('Failed to fetch application details');
            }
        };
    
        fetchApplicationDetails();
    }, [competitionId, applicationId]);

    useEffect(() => {
        if (application) {
            const fetchChoices = async () => {
                try {
                    const response = await fetch(`/api/${applicationId}/choices`, {
                        method: 'GET',
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (data.error) {
                        setError(data.error);
                        return;
                    }

                    setChoices(data);
                } catch (err) {
                    setError('Failed to fetch choices');
                }
            };

            fetchChoices();
        }
    }, [application, competitionId, applicationId]);

    const onFileDownload = async (fileId) => {
        try {
          const response = await fetch(`/api/download/${fileId}`, {
            method: 'GET',
            credentials: 'include'
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

    console.log("Podaci o datotekama:", files);


    return (
        <div className="application-details-container mt-3">
            <h1 className="application-title">Details for Application</h1>
            <div className="application-description">
                <p><strong>Status:</strong> {application.status}</p>
                <p><strong>Application Date:</strong> {new Date(application.applicationDate).toLocaleDateString()}</p>
                <p><strong>User:</strong> {application.user?.username} ({application.user?.email})</p>
                <p><strong>Username:</strong> {`${application.user.firstName} ${application.user.lastName}`}</p>
                <p><strong>Erasmus Competition:</strong> {application.erasmusCompetition.title}</p>

                <p><strong>Files:</strong></p>
                <ul>
                    <ul className="file-list">
                    {files.length > 0 ? (
                        files.map((file, index) => (
                        <li key={file._id || index}> 
                            <button onClick={() => onFileDownload(file._id, file.filename)}>
                            {file.filename}
                            </button>
                        </li>
                        ))
                    ) : (
                        <p>No files available.</p>
                    )}
                    </ul>
                </ul>

                <p><strong>Choices:</strong></p>
                {choices.length > 0 ? (
                    <ul>
                        {choices.map((choice, index) => (
                            <li key={index}>{choice.branch.name}</li>
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
