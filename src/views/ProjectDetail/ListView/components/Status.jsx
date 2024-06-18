import { useMemo } from "react";
import { useSelector } from "react-redux";
import StatusSelect from "../../../../components/StatusSelect";
import sprintService from "../../../../services/sprintService";

const Status = ({
  statusId,
  list = [],
  projectSprintStepID,
  selectedSprint,
  getStep = () => {},
  ...props
}) => {
  const projectStatusList = useSelector((state) => state.status.list);
  const taskTypeList = useSelector((state) => state.taskType.list);

  const selectedType = useMemo(() => {
    const selectedStatus = projectStatusList.find((el) => el.id === statusId);
    const selectedType = taskTypeList.find(
      (type) => type.id === selectedStatus?.project_task_type_id
    );
    return selectedType?.id;
  }, [statusId, projectStatusList, taskTypeList]);

  const updateStatus = (val) => {
    // const selectedStatus = projectStatusList.find((el) => el.id === val);

    // if (!selectedModalStatus && selectedStatus?.state < 0)
    //   return setSelectedModalStatus(val);

    const data = {
      project_sprint_step_id: projectSprintStepID,
      sprint_id: selectedSprint,
      status_id: val,
      subtask_id: list?.subtask_id,
      subtask_item_id: list?.id,
      task_id: list?.task_id,
      stage_id: list?.stage_id,
      // comment,
    };

    // setModalLoader(true);
    sprintService.updateSprintSubtaskStatus(data).then((res) => {
      getStep();
      // closeModal();
    });
    // .finally(() => setModalLoader(false));
  };

  return (
    <StatusSelect
      typeId={selectedType}
      status={statusId}
      setStatus={updateStatus}
      {...props}
      // disabled={disableEditStatus}
    />
  );
};

export default Status;
