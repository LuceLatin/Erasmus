import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useFetcher} from "../../hooks/useFetcher";

export function ApplicationSummary({ user, userChoice, files, competitionData, branches }) {
    const { fetchData, response: applicationResponse, error: applicationError, loading } = useFetcher({
        endpoint: "/api/erasmus-application",
        method: "POST",
        data: { userChoice, files, user, competitionData },
        manual: true
    });

    const handleSubmit = () => {
        fetchData();
    };
    console.log(applicationResponse, applicationError);
    return (
        <div className="container my-4">
            <h2 className="mb-4">Vaša prijava</h2>

            {/* First Row: User Info and Competition Details */}
            <div className="row mb-3">
                {/* User Information */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-primary text-white">Informacije o korisniku</div>
                        <div className="card-body">
                            <p><strong>Ime:</strong> {user.firstName} {user.lastName}</p>
                            <p><strong>Datum rodjenja:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
                            <p><strong>OIB:</strong> {user.OIB}</p>
                            <p><strong>Adresa:</strong> {user.address}, {user.city}, {user.country}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Uloga:</strong> {user.role}</p>
                        </div>
                    </div>
                </div>

                {/* Competition Details */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-secondary text-white">Detalji o natjecaju</div>
                        <div className="card-body">
                            <p><strong>Title:</strong> {competitionData.title}</p>
                            <p><strong>Description:</strong> {competitionData.description}</p>
                            <p><strong>Prijave dostupne do:</strong> {new Date(competitionData.endDate).toLocaleDateString()}</p>
                            <p><strong>Za ulogu:</strong> {competitionData.role}</p>
                            <p><strong>Vrsta ustanove:</strong> {competitionData.institutionType}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Row: Uploaded Files */}
            <div className="card mb-3">
                <div className="card-header bg-warning text-dark">Učitane datoteke</div>
                <div className="card-body">
                    <p><strong>School Grades:</strong> {files?.schoolGrades?.name ? files.schoolGrades.name : "Nije učitano"}</p>
                    <p><strong>CV:</strong> {files?.cv?.name ? files.cv.name : "Nije učitano"}</p>
                    <p><strong>Motivational Letter:</strong> {files?.motivationalLetter?.name ? files.motivationalLetter.name : "Nije učitano"}</p>
                </div>
            </div>

            {/* Third Row: User Choices */}
            <div className="card mb-3">
                <div className="card-header bg-info text-white">Korisnički odabiri</div>
                <div className="card-body">
                    {Object.entries(userChoice).map(([key, branch], index) => (
                        branch && (
                            <div key={key} className="mb-3">
                                <h5 className="text-muted">
                                    {index === 0 ? "Prvi odabir" : index === 1 ? "Drugi odabir" : "Treci odabir"}
                                </h5>
                                {branches.some(b => b.branches.some(subBranch => subBranch._id === branch._id)) && (
                                    <div>
                                        {branches.map(b =>
                                                b.branches.some(subBranch => subBranch._id === branch._id) && (
                                                    <div key={b.institution._id}>
                                                        <p><strong>Tvrtka:</strong> {b.institution.name}</p>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                )}
                                <p><strong>Odjel:</strong> {branch.name}</p>
                                <p><strong>Adresa:</strong> {branch.address}, {branch.city}, {branch.country}</p>
                            </div>
                        )
                    ))}

                </div>
            </div>

            <div className="text-end">
                <button className="btn btn-success" onSubmit={handleSubmit}>Završi prijavu</button>
            </div>
        </div>
    );
}
