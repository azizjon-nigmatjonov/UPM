import "./style.scss";
import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState, useMemo } from "react";
import { format } from "date-fns";
import {
  editGanttSubtaskPosisitonAction,
  updateSubtaskAction,
} from "../../../../redux/thunks/subtask.thunk";
import { useDispatch, useSelector } from "react-redux";
import sprintService from "../../../../services/sprintService";
import subtaskService from "../../../../services/subtaskService";
import { Card, Modal } from "@mui/material";
import StatusSelect from "../../../../components/StatusSelect";
import RingLoader from "../../../../components/Loaders/RingLoader";
import SubtaskCommentModal from "../../../../components/SubtaskCommentModal";
import SubtaskModalActions from "../../../../components/BoardV2/SubtaskModalActions/SubtaskModalActions";
import DescriptionBlock from "../../../../components/BoardV2/SDescription/DescriptionBlock";
import MembersBlock from "../../../../components/BoardV2/MembersBlock";
import AttachFiles from "../../../../components/BoardV2/AttachFiles";
import CommentsBlock from "../../../../components/BoardV2/CommentsBlock";
import ChecklistBlock from "../../../../components/BoardV2/Checklist/ChecklistBlock";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import SubtitlesOutlinedIcon from "@mui/icons-material/SubtitlesOutlined";
import SuperDatePicker from "../../../../components/SuperDatePicker/SuperDatePicker";

const SubtaskModal = ({
  closeModal,
  subtask,
  sprintSubtask,
  updateStatus = () => {},
  disabled,
  step,
  sprintId,
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

  const rightSideRef = useRef();

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      borderRadius: "4px",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      borderRadius: "4px !important",
    },
  }));
  const classes = useStyles();

  const [status, setStatus] = useState(subtask?.status_id);
  const [loader, setLoader] = useState(true);
  const [comments, setComments] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [selectedModalStatus, setSelectedModalStatus] = useState(null);
  const [statusLoader, setStatusLoader] = useState(false);
  const [assigneeUsers, setAssigneeUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [actions, setActions] = useState({
    members: false,
    checklist: false,
    files: false,
  });

  const computedSubtaskId = useMemo(() => {
    return sprintSubtask ? subtask.subtask_id : subtask.id;
  }, [subtask, sprintSubtask]);

  const closeStatusModal = () => setSelectedModalStatus(null);

  const isStatusBugs = subtask.task_title === "Bugs";

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
      setFiles(res.files ?? []);
      setStatus(res.status_id);
      setLoader(false);
      setCreatedAt(format(new Date(res?.created_at), "yyyy-MM-dd/HH:mm"));
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
        // closeStatusModal();
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

  useEffect(() => {
    let actions = {
      files: files?.length > 0 ? true : false,
      checklist: checklist?.length > 0 ? true : false,
      members: assigneeUsers?.length > 0 ? true : false,
    };
    setActions(actions);
  }, [files, assigneeUsers, checklist]);

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

      <Modal open className={classes.modal} onClose={closeModal}>
        <Card className="SubtaskModalNew">
          {loader ? (
            <div className="loader-area child-position-center">
              <RingLoader />
            </div>
          ) : (
            <>
              <div className="main-block">
                <div className="card-image">
                  {files.length > 0 && (
                    <img
                      src={`${process.env.REACT_APP_CDN_API_URL}/file/${files[0]?.id}`}
                      alt="file"
                    />
                  )}
                </div>

                <div className="card-content">
                  <div className="card-body">
                    <div className="with-icon">
                      <SubtitlesOutlinedIcon />
                      <h1 className="card-title ">{data?.title}</h1>
                    </div>
                    <div className="space-left" style={{ display: "flex" }}>
                      <div
                        className="parents-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <div
                          className="parents-block task"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {subtask.task_title}
                        </div>
                        <ArrowForwardIosIcon
                          sx={{
                            color: "#6E8BB7",
                            fontSize: 14,
                            marginRight: "2px",
                          }}
                        />
                        <div
                          className="parents-block stage"
                          style={{
                            color: "#0e73f6",
                            whiteSpace: "nowrap",
                            marginRight: "15px",
                          }}
                        >
                          {subtask.stage_title}
                        </div>
                      </div>
                      <div>
                        <StatusSelect
                          disabled={disabled}
                          typeId={selectedType}
                          status={status}
                          setStatus={statusChangeHandler}
                        />
                      </div>
                    </div>
                    {(actions.members || assigneeUsers?.length > 0) && (
                      <div className="label space-top space-left">
                        <span>Members</span>
                        <div className="members">
                          <MembersBlock
                            subtaskId={computedSubtaskId}
                            assigneeUsers={assigneeUsers}
                            setAssigneeUsers={setAssigneeUsers}
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-top">
                      <div className="with-icon">
                        <AccessTimeRoundedIcon />
                        <h1 className="card-title">
                          {isStatusBugs ? "Created at" : "Deadline"}
                        </h1>
                      </div>
                      <div ref={rightSideRef} className=" dates space-left">
                        {isStatusBugs ? (
                          <div>{createdAt}</div>
                        ) : (
                          <div className="dates">
                            <div>
                              <div className="label">Plan</div>
                              <div className="plan-wrapper">
                                <div>
                                  <div className="value">
                                    <SuperDatePicker
                                      value={startDate}
                                      onChange={onStartDateChange}
                                    />
                                  </div>
                                </div>
                                -
                                <div className="">
                                  <div className="label"></div>
                                  <div className="value">
                                    <SuperDatePicker
                                      value={endDate}
                                      onChange={onEndDateChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-horizontal-divider"></div>
                            <div>
                              <div className="label">Fact</div>
                              <div className="fact-wrapper">
                                <div>
                                  <div className="value fact-box">
                                    <div className="num">
                                      {data.start_date?.fact
                                        ? format(
                                            new Date(data.start_date?.fact),
                                            "dd MMM"
                                          )
                                        : "---"}
                                    </div>
                                  </div>
                                </div>
                                -
                                <div>
                                  <div className="label"></div>
                                  <div className="value fact-box">
                                    <div className="num">
                                      {data?.end_date?.fact
                                        ? format(
                                            new Date(data.end_date?.fact),
                                            "dd MMM"
                                          )
                                        : "---"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <DescriptionBlock data={data} />
                    {actions.files && (
                      <AttachFiles
                        files={files}
                        setFiles={setFiles}
                        subtaskId={computedSubtaskId}
                        data={data}
                      />
                    )}
                    {actions.checklist && (
                      <ChecklistBlock
                        checklist={checklist}
                        setChecklist={setChecklist}
                        subtaskId={computedSubtaskId}
                      />
                    )}
                    <CommentsBlock
                      comments={comments}
                      setComments={setComments}
                      subtaskId={computedSubtaskId}
                      scrollBottomRightSide={scrollBottomRightSide}
                    />
                  </div>
                  <div className="card-aside">
                    <SubtaskModalActions
                      actions={actions}
                      setActions={setActions}
                      subtask={subtask}
                      sprintId={sprintId}
                      step={step}
                      closeModal={closeModal}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </Modal>
    </>
  );
};

export default SubtaskModal;
