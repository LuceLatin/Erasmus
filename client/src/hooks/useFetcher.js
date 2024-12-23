import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

export function useFetcher({ endpoint, method = "GET", data = null }) {
    const [cookies] = useCookies(["access-token"]);
    const accessToken = cookies["access-token"];
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const options = {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: data ? JSON.stringify(data) : null
                };

                const res = await fetch(endpoint, options);
                if (!res.ok) {
                    setLoading(false);
                    throw new Error(`Error fetching data: ${res.statusText}`);
                }
                const result = await res.json();
                setResponse(result);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, method, data, accessToken]);

    return { response, error, loading };
}