import { useGetCurrentUser } from '../hooks/useGetCurrentUser';
import { useParams } from 'react-router-dom';
import { useFetcher } from '../hooks/useFetcher';
import { useEffect, useState } from 'react';
import { GeneralInfo } from '../erasmusCompetitionApplication/generalInfo/GeneralInfo';
import FileUploadsForEdit from '../erasmusCompetitionApplication/fileUploads/FIleUploadsForEdit';

import { BranchChooserForEdit } from '../erasmusCompetitionApplication/branchChooser/BranchChooserForEdit';
import { ApplicationSummaryForEdit } from '../erasmusCompetitionApplication/applicationSummary/ApplicationSummaryForEdit';

function mapRole(role) {
  if (role.includes('prof')) {
    return 'profesor';
  } else {
    return role;
  }
}

export function EditApplication() {
  const { applicationId, competitionId } = useParams();

  const { user, loading } = useGetCurrentUser();
  const { response: competitionData } = useFetcher({ endpoint: `/api/competitions/${competitionId}` });
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [userChoice, setUserChoice] = useState({ firstBranch: null, secondBranch: null, thirdBranch: null });
  const [files, setFiles] = useState({
    schoolGrades: null,
    cv: null,
    motivationalLetter: null,
  });

  const { response: branches } = useFetcher({
    endpoint: user?.branch ? `/api/branches/grouped/${user.branch}` : '/api/branches/grouped',
  });

  const filteredBranches = branches
    ?.map((group) => ({
      ...group,
      branches: group.branches.filter(
        (branch) =>
          branch._id !== userChoice.firstBranch?._id &&
          branch._id !== userChoice.secondBranch?._id &&
          branch._id !== userChoice.thirdBranch?._id,
      ),
    }))
    .filter((group) => group.branches.length > 0);

  const handleFilesChange = (updatedFiles) => {
    setFiles(updatedFiles);
  };

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

  const { response: applicationResponse, loading: appLoading } = useFetcher({
    endpoint: `/api/${competitionId}/applications/edit/${applicationId}`,
  });

  const [filenames, setFilenames] = useState([]);
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    if (applicationResponse) {
      if (applicationResponse.files) {
        const fileNamesArray = applicationResponse.files.map((file) => ({
          filename: file.filename,
          mimetype: file.mimetype,
          size: file.size,
          uploadDate: file.uploadDate,
        }));

        setFilenames(fileNamesArray);
      }

      if (applicationResponse.choices) {
        setChoices(applicationResponse.choices);
      }
    }
  }, [applicationResponse]);
  if (loading || appLoading) {
    return <div>Loading...</div>;
  }

  const RenderStep = () => {
    switch (currentStep) {
      case 1:
        return <GeneralInfo user={user} onSubmit={() => setCurrentStep(2)} />;
      case 2:
        return (
          <FileUploadsForEdit
            onSubmit={() => setCurrentStep(3)}
            files={filenames}
            onFileUpload={setFiles}
            userRole={user}
            existingFiles={filenames}
            onFilesChange={handleFilesChange}
            onFileUpload2={setFiles}
            fileDetails={applicationResponse.files}

          />
        );
      case 3:
        return (
          <BranchChooserForEdit
            onSubmit={() => setCurrentStep(4)}
            choice={userChoice.firstBranch}
            choices={choices[0]}
            onUserChoice={(branch) => setUserChoice({ ...userChoice, firstBranch: branch })}
            title="Prvi izbor"
            branches={filteredBranches}
          />
        );
      case 4:
        return (
          <BranchChooserForEdit
            onSubmit={() => setCurrentStep(5)}
            choice={userChoice.secondBranch}
            choices={choices[1]}
            onUserChoice={(branch) => setUserChoice({ ...userChoice, secondBranch: branch })}
            title="Drugi izbor"
            branches={filteredBranches}
          />
        );
      case 5:
        return (
          <BranchChooserForEdit
            onSubmit={() => setCurrentStep(6)}
            choice={userChoice.thirdBranch}
            onUserChoice={(branch) => setUserChoice({ ...userChoice, thirdBranch: branch })}
            title="Treci izbor"
            branches={filteredBranches}
          />
        );
      case 6:
        return (
          <ApplicationSummaryForEdit
            user={user}
            competitionData={competitionData}
            userChoice={userChoice}
            files={files}
            branches={branches}
            oldFiles={filenames}
            applicationId={applicationId}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="d-flex align-items-center flex-column mt-3">
      <h1>
        Prijava na natjecaj - <b>{competitionData?.title}</b>
      </h1>
      {error && <p className="text-danger">{error}</p>}
      <RenderStep />
    </div>
  );
}

export default EditApplication;
