import SubtaskCard from "./SubtaskCard";
import { useMemo, useState, useRef, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import RowLinearLoader from "../../../components/RowLinearLoader";
import { applyDrag } from "../../../utils/applyDrag";
import subtaskService from "../../../services/subtaskService";
import { useSelector } from "react-redux";
import SubtaskCommentModal from "../../../components/SubtaskCommentModal";
import ColumnActions from "./ColumnActions";
import CreateCard from "./CreateCard";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import CreateCardActions from "./CreateCardActions";

const Column = ({
  addCard,
  status,
  step,
  getStep,
  subtaskList,
  loader,
  changeSubtaskList,
  removeSubtask,
  changeSubtaskStatus,
  onSubtaskDataChange,
}) => {
  const selectedSprintId = useSelector(
    (state) => state.sprint.selectedSprintId
  );
  const projectStatusList = useSelector((state) => state.status.list);
  const scrollRef = useRef(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [memoryData, setMemoryData] = useState(null);
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [submitState, setSubmitState] = useState(false);
  const computedSubtasksList = useMemo(() => {
    return subtaskList?.[status.id];
  }, [status, subtaskList]);

  const closeStatusModal = () => {
    setMemoryData(null);
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(computedSubtasksList, dropResult);
    if (!result) return null;

    // previousList.current = {...statu}
    changeSubtaskList(status.id, result);

    if (result?.length < computedSubtasksList?.length) return null;

    const data = {
      id: dropResult.payload.id,
      sprintId: selectedSprintId,
      stepId: step.project_sprint_step_id,
      statusId: status.id,
      boardOrderNumber: dropResult.addedIndex + 1,
    };

    const selectedStatus = projectStatusList.find((el) => el.id === status.id);

    if (!memoryData && selectedStatus?.state < 0) {
      setMemoryData(data);
    } else {
      updateStatus(data);
    }
  };

  const updateStatus = (data = memoryData, comment) => {
    setModalLoader(loader);
    subtaskService
      .updateOrderInBoard({ ...data, params: { comment } })
      .then(() => {
        closeStatusModal();
      })
      .finally(() => setModalLoader(false));
  };

  const sumbitHandler = () => {
    showCreateCard ? setSubmitState(true) : setShowCreateCard(true);
  };

  useEffect(() => {
    if (showCreateCard) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [showCreateCard]);

  return (
    <>
      {memoryData && (
        <SubtaskCommentModal
          closeModal={closeStatusModal}
          loading={modalLoader}
          updateStatus={updateStatus}
        />
      )}
      <div className="Column">
        <div className="column-header">
          <div className="side">
            <div className="title">{status?.title}</div>
          </div>
          <div className="side">
            <div className="counter">{computedSubtasksList?.length ?? 0}</div>
            <ColumnActions />
          </div>

          <RowLinearLoader visible={loader} />
        </div>

        <div className="column-body" ref={scrollRef}>
          <Container
            style={{ overflow: "auto" }}
            groupName="subtask"
            getChildPayload={(i) => computedSubtasksList[i]}
            onDrop={onDrop}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
          >
            {computedSubtasksList?.map((subtask) => (
              <Draggable key={subtask.id}>
                <SubtaskCard
                  getStep={getStep}
                  subtask={subtask}
                  statusId={status.id}
                  step={step}
                  removeSubtask={removeSubtask}
                  changeSubtaskStatus={changeSubtaskStatus}
                  onSubtaskDataChange={onSubtaskDataChange}
                />
              </Draggable>
            ))}
            {showCreateCard && (
              <CreateCard
                submitState={submitState}
                setSubmitState={setSubmitState}
                status={status}
                onSubmit={(value) => addCard(value, setShowCreateCard)}
              />
            )}
          </Container>
        </div>
        {computedSubtasksList ? (
          <div className="column-footer">
            <div className="add-card">
              <div className="card-btns">
                <Button
                  variant={showCreateCard ? "contained" : ""}
                  onClick={sumbitHandler}
                >
                  + Add Card
                </Button>
                {showCreateCard && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setShowCreateCard(false)}
                  >
                    Close
                  </Button>
                )}
              </div>
              {showCreateCard && <CreateCardActions />}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Column;
