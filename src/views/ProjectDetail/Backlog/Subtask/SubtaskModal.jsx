import { Card, IconButton, Modal, Typography } from "@mui/material";
import CBreadcrumbs from "../../../../components/CBreadcrumbs";
import "./style.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import StatusSelect from "../../../../components/StatusSelect";
import { useEffect, useRef, useState } from "react";
import CommentsBlock from "../../../../components/CommentsBlock";
import ChecklistBlock from "./ChecklistBlock";
import RingLoader from "../../../../components/Loaders/RingLoader";
import subtaskService from "../../../../services/subtaskService";
import DescriptionBlock from "./DescriptionBlock";
import { useMemo } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import SubtaskTypeSelect from "../../../../components/Selects/SubtaskTypeSelect";
import { useDispatch, useSelector } from "react-redux";
import sprintService from "../../../../services/sprintService";
import { format } from "date-fns";
import SubtaskCommentModal from "../../../../components/SubtaskCommentModal";
import MembersBlock from "../../../../components/MembersBlock";
import AttachFiles from "../../../../components/AttachFiles";
import SubtaskParentsBlock from "./SubtaskParentsBlock";
import DateForm from "../../../../components/DateForm";
import {
  editGanttSubtaskPosisitonAction,
  updateSubtaskAction,
} from "../../../../redux/thunks/subtask.thunk";
import TitleBlock from "./TitleBlock";

const SubtaskModal = ({
  closeModal,
  subtask,
  sprintSubtask,
  updateStatus = () => {},
  disabled,
  step,
  sprintId,
  insideGantt,
  titleChangeHandler = () => {},
}) => {
  const dispatch = useDispatch();
  const statusList = useSelector((state) => state.status.list);
  const taskTypeList = useSelector((state) => state.taskType.list);
  const ganttPeriod = useSelector((state) => state.gantt.ganttPeriod);
  const indexedDates = useSelector((state) =>
    ganttPeriod === "week"
      ? state.gantt.indexedDates
      : ganttPeriod === "month"
      ? state.gantt.indexedDatesForMonth
      : state.gantt.indexedDatesForYear
  );
  // const indexedDates = useSelector((state) => state.gantt.indexedDates)

  const rightSideRef = useRef();

  const [status, setStatus] = useState(subtask?.status_id);
  const [loader, setLoader] = useState(true);
  const [comments, setComments] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [selectedModalStatus, setSelectedModalStatus] = useState(null);
  const [statusLoader, setStatusLoader] = useState(false);
  const [assigneeUsers, setAssigneeUsers] = useState([]);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const breadCrumbItems = [
    { label: subtask.task_title },
    { label: subtask.stage_title },
  ];

  const computedSubtaskId = useMemo(() => {
    return sprintSubtask ? subtask.subtask_id : subtask.id;
  }, [subtask, sprintSubtask]);

  const closeStatusModal = () => setSelectedModalStatus(null);

  const getData = () => {
    setLoader(true);
    subtaskService.getById(computedSubtaskId).then((res) => {
      setData(res);
      setStartDate(res.start_date?.expected);
      setEndDate(res.end_date?.expected);
      setComments(res.comment_items ?? []);
      setChecklist(
        res.checklist_items?.map((el) => ({
          ...el,
          status: el.status === "DONE" ? true : false,
        })) ?? []
      );
      setAssigneeUsers(res.assignee_users ?? []);
      setStatus(res.status_id);
      setLoader(false);
    });
  };

  const updateSubtaskStatus = (value, comment) => {
    setStatusLoader(true);
    const updated = {
      ...data,
      status_id: value,
      comment,
    };
    subtaskService
      .update(updated)
      .then((res) => {
        dispatch(updateSubtaskAction(updated));
        setStatus(value);
        updateStatus(value, comment);
        closeStatusModal();
      })
      .finally(() => setStatusLoader(false));
  };

  const updateSubtaskStatusInStep = (value, comment) => {
    const data = {
      project_sprint_step_id: step.project_sprint_step_id,
      sprint_id: step.sprint_id || sprintId,
      status_id: value,
      subtask_id: subtask.subtask_id,
      subtask_item_id: subtask.id,
      task_id: subtask.task_id,
      stage_id: subtask.stage_id,
      comment,
    };

    setStatusLoader(true);
    sprintService
      .updateSprintSubtaskStatus(data)
      .then((res) => {
        setStatus(value);
        updateStatus(value, comment);
        closeStatusModal();
      })
      .finally(() => setStatusLoader(false));
  };

  const statusChangeHandler = (value, comment) => {
    const selectedStatus = statusList.find((el) => el.id === value);

    if (!selectedModalStatus && selectedStatus?.state < 0)
      return setSelectedModalStatus(value);
    if (sprintSubtask) return updateSubtaskStatusInStep(value, comment);
    updateSubtaskStatus(value, comment);
  };

  const taskTypeChangeHandler = (val) => {
    const selectedStatus = statusList.find(
      (el) => el.project_task_type_id === val
    );
    statusChangeHandler(selectedStatus?.id);
  };

  const selectedType = useMemo(() => {
    const selectedStatus = statusList.find((el) => el.id === status);
    const selectedType = taskTypeList.find(
      (type) => type.id === selectedStatus?.project_task_type_id
    );
    return selectedType?.id;
  }, [status, statusList, taskTypeList]);

  const onStartDateChange = (value) => {
    setStartDate(value);

    const beginIndex = indexedDates.findIndex(
      (el) => el === format(value, "MM-dd-yyyy")
    );
    const endIndex = indexedDates.findIndex(
      (el) => el === format(new Date(endDate), "MM-dd-yyyy")
    );

    if (beginIndex === -1 || endIndex === -1) return null;

    dispatch(
      editGanttSubtaskPosisitonAction({
        subtask: data,
        beginIndex,
        endIndex,
      })
    );
  };

  const onEndDateChange = (value) => {
    setEndDate(value);

    const beginIndex = indexedDates.findIndex(
      (el) => el === format(new Date(startDate), "MM-dd-yyyy")
    );
    const endIndex = indexedDates.findIndex(
      (el) => el === format(value, "MM-dd-yyyy")
    );

    if (beginIndex === -1 || endIndex === -1) return null;

    dispatch(
      editGanttSubtaskPosisitonAction({
        subtask: data,
        beginIndex,
        endIndex,
      })
    );
  };

  const scrollBottomRightSide = () => {
    rightSideRef.current.scrollTop = rightSideRef.current.scrollHeight;
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {selectedModalStatus && (
        <SubtaskCommentModal
          closeModal={closeStatusModal}
          updateStatus={statusChangeHandler}
          selectedStatus={selectedModalStatus}
          loading={statusLoader}
        />
      )}
      <Modal
        open
        className={`SubtaskModal-wrapper child-position-center ${
          insideGantt ? "inside-gantt" : ""
        }`}
        onClose={closeModal}
      >
        <Card className="SubtaskModal">
          <div className="modal-header">
            <CBreadcrumbs items={breadCrumbItems} icon={<FolderIcon />} />
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <div className="main-block">
            {loader ? (
              <div className="loader-area child-position-center">
                <RingLoader />
              </div>
            ) : (
              <>
                <div className="side silver-right-border">
                  <div className="info-block silver-bottom-border">
                    <div style={{ display: "flex", gap: "10px" }}>
                      <div>
                        <SubtaskTypeSelect
                          disabled={disabled}
                          value={selectedType}
                          onChange={taskTypeChangeHandler}
                        />
                      </div>
                      <StatusSelect
                        disabled={disabled}
                        typeId={selectedType}
                        status={status}
                        setStatus={statusChangeHandler}
                      />
                    </div>

                    <MembersBlock
                      subtaskId={computedSubtaskId}
                      assigneeUsers={assigneeUsers}
                      setAssigneeUsers={setAssigneeUsers}
                    />
                  </div>

                  {/* <div className="title-block silver-bottom-border">
                    <Typography variant="h5">{data?.title}</Typography>

                  </div> */}

                  <TitleBlock data={data} onChange={titleChangeHandler} />

                  <SubtaskParentsBlock subtask={data} />

                  <DescriptionBlock data={data} />

                  <AttachFiles subtaskId={computedSubtaskId} data={data} />
                </div>

                <div className="side" ref={rightSideRef}>
                  <div className="info-block silver-bottom-border">
                    <div className="dates">
                      <div className="date-block silver-right-border">
                        <div className="label">Planned</div>
                        <div className="value">
                          <DateForm
                            date={startDate}
                            onChange={onStartDateChange}
                          />
                        </div>
                      </div>
                      <div className="date-block silver-right-border">
                        <div className="label">Due date</div>
                        <div className="value">
                          <DateForm date={endDate} onChange={onEndDateChange} />
                        </div>
                      </div>
                      <div className="date-block silver-right-border">
                        <div className="label">Started</div>
                        <div className="value">
                          {data.start_date?.fact
                            ? format(new Date(data.start_date?.fact), "dd MMM")
                            : "---"}
                        </div>
                      </div>
                      <div className="date-block silver-right-border">
                        <div className="label">Accepted</div>
                        <div className="value">
                          {data?.end_date?.fact
                            ? format(new Date(data.end_date?.fact), "dd MMM")
                            : "---"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <ChecklistBlock
                    checklist={checklist}
                    setChecklist={setChecklist}
                    subtaskId={computedSubtaskId}
                  />

                  <CommentsBlock
                    comments={comments}
                    setComments={setComments}
                    subtaskId={computedSubtaskId}
                    scrollBottomRightSide={scrollBottomRightSide}
                  />
                </div>
              </>
            )}
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default SubtaskModal;
