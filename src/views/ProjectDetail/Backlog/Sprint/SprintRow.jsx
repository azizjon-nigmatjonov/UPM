import { CircularProgress, Collapse, MenuItem } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ButtonsPopover from "../../../../components/ButtonsPopover";
import CollapseIcon from "../../../../components/CollapseIcon";
import RowLinearLoader from "../../../../components/RowLinearLoader";
import sprintService from "../../../../services/sprintService";
import SprintCreateRow from "./SprintCreateRow";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sprintActions } from "../../../../redux/slices/sprint.slice";
import StepRow from "./StepRow";
import { getStepsInsideSprintAction } from "../../../../redux/thunks/sprint.thunk";

const SprintRow = ({ sprint, index }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const globalStepsList = useSelector((state) => state.project.sprintStepsList);
  const allSprintStepsList = useSelector((state) => state.sprint.stepsList);

  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [textFieldVisible, setTextFieldVisible] = useState(false);
  const [linearLoader, setLinearLoader] = useState(false);

  const switchChildBlockVisible = (e) => {
    e.stopPropagation();
    if (!childBlockVisible) return openChildBlock();
    setChildBlockVisible(false);
  };

  const sprintStepsList = useMemo(() => {
    return (
      allSprintStepsList.filter((task) => task.sprint_id === sprint.id) ?? []
    );
  }, [allSprintStepsList, sprint.id]);

  const openChildBlock = () => {
    if (sprintStepsList?.length) return setChildBlockVisible(true);
    getSubtasksList();
  };

  const computedStepsList = useMemo(() => {
    return sprintStepsList?.map((step) => ({
      ...step,
      title: globalStepsList?.find(
        (globalStep) => globalStep.id === step.project_sprint_step_id
      )?.title,
    }));
  }, [sprintStepsList, globalStepsList]);

  const currentStep = useMemo(() => {
    return computedStepsList?.[computedStepsList?.length - 1];
  }, [computedStepsList]);

  const navigateToSprintPage = () =>
    navigate(`/projects/${projectId}/sprint/${sprint.id}`);

  const getSubtasksList = () => {
    setLinearLoader(true);

    dispatch(getStepsInsideSprintAction(sprint.id))
      .unwrap()
      .then(() => setChildBlockVisible(true))
      .finally(() => setLinearLoader(false));
  };

  const deleteSprint = () => {
    setLoader(true);
    sprintService
      .delete(sprint.id)
      .then((res) => {
        dispatch(sprintActions.remove(sprint.id));
      })
      .catch(() => setLoader(false));
  };

  const updateSprint = ({ title, date }) => {
    const data = {
      ...sprint,
      from_date: date[0],
      to_date: date[1],
    };

    sprintService.update(data).then((res) => {
      dispatch(sprintActions.edit({ index, data }));
      setTextFieldVisible(false);
    });
  };

  useEffect(() => {
    if (sprintStepsList || !childBlockVisible) return null;
    getSubtasksList();
  }, [childBlockVisible]);

  return (
    <>
      <MenuItem
        className="SprintRow silver-bottom-border pointer"
        onClick={navigateToSprintPage}
      >
        <CollapseIcon
          isOpen={childBlockVisible}
          onClick={switchChildBlockVisible}
        />

        <div className="row-index">{index + 1}</div>
        {textFieldVisible ? (
          <SprintCreateRow
            initialTitle={sprint.title}
            initialDate={[sprint.from_date, sprint.to_date]}
            onSubmit={updateSprint}
            btnText="SAVE"
          />
        ) : (
          <>
            <div className="row-label">Sprint week #{sprint.order_number}</div>
            <div className="row-btns">
              {loader ? (
                <div style={{ padding: "12px" }}>
                  <CircularProgress disableShrink size={20} />
                </div>
              ) : (
                <>
                  {/* <ButtonsPopover
                    onDeleteClick={deleteSprint}
                    onEditClick={() => setTextFieldVisible(true)}
                  /> */}
                </>
              )}
            </div>
          </>
        )}

        <RowLinearLoader visible={linearLoader} />
      </MenuItem>

      <Collapse
        in={!linearLoader && childBlockVisible && !textFieldVisible}
        unmountOnExit
      >
        {computedStepsList?.map((step, index) => (
          <StepRow
            key={step.id}
            step={step}
            index={index}
            sprintId={sprint.id}
            currentStep={currentStep}
            step_title={step.title}
          />
        ))}
      </Collapse>
    </>
  );
};

export default SprintRow;
