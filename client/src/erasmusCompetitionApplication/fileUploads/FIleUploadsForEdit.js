import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import './FileUploadsForEdit.css';

export default function FileUploadsForEdit({
  userRole,
  files,
  onFileUpload,
  onFilesChange,
  onSubmit,
  onFileUpload2,
  fileDetails,
}) {
  const [selectedFiles, setSelectedFiles] = useState({
    cv: null,
    motivationalLetter: null,
    schoolGrades: null,
  });

  const onFileDownload = async (fileId) => {
    try {
      const response = await fetch(`/api/edit-download/${fileId}`, { method: 'GET' });

      if (!response.ok) throw new Error('Error downloading file');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = files[0]?.filename || 'downloadedFile';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file.');
    }
  };

  const onFileUploadHandler = async (file, type) => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error uploading file');

      alert('File uploaded successfully');
      onFileUpload();
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file.');
    }
  };

  const onFileSelect = (e, type) => {
    const file = e.target.files[0];
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [type]: file,
    }));
  };

  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload2((prevFiles) => ({
        ...prevFiles,
        [fileType]: e.target.files[0],
      }));
    }
  };

  return (
    <div>
      <br />
      <h2>File Uploads</h2>
      <br />
      {/* CV Section */}
      <div className="file-section">
        <h2>CV</h2>
      </div>
      {files?.[0] ? (
        <div>
          {files[0] && (
            <>
              <p>The currently added CV is: {files[0].filename}</p>
              <button onClick={() => onFileDownload(fileDetails[0].id)}>Download {fileDetails[0].filename}</button>
              <br />
            </>
          )}
          <p>If you want to upload a new CV:</p>
          <input
            type="file"
            onChange={(e) => {
              handleFileChange(e, 'cv');
              onFileSelect(e, 'cv');
            }}
          />

          {selectedFiles.cv && (
            <div className="selected-file">
              <p>Selected CV: {selectedFiles.cv.name}</p>
              <button onClick={() => onFileUploadHandler(selectedFiles.cv, 'cv')}>Upload CV</button>
            </div>
          )}
        </div>
      ) : (
        <p className="no-files">No CV uploaded yet.</p>
      )}
      {/* Motivational Letter Section */}
      <div className="file-section">
        <h2>Motivational Letter</h2>
        {files?.[1] ? (
          <div>
            {files[1] && (
              <>
                <p>The currently added motivational letter is: {files[1].filename}</p>

                <button onClick={() => onFileDownload(fileDetails[1].id)}>Download {fileDetails[1].filename}</button>
                <br />
              </>
            )}

            <p>If you want to upload a new motivational letter:</p>

            <p>Motivational Letter: {files[1].filename}</p>
            <input
              type="file"
              onChange={(e) => {
                handleFileChange(e, 'motivationalLetter');
                onFileSelect(e, 'motivationalLetter');
              }}
            />

            {selectedFiles.motivationalLetter && (
              <div className="selected-file">
                <p>Selected Motivational Letter: {selectedFiles.motivationalLetter.name}</p>
                <button onClick={() => onFileUploadHandler(selectedFiles.motivationalLetter, 'motivationalLetter')}>
                  Upload Motivational Letter
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="no-files">No Motivational Letter uploaded yet.</p>
        )}
      </div>
      {userRole.role === 'student' && (
        <>
          {/* School Grades Section */}
          <div className="file-section">
            <h2>School Grades</h2>
            {files?.schoolGrades ? (
              <div>
                <p>School Grades: {files.schoolGrades.filename}</p>
                <input
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e, 'schoolGrades');
                    onFileSelect(e, 'schoolGrades');
                  }}
                />
                {files[2] && (
                  <>
                    <p>The currently added school grades is: {files[2].filename}</p>
                    <button onClick={() => onFileDownload(fileDetails[2].id)}>
                      Download {fileDetails[2].filename}
                    </button>
                    <br />
                  </>
                )}
                <p>If you want to upload a new school grades:</p>

                {selectedFiles.schoolGrades && (
                  <div className="selected-file">
                    <p>Selected School Grades: {selectedFiles.schoolGrades.name}</p>
                    <button onClick={() => onFileUploadHandler(selectedFiles.schoolGrades, 'schoolGrades')}>
                      Upload School Grades
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="no-files">No School Grades uploaded yet.</p>
            )}
            <button onClick={() => onFileUploadHandler(selectedFiles.schoolGrades, 'schoolGrades')}>
              Upload school grades
            </button>
          </div>
        </>
      )}
      <Button
        variant="primary"
        type="button"
        onClick={() => {
          onSubmit();
        }}
      >
        Dalje
      </Button>
      <div></div>
    </div>
  );
}
