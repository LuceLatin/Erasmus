import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";

export function useFetcher({ endpoint, method = "GET", data = null }) {
    const [cookies] = useCookies(["access-token"]);
    const accessToken = cookies["access-token"];
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                    throw new Error(`Error fetching data: ${res.statusText}`);
                }
                const result = await res.json();
                setResponse(result);
            } catch (err) {
                setError(err);
            }
        };

        fetchData();
    }, [endpoint, method, data, accessToken]);

    return { response, error };
}