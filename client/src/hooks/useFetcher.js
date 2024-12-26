import { useState, useEffect, useCallback } from "react";
import { useCookies } from "react-cookie";

export function useFetcher({ endpoint, method = "GET", data = null, manual = false }) {
    const [cookies] = useCookies(["access-token"]);
    const accessToken = cookies["access-token"];
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const options = {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: data ? JSON.stringify(data) : null,
            };

            const res = await fetch(endpoint, options);
            if (!res.ok) {
                throw new Error(`Error fetching data: ${res.statusText}`);
            }
            const result = await res.json();
            setResponse(result);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, method, data, accessToken]);

    useEffect(() => {
        if (!manual) {
            fetchData();
        }
    }, [fetchData, manual]);

    return { fetchData, response, error, loading };
}
