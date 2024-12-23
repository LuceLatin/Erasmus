import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export function useGetCurrentUser() {
    const [cookies] = useCookies(["access-token"]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const accessToken = cookies["access-token"];

    useEffect(() => {
        if (!accessToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch("/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user");
                }

                const userData = await response.json();
                setUser(userData);
            } catch (err) {
                console.error("Error fetching current user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [accessToken]);

    return { user, loading };
}