import { Delete } from "@mui/icons-material";
import { DateTimePicker } from "@mui/lab";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import useDebounce from "../../../hooks/useDebounce";
import sprintService from "../../../services/sprintService";
import { applyDrag } from "../../../utils/applyDrag";
import Status from "./components/Status";
import * as Yup from "yup";
import { createNewSubtaskAction } from "../../../redux/thunks/subtask.thunk";
import { TextField } from "@mui/material";
import CreateRow from "./components/CreateRow";
import SubtaskModal from "../Backlog/Subtask/SubtaskModal";
import FTextField from "../../../components/FormElements/FTextField";
import subtaskService from "../../../services/subtaskService";
import { ExtraFunction } from "../../../assets/icons/icons";
import "./ListTable.scss";
import html2Text from "../../../utils/html2Text";

const DraggableTable = ({
  step,
  stepID,
  projectSprintStepID,
  lists = [],
  setLists = () => {},
  getStep = () => {},
  addingSubtask = false,
  setAddingSubtask = () => {},
  isDraggable = true,
}) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [deleteLoader, setDeleteLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubtask, setSelectedSubtask] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [editingDescription, setEditingDescription] = useState(null);
  const selectedSprint = useSelector((state) => state.sprint.selectedSprintId);

  const createSubtask = (values) => {
    const data = {
      project_id: projectId,
      task_id: values.task_id,
      stage_id: values.stage_id,
      title: values.title,
      ...values,
    };

    // return console.log("data", data);

    // setCreateLoader(true);
    dispatch(createNewSubtaskAction(data))
      .unwrap()
      .then((res) => {
        formik.resetForm();
        sprintService
          .addMultipleSubtaskToSprint({
            sprint_id: selectedSprint,
            subtask_ids: [res.id],
          })
          .then((res) => {
            getStep();
            setAddingSubtask(false);
          });
      });
    // .catch(() => setCreateLoader(false));
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    epic_id: Yup.string().required(),
    task_id: Yup.string().required(),
    stage_id: Yup.string().required(),
    due_date: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      due_date: null,
      title: "",
      epic_id: "",
      task_id: "",
      stage_id: "",
      description: "",
    },
    onSubmit: (values) => {
      createSubtask(values);
    },
    validationSchema,
  });

  const deleteSubtask = (subID) => {
    setDeleteLoader(true);
    sprintService
      .removeSubtaskFromSprint(selectedSprint, stepID, subID)
      .then((res) => {
        getStep();
      })
      .finally(() => setDeleteLoader(false));
  };

  const updateDeadline = useDebounce((subID, val) => {
    sprintService
      .updateSprintSubtaskDeadline(subID, {
        due_date: val,
        project_sprint_step_id: projectSprintStepID,
      })
      .then((res) => {
        getStep();
      });
  }, 700);

  const updateSubtaskOrder = ({ removedIndex, addedIndex }) => {
    sprintService.updateSprintSubtaskOrder(
      selectedSprint,
      stepID,
      lists[removedIndex].id,
      addedIndex + 1
    );
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(lists, dropResult);
    if (result) {
      setLists(result);
      updateSubtaskOrder(dropResult);
    }
  };

  const updateSubtask = (value, name) => {
    if (!formik?.values.title) return;
    subtaskService
      .update({
        ...formik.values,
        id: formik.values.subtask_id,
        [name]: value,
      })
      .then((res) => {
        getStep();
        if(name === 'title') setEditingSubtask(null);
        else setEditingDescription(null);
        // formik.resetForm();
      });
  };

  useEffect(() => {
    if (!addingSubtask) formik.resetForm();
  }, [addingSubtask]);

  return (
    <div style={{ padding: 8 }}>
      {/* MODAL */}
      {modalVisible && (
        <SubtaskModal
          closeModal={() => {
            getStep();
            setModalVisible(false);
          }}
          subtask={selectedSubtask}
          // updateStatus={getStep}
          sprintSubtask
          disabled={true}
          step={step}
          sprintId={selectedSprint}
          // titleChangeHandler={getStep}
        />
      )}
      <div className="ListTable">
        {/* HEAD */}
        <div className="table-head">
          <div className="table-head table-row">
            <div className="table-cell">№</div>
            <div className="table-cell">Epics</div>
            <div className="table-cell">Tasks</div>
            <div className="table-cell">Stage</div>
            <div className="table-cell">Subtasks</div>
            <div className="table-cell">Comments</div>
            <div className="table-cell">Deadline</div>
            <div className="table-cell">Status</div>
            <div
              className="table-cell"
              width={48}
              style={{
                justifyContent: "center",
              }}
            >
              <ExtraFunction/>
            </div>
          </div>
        </div>
        {/* BODY */}
        <div className="table-body">
          <Container
            onDrop={onDrop}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            lockAxis="y"
            dragHandleSelector={isDraggable ? "" : ".drag-handle"}
          >
            {addingSubtask ? (
              <CreateRow
                selectedSprint={selectedSprint}
                projectSprintStepID={projectSprintStepID}
                formik={formik}
                getStep={getStep}
                lists={lists}
              />
            ) : null}
            {lists?.map((list, idx) => (
              <Draggable key={list.id}>
                <div
                  className="table-row"
                  onClick={() => {
                    setSelectedSubtask(list);
                    setModalVisible(true);
                    setEditingDescription(null);
                    setEditingSubtask(null);
                  }}
                >
                  <div className="table-cell">{idx + 1}</div>
                  <div className="table-cell">{list?.epic_title}</div>

                  <div className="table-cell">{list?.task_title}</div>
                  <div className="table-cell">{list?.stage_title}</div>
                  {editingSubtask !== list.id ? (
                    <div
                      className="table-cell"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSubtask(list.id);
                        setEditingDescription(null);
                        setSelectedSubtask(list);
                        formik.setValues({
                          ...list,
                          title: list.subtask_title,
                        });
                      }}
                    >
                      {list?.subtask_title}
                    </div>
                  ) : (
                    <div
                      className="table-cell"
                      width={450}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FTextField
                        fullWidth
                        name="title"
                        value={formik.values.title}
                        formik={formik}
                        disabledHelperText
                        onBlur={e => {
                          updateSubtask(formik.values.title, "title");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateSubtask(formik.values.title, "title");
                          }
                        }}
                        onChange={(e) => {
                          formik.setFieldValue("title", e.target.value);
                        }}
                      />
                    </div>
                  )}
                  {editingDescription !== list.id ? (
                    <div
                      className="table-cell description-cell"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSubtask(null);
                        setEditingDescription(list.id);
                        setSelectedSubtask(list);
                        formik.setValues({
                          ...list,
                          title: list.subtask_title,
                        });
                      }}
                    >
                      {html2Text(list?.description || "")}
                    </div>
                  ) : (
                    <div
                      className="table-cell"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FTextField
                        fullWidth
                        name="description"
                        value={formik.values.description}
                        formik={formik}
                        multiline
                        rows={4}
                        disabledHelperText
                        onBlur={() => {
                          updateSubtask(
                            formik.values.description,
                            "description"
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            updateSubtask(
                              formik.values.description,
                              "description"
                            );
                          }
                        }}
                        onChange={(e) => {
                          formik.setFieldValue("description", e.target.value);
                        }}
                      />
                    </div>
                  )}
                  <div className="table-cell">
                    <DateTimePicker
                      value={list?.due_date ? new Date(list?.due_date) : null}
                      onChange={(val) => updateDeadline(list?.id, val)}
                      renderInput={(params) => <TextField {...params} />
                      
                    }
                    />
                  </div>
                  <div className="table-cell">
                    <Status
                      statusId={list?.status_id}
                      list={list}
                      getStep={getStep}
                      selectedSprint={selectedSprint}
                      projectSprintStepID={projectSprintStepID}
                    />
                  </div>
                  <div className="table-cell">
                    <RectangleIconButton
                      loader={deleteLoader}
                      color="error"
                      onClick={() => deleteSubtask(list?.id)}
                    >
                      <Delete color="error" />
                    </RectangleIconButton>
                  </div>
                </div>
              </Draggable>
            ))}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default DraggableTable;
