import { LinearProgress } from "@mui/material";
import TTitle from "../TTitle";
import React, { useState } from "react";
import "./style.scss";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_CASE_STEP_TEMPLATE,
  UPDATE_CASE_STEP_TEMPLATE,
} from "../../../apollo/requests/case-step-template/case-step-template";
import CaseStepsFolder from "./CaseStepsTemplateFolders/CaseStepsTemplateFolders";
import TModal from "../TModal";
import CaseStepsTemplate from "./CaseStepsTemplate/CaseStepsTemplate";
import TShowBox from "../TShowBox";
import TestStepsIcon from "../../.././assets/icons/test-steps.svg";

const CaseTemplate = ({ loading, folders, refetch }) => {
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState({});
  const [selected, setSelected] = useState([]);
  const [selectedCase, setSelectedCase] = useState([]);
  const [updateCaseStepTemplate] = useMutation(UPDATE_CASE_STEP_TEMPLATE);
  const [deleteCaseStepTemplate] = useMutation(DELETE_CASE_STEP_TEMPLATE);

  const handleOnUpdate = (folder) => {
    setOpen(true);
    setFolder({
      ...folder,
      title: folder.name,
    });
  };
  const handleOnChange = (event) => {
    const title = event.target.value;
    setFolder((prev) => ({
      ...prev,
      title: title,
    }));
  };
  const handleOnSubmit = () => {
    setOpen(false);
    updateCaseStepTemplate({
      variables: {
        input: {
          id: folder.id,
          name: folder.title,
        },
      },
    });
  };
  const handleOnDelete = (_, id) => {
    deleteCaseStepTemplate({
      variables: {
        id: id,
      },
    }).finally(() => refetch());
  };
  const handleOnReset = (va) => {
    console.log("reset==>");
  };
  return (
    <div className="wrapper">
      <div className="left">
        <div className="folder-title">
          <TTitle title="Folders" canCreate={false} />
        </div>
        <div className="folder-wrapper">
          {loading && <LinearProgress />}
          {folders?.map((folder) => {
            return (
              <CaseStepsFolder
                depth={0}
                folder={folder}
                key={folder?.id}
                selected={selected}
                title={folder?.name}
                setSelected={setSelected}
                handleOnUpdate={handleOnUpdate}
                setSelectedCase={setSelectedCase}
                isCase={folder?.case_steps}
                deleteFolder={handleOnDelete}
              />
            );
          })}
        </div>
      </div>
      <div className="right">
        {selectedCase?.id && (
          <>
            <div className="folder-title">
              <TTitle title={selectedCase?.name} />
            </div>
            <TShowBox
              title="Test Steps"
              icon={<img src={TestStepsIcon} alt="img" />}
              content={<CaseStepsTemplate id={selectedCase.id} />}
              defaultOpen={true}
            />
          </>
        )}
      </div>
      <TModal
        open={open}
        setOpen={setOpen}
        title={`Edit folder`}
        values={folder}
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        handleReset={handleOnReset}
      />
    </div>
  );
};
export default CaseTemplate;
