import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

const FileUploads = ({ onSubmit, userRole, files, onFileUpload }) => {
    const handleFileChange = (e, fileType) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileUpload((prevFiles) => ({
                ...prevFiles,
                [fileType]: e.target.files[0],
            }));
        }
    };
    const allFilesUploaded = Object.values(files).filter(file => file !== null).length >= 2

    return (
        <Container className="my-3 d-flex justify-content-center align-items-center flex-column">
            <h2 className="mb-4">Učitavanje dokumenata</h2>
            <Form className="w-50">
                {userRole === "student" && (
                    <Form.Group controlId="schoolGrades" className="mb-3">
                        <Form.Label>Prijepis ocjena</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => handleFileChange(e, "schoolGrades")}
                        />
                    </Form.Group>
                )}
                {files.schoolGrades && userRole === "student" && (
                    <ul>
                        <li>Name: {files.schoolGrades.name}</li>
                        <li>Type: {files.schoolGrades.type}</li>
                        <li>Size: {files.schoolGrades.size} bytes</li>
                    </ul>
                )}

                <Form.Group controlId="cv" className="mb-3">
                    <Form.Label>CV</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => handleFileChange(e, "cv")}
                    />
                </Form.Group>
                {files.cv && (
                    <ul>
                        <li>Name: {files.cv.name}</li>
                        <li>Type: {files.cv.type}</li>
                        <li>Size: {files.cv.size} bytes</li>
                    </ul>
                )}

                <Form.Group controlId="motivationalLetter" className="mb-3">
                    <Form.Label>Motivacijsko pismo</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => handleFileChange(e, "motivationalLetter")}
                    />
                </Form.Group>
                {files.motivationalLetter && (
                    <ul>
                        <li>Name: {files.motivationalLetter.name}</li>
                        <li>Type: {files.motivationalLetter.type}</li>
                        <li>Size: {files.motivationalLetter.size} bytes</li>
                    </ul>
                )}

                <Button
                    variant="primary"
                    type="button"
                    disabled={!allFilesUploaded}
                    onClick={() => {
                        onSubmit();
                    }}
                >
                    Dalje
                </Button>
            </Form>
        </Container>
    );
};

export default FileUploads;