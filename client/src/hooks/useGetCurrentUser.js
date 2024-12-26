import { useState, useEffect } from "react";
import { useFetcher } from "./useFetcher";

export function useGetCurrentUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { error, response, loading: loadingFetcher } = useFetcher({ endpoint: "/me" });

    useEffect(() => {
        if (response) {
            setUser(response);
            setLoading(false);
        } else if (error) {
            setLoading(false);
            setUser(null);
        } else {
            setLoading(loadingFetcher);
        }
    }, [response, error, loadingFetcher]);

    const isCoordinator = user?.role === "koordinator";
    const isStudent = user?.role === "student";
    const isProfesor = user?.role === "profesor";

    return { user, loading: loadingFetcher || loading, isCoordinator, isProfesor, isStudent };
}