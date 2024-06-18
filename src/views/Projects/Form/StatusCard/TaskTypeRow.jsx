import { Collapse, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import RowLinearLoader from "../../../../components/RowLinearLoader";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CreateRow from "../../../ProjectDetail/Backlog/CreateRow";
import CollapseIcon from "../../../../components/CollapseIcon";
import {
  updateTaskTypeAction,
} from "../../../../redux/thunks/taskType.thunk";
import { Draggable, Container } from "react-smooth-dnd";
import StatusTypeRow from "./StatusTypeRow";
import {
  createNewStatusTypeAction,
  getStatusTypeListAction,
  updateStatusTypeOrderAction,
} from "../../../../redux/thunks/statusType.thunk";
import { applyDrag } from "../../../../utils/applyDrag";
import IconPicker from "../../../../components/IconPicker";
import StatusTypeCreateRow from "./StatusTypeCreateRow";

const TaskTypeRow = ({ taskType }) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const allStatusTypeList = useSelector((state) => state.statusType.list);

  const [textFieldVisible, setTextFieldVisible] = useState(false);
  const [linearLoader, setLinearLoader] = useState(false);
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const statusTypeList = useMemo(() => {
    return (
      allStatusTypeList.filter(
        (statusType) => statusType.project_task_type_id === taskType.id
      ) ?? []
    );
  }, [allStatusTypeList, taskType]);

  const updateHandler = (values) => {
    const data = { ...taskType, ...values };

    setUpdateLoader(true);
    dispatch(updateTaskTypeAction(data))
      .unwrap()
      .then(() => setTextFieldVisible(false))
      .finally(() => setUpdateLoader(false));
  };

  const iconChangeHandler = (icon) => {
    updateHandler({ icon });
  };

  const openChildBlock = () => {
    if (statusTypeList?.length) return setChildBlockVisible(true);
    getStatusTypeList();
  };

  const switchChildBlockVisible = () => {
    if (!childBlockVisible) return openChildBlock();
    setChildBlockVisible(false);
  };

  const getStatusTypeList = () => {
    setLinearLoader(true);
    dispatch(getStatusTypeListAction(taskType.id))
      .unwrap()
      .then(() => {
        setChildBlockVisible(true);
      })
      .finally(() => {
        setLinearLoader(false);
      });
  };

  const createStatusType = ({ title, state }) => {
    const data = {
      project_task_type_id: taskType.id,
      project_id: projectId,
      state,
      title,
    };
    setCreateLoader(true);
    dispatch(createNewStatusTypeAction(data))
      .unwrap()
      .then((res) => {
        setCreateFormVisible(false);
        setChildBlockVisible(true);
      })
      .catch(() => setCreateLoader(false));
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(statusTypeList, dropResult);
    if (result) {
      dispatch(
        updateStatusTypeOrderAction({
          ...dropResult,
          list: result,
          id: statusTypeList[dropResult.removedIndex].id,
        })
      );
    }
  };

  return (
    <>
      <MenuItem
        className="TaskTypeRow silver-bottom-border pointer"
        onClick={switchChildBlockVisible}
      >
        {textFieldVisible ? (
          <CreateRow
            initialTitle={taskType.title}
            onSubmit={updateHandler}
            btnLoader={updateLoader}
          />
        ) : (
          <>
            <CollapseIcon fill="#0E73F6" isOpen={childBlockVisible} />
            <IconPicker
              onChange={iconChangeHandler}
              value={taskType.icon}
              loading={updateLoader}
              style={{ marginRight: "10px" }}
              disabled
            />

            <div className="label">{taskType.title}</div>
          </>
        )}

        <RowLinearLoader visible={linearLoader} />
      </MenuItem>

      <Collapse in={createFormVisible} className="silver-bottom-border">
        <StatusTypeCreateRow
          onSubmit={createStatusType}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
          placeholder="Task title"
        />
      </Collapse>

      <Collapse in={childBlockVisible && !textFieldVisible && statusTypeList}>
        <Container
          onDrop={onDrop}
          lockAxis="y"
          dragHandleSelector=".drag-handler-btn"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {statusTypeList?.map((statusType, index) => (
            <Draggable key={statusType.id}>
              <StatusTypeRow
                key={statusType.id}
                statusType={statusType}
                index={index}
              />
            </Draggable>
          ))}
        </Container>
      </Collapse>
    </>
  );
};

export default TaskTypeRow;
