import { useFetcher } from "../../hooks/useFetcher";
import { useGetCurrentUser } from "../../hooks/useGetCurrentUser";
import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Table } from "react-bootstrap";

export function BranchChooser({ onSubmit, onUserChoice, choice, title, branches }) {
    const [selectedBranch, setSelectedBranch] = useState(choice);

    const handleRowClick = (branch) => {
        setSelectedBranch(selectedBranch === branch ? null : branch);
    };

    const handleSubmit = () => {
        onUserChoice(selectedBranch);
        onSubmit();
    };

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
                {branches && branches.map((group) => (
                    <React.Fragment key={group.institution._id}>
                        <tr key={group.institution._id} className="table-primary">
                            <td colSpan={4} className="text-center">
                                <strong>{group.institution.name}</strong>
                            </td>
                        </tr>

                        {group.branches.map((branch) => (
                            <tr
                                key={branch._id}
                                onClick={() => handleRowClick(branch)}
                                className={selectedBranch?._id === branch._id ? "table-success" : ""}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{branch.name}</td>
                                <td>{branch.city}, {branch.country}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
            </Table>
            <Button
                variant="primary"
                type="button"
                disabled={!selectedBranch}
                onClick={handleSubmit}
            >
                Dalje
            </Button>
        </>
    );
}