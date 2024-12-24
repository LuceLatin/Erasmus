import { useGetCurrentUser } from "../hooks/useGetCurrentUser";
import { useParams } from "react-router-dom";
import { useFetcher } from "../hooks/useFetcher";
import { useEffect, useState } from "react";
import { GeneralInfo } from "./generalInfo/GeneralInfo";
import FileUploads from "./fileUploads/FileUploads";
import { BranchChooser } from "./branchChooser/BranchChooser";
import { ApplicationSummary } from "./applicationSummary/ApplicationSummary";

function mapRole(role) {
    if (role.includes("prof")) {
        return "profesor";
    } else {
        return role;
    }
}

export function ErasmusCompetitionApplication() {
    const { id } = useParams();
    const { user, loading } = useGetCurrentUser();
    const { response: competitionData } = useFetcher({ endpoint: `/api/competitions/${id}` });
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [userChoice, setUserChoice] = useState({ firstBranch: null, secondBranch: null, thirdBranch: null });
    const [files, setFiles] = useState({
        schoolGrades: null,
        cv: null,
        motivationalLetter: null,
    });

    const { response: branches } = useFetcher({
        endpoint: user?.branch ? `/api/branches/grouped/${user.branch}` : "/api/branches/grouped"
    });
    const filteredBranches = branches?.map(group => ({
        ...group,
        branches: group.branches.filter(branch =>
            branch._id !== userChoice.firstBranch?._id &&
            branch._id !== userChoice.secondBranch?._id &&
            branch._id !== userChoice.thirdBranch?._id
        )
    })).filter(group => group.branches.length > 0);

    useEffect(() => {
        if (user && competitionData) {
            if (mapRole(user?.role) !== mapRole(competitionData?.role)) {
                setError('Korisniku nije dozvoljena prijava na ovaj natjecaj');
            }
        }
    }, [competitionData, user]);

    useEffect(() => {
        if (currentStep === 3 && filteredBranches && filteredBranches.length === 0) {
            setCurrentStep(4);
        } else if (currentStep === 4 && filteredBranches && filteredBranches.length === 0) {
            setCurrentStep(5);
        } else if (currentStep === 5 && filteredBranches && filteredBranches.length === 0) {
            setCurrentStep(6);
        }
    }, [currentStep, filteredBranches]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const RenderStep = () => {
        switch (currentStep) {
            case 1:
                return <GeneralInfo user={user} onSubmit={() => setCurrentStep(2)} />;
            case 2:
                return <FileUploads
                    onSubmit={() => setCurrentStep(3)}
                    files={files}
                    onFileUpload={setFiles}
                />;
            case 3:
                return <BranchChooser onSubmit={() => setCurrentStep(4)}
                                      choice={userChoice.firstBranch}
                                      onUserChoice={(branch) => setUserChoice({ ...userChoice, firstBranch: branch })}
                                      title="Prvi izbor"
                                      branches={filteredBranches}
                />;
            case 4:
                return <BranchChooser onSubmit={() => setCurrentStep(5)}
                                      choice={userChoice.secondBranch}
                                      onUserChoice={(branch) => setUserChoice({ ...userChoice, secondBranch: branch })}
                                      title="Drugi izbor"
                                      branches={filteredBranches}
                />;
            case 5:
                return <BranchChooser onSubmit={() => setCurrentStep(6)}
                                      choice={userChoice.thirdBranch}
                                      onUserChoice={(branch) => setUserChoice({ ...userChoice, thirdBranch: branch })}
                                      title="Treci izbor"
                                      branches={filteredBranches}
                />;
            case 6:
                return <ApplicationSummary user={user} competitionData={competitionData} userChoice={userChoice} files={files} branches={branches}/>;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="d-flex align-items-center flex-column mt-3">
            <h1>Prijava na natjecaj - <b>{competitionData?.title}</b></h1>
            <RenderStep />
        </div>
    );
}