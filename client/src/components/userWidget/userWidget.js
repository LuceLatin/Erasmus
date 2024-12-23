export function UserWidget ({ user }) {
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', maxWidth: '400px', margin: '20px auto' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>{user.firstName} {user.lastName} - {user.role}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><strong>Username:</strong> {user.username}</li>
                <li><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</li>
                <li><strong>Email:</strong> {user.email}</li>
            </ul>
        </div>
    );
};