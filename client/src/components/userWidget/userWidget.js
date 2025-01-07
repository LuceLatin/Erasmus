import React, { useState } from 'react';

export function UserWidget({ user }) {
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleOpenPasswordModal = () => {
        setPasswordModalOpen(true);
    };

    const handleClosePasswordModal = () => {
        setPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            alert('Nove lozinke se ne podudaraju.');
            return;
        }

        try {
            const response = await fetch('/check-old-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    oldPassword,
                }),
            });

            if (response.ok) {
                const saveResponse = await fetch('/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: user.username,
                        newPassword,
                    }),
                });

                if (saveResponse.ok) {
                    alert('Lozinka uspješno promijenjena.');
                    handleClosePasswordModal();
                } else {
                    alert('Došlo je do pogreške prilikom spremanja nove lozinke.');
                }
            } else {
                alert('Stara lozinka nije ispravna.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Došlo je do pogreške.');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', maxWidth: '400px', margin: '20px auto' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>{user.firstName} {user.lastName} - {user.role}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><strong>Username:</strong> {user.username}</li>
                <li><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</li>
                <li><strong>Email:</strong> {user.email}</li>
            </ul>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={handleOpenPasswordModal} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                    Promijeni lozinku
                </button>
            </div>

            {isPasswordModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    zIndex: 1000,
                }}>
                    <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>Promjena lozinke</h3>
                    <form onSubmit={handleSavePassword}>
                        <div style={{ marginBottom: '12px' }}>
                            <label>Stara lozinka:</label>
                            <input
                                type="password"
                                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label>Nova lozinka:</label>
                            <input
                                type="password"
                                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label>Potvrdite novu lozinku:</label>
                            <input
                                type="password"
                                style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="button" onClick={handleClosePasswordModal} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Odustani
                            </button>
                            <button type="submit" style={{ backgroundColor: '#28a745', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Spremi promjene
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isPasswordModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999,
                }} onClick={handleClosePasswordModal}></div>
            )}
        </div>
    );
}