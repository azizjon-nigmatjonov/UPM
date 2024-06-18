import { Done } from "@mui/icons-material";
import { DateTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import FSelect from "../../../../components/FormElements/FSelect";
import FTextField from "../../../../components/FormElements/FTextField";
import taskService from "../../../../services/taskService";
import listToOptions from "../../../../utils/listToOptions";
import { sortByOrderNumber } from "../../../../utils/sortByOrderNumber";
import Status from "./Status";

const CreateRow = ({
  selectedSprint,
  projectSprintStepID,
  getStep = () => {},
  formik,
}) => {
  const epicList = useSelector((state) => state.epic.list);
  const [taskList, setTaskList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [loader, setLoader] = useState(false);
  const projectDefaultStatusID = useSelector(state => state.project.info?.default_status)


  const computedEpicList = useMemo(() => {
    return listToOptions(epicList);
  }, [epicList]);

  const computedTaskList = useMemo(() => {
    return listToOptions(taskList);
  }, [taskList]);

  const computedStageList = useMemo(() => {
    if (!formik.values.task_id) return [];

    const computedList = stageList?.filter(
      (stage) => stage.task_id === formik.values.task_id
    );

    return listToOptions(computedList);
  }, [formik.values.task_id, stageList]);

  const fetchTaskList = () => {
    taskService.getListInsideEpic(formik.values.epic_id).then((res) => {
      setTaskList(res.tasks?.sort(sortByOrderNumber) ?? []);
      setStageList(res.stages?.sort(sortByOrderNumber) ?? []);
    });
  };

  useEffect(() => {
    if (!formik.values.epic_id) return null;
    fetchTaskList();
  }, [formik.values.epic_id]);

  return (
    <div
      className="table-row"
    >
      <div className="table-cell"></div>
      <div className="table-cell" width={200}>
        <FSelect
          label="Select Epic"
          name="epic_id"
          formik={formik}
          disabledHelperText
          options={computedEpicList}
          onChange={() => {
            formik.setFieldValue("task_id", "");
            formik.setFieldValue("stage_id", "");
          }}
        />
      </div>
      <div className="table-cell" width={200}>
        <FSelect
          label="Task"
          name="task_id"
          formik={formik}
          disabledHelperText
          options={computedTaskList}
          onChange={() => {
            formik.setFieldValue("stage_id", "");
          }}
        />
      </div>
      <div className="table-cell" width={200}>
        <FSelect
          label="Stage"
          name="stage_id"
          formik={formik}
          disabledHelperText
          options={computedStageList}
        />
      </div>
      <div className="table-cell" width={450}>
        <FTextField
          fullWidth
          label="Subtask"
          name="title"
          formik={formik}
          disabledHelperText
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              evt.preventDefault();
              evt.target.blur();
              const nextInput =
                evt.target.parentElement.parentElement.parentElement.nextElementSibling.querySelector(
                  "input"
                );
              nextInput.focus();
            }
          }}
        />
      </div>
      <div className="table-cell" width={250}>
        <FTextField
          fullWidth
          label="Comment"
          name="description"
          formik={formik}
          disabledHelperText
          onKeyDown={(evt) => {
            if (evt.key === "Enter") {
              formik.handleSubmit();
            }
          }}
        />
      </div>
      <div className="table-cell" width={240}>
        <DateTimePicker
          value={formik.values.due_date}
          onChange={(val) => formik.setFieldValue("due_date", val)}
          renderInput={(params) => <TextField {...params} error={formik.errors.due_date} />}
        />
      </div>
      <div className="table-cell">
        
        <Status
          statusId={formik.values.status_id || projectDefaultStatusID}
          list={{}}
          getStep={getStep}
          selectedSprint={selectedSprint}
          projectSprintStepID={projectSprintStepID}
          setStatus={(val) => formik.setFieldValue('status_id', val)}
        />
      </div>
      <div className="table-cell" width={48} align="center">
        <RectangleIconButton
          loader={loader}
          color="primary"
          onClick={() => formik.handleSubmit()}
        >
          <Done color="primary" />
        </RectangleIconButton>
      </div>
    </div>
  );
};

export default CreateRow;
