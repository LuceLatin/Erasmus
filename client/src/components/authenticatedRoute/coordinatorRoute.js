import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function CoordinatorRoute({ user }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (user && user.role !== 'koordinator')) {
            navigate(-1);
        }
    }, [user, navigate]);

    return user?.role === 'koordinator' ? <Outlet /> : null;
}