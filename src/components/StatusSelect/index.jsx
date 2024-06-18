import { FormControl, MenuItem, Select } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import "./style.scss";

const StatusSelect = ({
  status,
  statusOptions,
  formik,
  typeId,
  disabled,
  setStatus = () => {},
  updateHandler = () => {},
  epic,
  // for using in CaseSteps
  caseStatusList = [],
  onCaseStatusChange = () => {},
}) => {
  const statusList = useSelector((state) => state.status.list);
  const isCaseStatus = caseStatusList?.length;
  // const taskTypeList = useSelector(state => state.taskType.list)

  const computedStatusList = useMemo(() => {
    if (!typeId) return [];
    return statusList.filter(
      (status) => status.project_task_type_id === typeId
    );
  }, [statusList, typeId]);

  const changeHandler = (e) => {
    formik?.setFieldValue("status_id", e.target.value);
    updateHandler({ ...epic, status_id: e.target.value });
    const value = e.target.value;
    if (isCaseStatus) onCaseStatusChange();
    setStatus(value);
  };

  const computedStatusColor = useMemo(() => {
    if (!status || !statusList?.length) return "";
    const selectedStatus =
      caseStatusList.find((el) => el.id === status) ||
      statusList.find((el) => el.id === status);
    return selectedStatus?.color ?? "#0067F4";
  }, [status, statusList]);

  return (
    <FormControl>
      <Select
        onClick={(e) => e.stopPropagation()}
        className={`StatusSelect ${computedStatusColor} ${
          disabled ? "disabled" : ""
        }`}
        style={{ backgroundColor: computedStatusColor }}
        size="small"
        id="grouped-select"
        value={
          statusOptions
            ? statusOptions?.find((el) => el.value === formik.values.status_id)
                ?.value
            : status
        }
        onChange={changeHandler}
        disabled={disabled}
      >
        {statusOptions?.length
          ? statusOptions?.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))
          : isCaseStatus
          ? caseStatusList?.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.title}
              </MenuItem>
            ))
          : computedStatusList?.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.title}
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
};

export default StatusSelect;
