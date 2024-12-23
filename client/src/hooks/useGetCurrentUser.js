import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {useFetcher} from "./useFetcher";

export function useGetCurrentUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { error, response, loading: loadingFetcher } = useFetcher({ endpoint: "/me" });

    console.log('useFetcher res:', response);
    useEffect(() => {
        if (response) {
            setUser(response);
            setLoading(false);
        }
        if (error) {
            setLoading(false);
            setUser(null);
        }
        setLoading(loadingFetcher);

    }, [response, user, error, loadingFetcher]);

    return { user, loading };
}