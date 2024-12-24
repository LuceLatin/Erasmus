import { useGetCurrentUser } from "../hooks/useGetCurrentUser";
import { useParams } from "react-router-dom";
import { useFetcher } from "../hooks/useFetcher";
import { useEffect, useState } from "react";
import { UserWidget } from "../components/userWidget/userWidget";
import {GeneralInfo} from "./generalInfo/GeneralInfo";
import FileUploads from "./fileUploads/FileUploads";
import {BranchChooser} from "./branchChooser/BranchChooser";

function mapRole(role){
    if (role.includes("prof")) {
        return "profesor";
    }
    else {
        return role
    }
}

export function ErasmusCompetitionApplication() {
    const { id } = useParams();
    const { user, loading } = useGetCurrentUser();
    const { response: competitionData } = useFetcher({ endpoint: `/api/competitions/${id}` });
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(3);
    const [userChoice, setUserChoice] = useState({ firstBranch: null, secondBranch: null, thirdBranch: null });
    const [files, setFiles] = useState({
        schoolGrades: null,
        cv: null,
        motivationalLetter: null,
    });
    useEffect(() => {
        console.log('userChoice:', userChoice);
    }, [userChoice]);

    useEffect(() => {
        if (user && competitionData) {
            if (mapRole(user?.role) !== mapRole(competitionData?.role)) {
                setError('Korisniku nije dozvoljena prijava na ovaj natjecaj');
            }
        }
    }, [competitionData, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const RenderStep = () => {
        switch (currentStep) {
            case 1:
                return <GeneralInfo user={user} onSubmit={()=> setCurrentStep(2)}/>;
            case 2:
                return <FileUploads
                    onSubmit={()=> setCurrentStep(3)}
                    files={files}
                    onFileUpload={setFiles}
                />;
            case 3:
                return <BranchChooser onSubmit={()=> setCurrentStep(4)}
                                      choice={userChoice.firstBranch}
                                      onUserChoice={(id)=> setUserChoice({...userChoice, firstBranch: id})}
                                      title="Prvi izbor"
                />;
            case 4:
                return <BranchChooser onSubmit={()=> setCurrentStep(5)}
                                      choice={userChoice.secondBranch}
                                      onUserChoice={(id)=> setUserChoice({...userChoice, secondBranch: id})}
                                      title="Drugi izbor"
                />;
            case 5:
                return <BranchChooser onSubmit={()=> setCurrentStep(6)}
                                      choice={userChoice.thirdBranch}
                                      onUserChoice={(id)=> setUserChoice({...userChoice, thirdBranch: id})}
                                      title="Treci izbor"
                />;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="d-flex align-items-center flex-column mt-3">
            <h1>Prijava na natjecaj - <b>{competitionData?.title}</b></h1>
            <RenderStep/>
            {/*{error ? <p>{error}</p> : <RenderStep />}*/}
        </div>
    );
}