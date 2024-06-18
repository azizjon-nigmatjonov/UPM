import { Collapse } from "@mui/material";
import { useFormik } from "formik";
import { memo } from "react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CancelButton from "../../../../components/Buttons/CancelButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import CSelect from "../../../../components/CSelect";
import FSelect from "../../../../components/FormElements/FSelect";
import useBooleanState from "../../../../hooks/useBooleanState";
import { updateSubtaskAction } from "../../../../redux/thunks/subtask.thunk";
import taskService from "../../../../services/taskService";
import listToOptions from "../../../../utils/listToOptions";
import { sortByOrderNumber } from "../../../../utils/sortByOrderNumber";

const SubtaskParentsBlock = ({ subtask }) => {
  const dispatch = useDispatch();
  const epicList = useSelector((state) => state.epic.list);

  const [taskList, setTaskList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [loader, turnOnLoader, turnOffLoader] = useBooleanState(false);
  const [buttonsVisible, openButtons, closeButtons] = useBooleanState(false);

  const fetchTaskList = () => {
    taskService.getListInsideEpic(formik.values.epic_id).then((res) => {
      setTaskList(res.tasks?.sort(sortByOrderNumber) ?? []);
      setStageList(res.stages?.sort(sortByOrderNumber) ?? []);
    });
  };

  const computedEpicList = useMemo(() => {
    return listToOptions(epicList);
  }, [epicList]);

  const computedTaskList = useMemo(() => {
    return listToOptions(taskList);
  }, [taskList]);

  const [stageTitle, setStageTitle] = useState("");

  const formik = useFormik({
    initialValues: {
      epic_id: subtask.epic_id,
      task_id: subtask.task_id,
      stage_id: subtask.stage_id,
    },
    onSubmit,
  });

  const computedStageList = useMemo(() => {
    if (!formik.values.task_id) return [];

    const computedList = stageList?.filter(
      (stage) => stage.task_id === formik.values.task_id
    );

    return listToOptions(computedList);
  }, [formik.values.task_id, stageList]);

  function onSubmit(values) {
    turnOnLoader();
    const stageTitle = computedStageList?.find(
      (stage) => stage.value === values?.stage_id
    )?.label;

    values.stage_title = stageTitle || "";
    dispatch(
      updateSubtaskAction({
        ...subtask,
        ...values,
      })
    )
      .unwrap()
      .then(() => closeButtons())
      .finally(() => turnOffLoader());
  }

  const resetForm = () => {
    closeButtons();
    formik.resetForm();
  };

  useEffect(() => {
    if (!formik.values.epic_id) return null;
    fetchTaskList();
  }, [formik.values.epic_id]);

  return (
    <div className="SubtaskParentsBlock silver-bottom-border">
      <div className="selects-block">
        <FSelect
          label="Epic"
          name="epic_id"
          formik={formik}
          disabledHelperText
          options={computedEpicList}
          onChange={openButtons}
        />
        <FSelect
          label="Task"
          name="task_id"
          formik={formik}
          disabledHelperText
          options={computedTaskList}
          onChange={openButtons}
        />
        <FSelect
          label="Stage"
          name="stage_id"
          formik={formik}
          disabledHelperText
          options={computedStageList}
          onChange={openButtons}
        />
      </div>

      <Collapse in={buttonsVisible}>
        <div className="btns-block">
          <CancelButton title="Cancel" onClick={resetForm} />
          <SaveButton loading={loader} onClick={() => formik.handleSubmit()} />
        </div>
      </Collapse>
    </div>
  );
};

export default memo(SubtaskParentsBlock);
