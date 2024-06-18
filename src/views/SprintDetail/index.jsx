import Header from "../../components/Header";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import sprintService from "../../services/sprintService";
import SubtaskDetailModal from "./SubtaskDetailModal";
import CreateButton from "../../components/Buttons/CreateButton";
import CBreadcrumbs from "../../components/CBreadcrumbs";
import RingLoaderWithWrapper from "../../components/Loaders/RingLoader/RingLoaderWithWrapper";
import SubtasksList from "./SubtasksList";
import StepButton from "../../components/StepButton";
import SprintSelect from "../../components/Selects/SprintSelect";
import SprintSubtasksListType from "../../components/SprintSubtasksListType";
import { sortByOrderNumber } from "../../utils/sortByOrderNumber";
import { Typography } from "@mui/material";
import SprintCopyButton from "../../components/SprintCopyButton";
import SprintHeader from "./SprintHeader";
import "./style.scss";

const SprintDetail = () => {
  const { projectId, sprintId } = useParams();
  const navigate = useNavigate();
  const [sprintStepsList, setSprintStepsList] = useState([]);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [listType, setListType] = useState("list");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [sprintDetail, setSprintDetail] = useState(null);
  const currentStep = useMemo(() => {
    const length = sprintStepsList?.length;
    if (!length) return null;
    return sprintStepsList[length - 1];
  }, [sprintStepsList]);
  const selectedStep = useMemo(() => {
    return sprintStepsList.find((el) => el.id === selectedStepId);
  }, [sprintStepsList, selectedStepId]);

  const closeModal = () => setOpenModal(!openModal);

  const getSprintDetails = () => {
    setLoading(true);
    sprintService
      .getById(sprintId)
      .then((res) => {
        setSprintStepsList(
          res.steps?.map((step) => ({
            ...step,
            sprint_subtask_items:
              step.sprint_subtask_items?.sort(sortByOrderNumber),
          })) ?? []
        );

        const lastStep = res.steps?.[res.steps?.length - 1];

        setSelectedStepId(lastStep.id);

        setSprintDetail(res);
      })
      .finally(() => setLoading(false));
  };

  const updateSprintStep = (data, type) => {
    getSprintDetails();
  };

  const addSubtask = (subtask) => {
    setSprintStepsList((prev) =>
      prev.map((step) => {
        if (step.id !== currentStep.id) return step;
        return {
          ...step,
          sprint_subtask_items: step.sprint_subtask_items
            ? [...step.sprint_subtask_items, subtask]
            : [subtask],
        };
      })
    );
  };

  const removeSubtask = (subtaskId) => {
    setSprintStepsList((prev) =>
      prev.map((step) => {
        if (step.id !== currentStep.id) return step;
        return {
          ...step,
          sprint_subtask_items: step.sprint_subtask_items.filter(
            (subtask) => subtask.id !== subtaskId
          ),
        };
      })
    );
  };

  const updateSubtask = (data, stepId) => {
    setSprintStepsList((prev) =>
      prev.map((step) => {
        if (step.id !== stepId) return step;
        return {
          ...step,
          sprint_subtask_items: step.sprint_subtask_items?.map((subtask) => {
            if (subtask.subtask_id !== data.subtask_id) return subtask;
            return {
              ...subtask,
              ...data,
            };
          }),
        };
      })
    );
  };

  const setSubtasksList = (list, stepId) => {
    setSprintStepsList((prev) =>
      prev.map((step) => {
        if (step.id !== stepId) return step;
        return {
          ...step,
          sprint_subtask_items: list,
        };
      })
    );
  };

  const disableEdit = useMemo(() => {
    return currentStep?.confirmed || currentStep?.id !== selectedStep?.id;
  }, [currentStep, selectedStep]);

  const disableEditStatus = useMemo(() => {
    return currentStep?.id !== selectedStepId;
  }, [currentStep, selectedStepId]);

  const changeSprint = (val) => {
    navigate(`/projects/${projectId}/sprint/${val}`);
  };

  useEffect(() => {
    if (!sprintId) return null;
    getSprintDetails();
  }, [sprintId]);

  const breadCrumbItems = [
    {
      label: "Backlog",
      link: `/projects/${projectId}/backlog`,
    },
    {
      label: `Sprint week #${sprintDetail?.order_number ?? ""}`,
      link: "/",
    },
  ];

  return (
    <div className="SprintDetail">
      {openModal && (
        <SubtaskDetailModal
          step={currentStep}
          sprintId={sprintId}
          addSubtask={addSubtask}
          closeModal={closeModal}
          getSprintDetails={getSprintDetails}
        />
      )}
      <Header
        extra={
          <>
            <div>
              <SprintSelect value={sprintId} onChange={changeSprint} />
            </div>
            {!disableEdit && (
              <CreateButton
                color="warning"
                title="Add subtask"
                onClick={() => setOpenModal(!openModal)}
              ></CreateButton>
            )}
            <StepButton
              currentStep={currentStep}
              sprintId={sprintId}
              updateSprintStep={updateSprintStep}
            />
          </>
        }
      >
        <CBreadcrumbs items={breadCrumbItems} type="link" withDefautlIcon />
      </Header>

      <div className="main-area">
        <div className="sprint_header">
          <SprintHeader
            sprintDetail={sprintDetail}
            subtaskList={selectedStep}
            projectId={projectId}
          />
        </div>
        <div className="card">
          {loading ? (
            <RingLoaderWithWrapper />
          ) : (
            <>
              {/* <SprintStepper
                selectedStep={selectedStep}
                currentStep={currentStep}
                sprintStepsList={sprintStepsList}
                setSelectedStepId={setSelectedStepId}
              /> */}
              <div className="btns-row">
                <Typography>{sprintDetail?.project_name}</Typography>

                <div className="right-side">
                  <SprintCopyButton
                    subtaskList={selectedStep?.sprint_subtask_items}
                  />
                  <SprintSubtasksListType
                    listType={listType}
                    setListType={setListType}
                  />
                </div>
              </div>
              <SubtasksList
                removeSubtask={removeSubtask}
                step={selectedStep}
                subtaskList={selectedStep?.sprint_subtask_items}
                disableEdit={disableEdit}
                updateSubtask={updateSubtask}
                disableEditStatus={disableEditStatus}
                listType={listType}
                setSubtasksList={setSubtasksList}
                sprint={sprintDetail}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintDetail;
