import { useFetcher } from "../../hooks/useFetcher";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from "react-bootstrap";

export function BranchChooser({ onSubmit, onUserChoice, choice, title }) {
    const { user } = useGetCurrentUser();
    const { response, error, loading } = useFetcher({
        endpoint: user?.branch ? `/api/branches/grouped/${user.branch}` : "/api/branches/grouped"
    });

    useEffect(() => {
        console.log('BranchChooser response:', response);
    }, [response]);

    const handleRowClick = (branchId) => {
        onUserChoice(choice === branchId ? null : branchId);
        console.log('Selected Branch ID:', branchId);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading branches</div>;
    }

    return (
        <>
            <h2>{title}</h2>
            <Table striped bordered hover responsive>
                <thead>
                <tr className="text-center">
                    <th>Institucija</th>
                    <th>Lokacija</th>
                </tr>
                </thead>
                <tbody>
                {response && response.map((group) => (
                    <>
                        <tr key={group.institution._id} className="table-primary">
                            <td colSpan={4} className="text-center">
                                <strong>{group.institution.name}</strong>
                            </td>
                        </tr>

                        {group.branches.map((branch) => (
                            <tr
                                key={branch._id}
                                onClick={() => handleRowClick(branch._id)}
                                className={choice === branch._id ? "table-success" : ""}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{branch.name}</td>
                                <td>{branch.city}, {branch.country}</td>
                            </tr>
                        ))}
                    </>
                ))}
                </tbody>
            </Table>
            <Button
                variant="primary"
                type="button"
                disabled={!choice}
                onClick={onSubmit}
            >
                Dalje
            </Button>
        </>
    );
}