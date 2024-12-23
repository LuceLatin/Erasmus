import {useGetCurrentUser} from "../hooks/useGetCurrentUser";

export function UserProfile({ user }) {
    if (!user) {
        return null;
    }
    return (
        <div>
            <h1>User Profile</h1>
            <ul style={{listStyle: 'none', padding: 0}}>
                <li><strong>Username:</strong> {user.username}</li>
                <li><strong>First Name:</strong> {user.firstName}</li>
                <li><strong>Last Name:</strong> {user.lastName}</li>
                <li><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</li>
                <li><strong>OIB:</strong> {user.OIB}</li>
                <li><strong>Address:</strong> {user.address}</li>
                <li><strong>City:</strong> {user.city}</li>
                <li><strong>Country:</strong> {user.country}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Role:</strong> {user.role}</li>
                <li><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</li>
                <li><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</li>
            </ul>
        </div>
    );

}