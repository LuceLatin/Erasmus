import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './InstitutionDetails.css';
import {jwtDecode} from 'jwt-decode'; 
import BranchList from '../../Branches/BranchList/BranchList';

const InstitutionDetails = () => {
    const { id } = useParams();
    const [institution, setInstitution] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = document.cookie.split('access-token=')[1]?.split(';')[0];
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } 
            catch (err) {
                setError('Invalid token');
            }
        } 
        else {
            setError('No token found');
        }
    }, []);

    useEffect(() => {
        const fetchInstitutionDetails = async () => {
            try {
                const response = await fetch(`/api/institutions/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                    return;
                }

                setInstitution(data);
            } 
            catch (err) {
                setError('Failed to fetch institution details');
            }
        };

        fetchInstitutionDetails();
    }, [id]);

    if (error) {
        return <div className="alert-error">Error: {error}</div>;
    }

    if (!institution) {
        return <div>Loading...</div>;
    }

    return (
        <div className="institution-details-container">
            <h1 className="institution-title">{institution.name}</h1>
            <div className="institution-description">
                <p><strong>OIB:</strong> {institution.OIB}</p>
                <p><strong>Adresa:</strong> {institution.address}</p>
                <p><strong>Grad:</strong> {institution.city}</p>
                <p><strong>Država:</strong> {institution.country}</p>
                <p><strong>Tip institucije:</strong> {institution.type}</p>
            </div>
            <BranchList institutionId={id} />
        </div>

    );
};

export default InstitutionDetails;
