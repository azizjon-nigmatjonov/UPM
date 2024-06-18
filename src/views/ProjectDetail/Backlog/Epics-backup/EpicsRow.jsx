import {
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ButtonsPopover from "../../../../components/ButtonsPopover";
import epicsService from "../../../../services/epicsService";
import CreateRow from "../CreateRow";
import taskService from "../../../../services/taskService";
import CollapseIcon from "../../../../components/CollapseIcon";
import RowLinearLoader from "../../../../components/RowLinearLoader";
import TaskRow from "../Task/TaskRow";
import CreateRowButton from "../../../../components/CreateRowButton";
import { useParams } from "react-router-dom";
import TasksCounter from "../../../../components/TasksCounter";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "../../../../utils/applyDrag";
import { sortByOrderNumber } from "../../../../utils/sortByOrderNumber";
import { useSelector } from "react-redux";
import CollapseFolderIcons from "../../../../components/CollapseIcon/CollapseFolderIcons";

const EpicsRow = ({
  epic,
  index,
  setEpicsList,
  selectedVersion,
  disableEdit,
}) => {
  const { projectId } = useParams();
  const projectInfo = useSelector((state) => state.project.info);
  const userId = useSelector((state) => state.auth.userInfo.id);

  const [childBlockVisible, setChildBlockBisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [textFieldVisible, setTextFieldVisible] = useState(false);
  const [taskList, setTaskList] = useState(null);
  const [linearLoader, setLinearLoader] = useState(false);
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);

  const switchChildBlockVisible = () => setChildBlockBisible((prev) => !prev);

  const deleteEpicAction = () => {
    setLoader(true);
    epicsService
      .delete(epic.id, selectedVersion)
      .then((res) => {
        setEpicsList((prev) => prev.filter((el) => el.id !== epic.id));
      })
      .catch(() => setLoader(false));
  };

  const updateEpicAction = ({ title, locked, color, start_date, end_date }) => {
    const data = {
      ...epic,
      version_id: selectedVersion,
      title,
      locked,
      color,
      start_date,
      end_date
    };

    epicsService.update(data).then((res) => {
      setEpicsList((prev) =>
        prev.map((el) => {
          if (el.id !== epic.id) return el;
          return {
            ...el,
            title,
          };
        })
      );
      setTextFieldVisible(false);
    });
  };

  const getTaskList = () => {
    setLinearLoader(true);
    taskService
      .getList(epic.id)
      .then((res) => setTaskList(res.tasks?.sort(sortByOrderNumber)))
      .finally(() => setLinearLoader(false));
  };

  const createTask = ({ title }) => {
    const data = {
      creator_id: userId,
      epic_id: epic.id,
      order_number: taskList?.length || 0,
      project_id: projectId,
      status: 0,
      title,
      version_id: selectedVersion,
      status_id: projectInfo.default_status,
    };

    setCreateLoader(true);
    taskService
      .create(data)
      .then((res) => {
        setCreateFormVisible(false);
        setTaskList((prev) => (!prev ? [res] : [...prev, res]));
        setChildBlockBisible(true);
      })
      .catch(() => setCreateLoader(false));
  };

  useEffect(() => {
    if (taskList || !childBlockVisible) return null;
    getTaskList();
  }, [childBlockVisible]);

  const onDrop = (dropResult) => {
    const result = applyDrag(taskList, dropResult);
    if (result) {
      setTaskList(result);
      updateTaskOrder(dropResult);
    }
  };

  const updateTaskOrder = ({ removedIndex, addedIndex }) => {
    taskService.updateOrder(taskList[removedIndex].id, addedIndex + 1);
  };

  return (
    <>
      <MenuItem
        className="row silver-bottom-border pointer level-1"
        onClick={switchChildBlockVisible}
      >
        <div className="row-index">{index + 1}</div>
        <CollapseFolderIcons fill="#0E73F6" isOpen={childBlockVisible} />

        {textFieldVisible ? (
          <CreateRow initialTitle={epic.title} onSubmit={updateEpicAction} />
        ) : (
          <>
            <div className="row-label">{epic.title}</div>
            <div className="row-btns">
              <TasksCounter element={epic} />
              {!disableEdit && (
                <CreateRowButton
                  formVisible={createFormVisible}
                  setFunction={setCreateFormVisible}
                />
              )}

              {loader ? (
                <div style={{ padding: "12px" }}>
                  <CircularProgress disableShrink size={20} />
                </div>
              ) : (
                <>
                  {!disableEdit && (
                    <ButtonsPopover
                      onDeleteClick={deleteEpicAction}
                      onEditClick={() => setTextFieldVisible(true)}
                    />
                  )}
                </>
              )}
            </div>
          </>
        )}

        <RowLinearLoader visible={linearLoader} />
      </MenuItem>

      <Collapse in={createFormVisible} className="silver-bottom-border">
        <CreateRow
          onSubmit={createTask}
          loader={createLoader}
          setLoader={setCreateLoader}
          visible={createFormVisible}
          setVisible={setCreateFormVisible}
          placeholder="Task title"
        />
      </Collapse>

      <Collapse in={childBlockVisible && !textFieldVisible && taskList}>
        <Container
          onDrop={onDrop}
          lockAxis="y"
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {taskList?.map((task, index) => (
            <Draggable key={task.id}>
              <TaskRow
                key={task.id}
                task={task}
                index={index}
                setTaskList={setTaskList}
                disableEdit={disableEdit}
              />
            </Draggable>
          ))}
        </Container>
      </Collapse>
    </>
  );
};

export default EpicsRow;
