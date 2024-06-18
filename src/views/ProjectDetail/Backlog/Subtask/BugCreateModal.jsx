import { Card, IconButton, Modal, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useFormik } from "formik";
import FTextField from "../../../../components/FormElements/FTextField";
import FSelect from "../../../../components/FormElements/FSelect";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import listToOptions from "../../../../utils/listToOptions";
import { useState } from "react";
import taskService from "../../../../services/taskService";
import { sortByOrderNumber } from "../../../../utils/sortByOrderNumber";
import { useEffect } from "react";
import RingLoader from "../../../../components/Loaders/RingLoader";
import CBreadcrumbs from "../../../../components/CBreadcrumbs";
import SaveButton from "../../../../components/Buttons/SaveButton";

const BugCreateModal = ({ closeModal, loading, createBug }) => {
  const epicList = useSelector((state) => state.epic.list);

  const [taskList, setTaskList] = useState([]);
  const [stageList, setStageList] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchTaskList = () => {
    taskService.getListInsideEpic(formik.values.epic_id).then((res) => {
      setTaskList(res.tasks?.sort(sortByOrderNumber) ?? []);
      setStageList(res.stages?.sort(sortByOrderNumber) ?? []);
    });
  };

  const computedTaskList = useMemo(() => {
    return listToOptions(taskList);
  }, [taskList]);

  const onSubmit = (values) => {
    const data = {
      ...values,
      task_title: taskList.find((task) => task.id === values.task_id)?.title,
      stage_title: stageList.find((stage) => stage.id === values.stage_id)
        ?.title,
    };

    createBug(data);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      task_id: "",
      stage_id: "",
      epic_id: "",
      description: "",
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

  const computedEpicList = useMemo(() => {
    return listToOptions(epicList);
  }, [epicList]);

  const breadCrumbItems = [{ label: "Create bug222" }];

  useEffect(() => {
    if (!formik.values.epic_id) return null;
    fetchTaskList();
  }, [formik.values.epic_id]);

  return (
    <Modal
      open
      className={`SubtaskModal-wrapper child-position-center`}
      onClose={closeModal}
    >
      <Card className="SubtaskModal">
        <div className="modal-header">
          <CBreadcrumbs items={breadCrumbItems} />
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
                <div className="info-block silver-bottom-border"></div>

                <div className="title-block flex align-center gap-2 silver-bottom-border">
                  <Typography variant="h5">TITLE: </Typography>
                  <FTextField
                    formik={formik}
                    fullWidth
                    autoFocus
                    name="title"
                    placeholder="Title"
                    disabledHelperText
                  />
                </div>

                <div className="SubtaskParentsBlock silver-bottom-border">
                  <div className="selects-block">
                    <FSelect
                      label="Epic"
                      name="epic_id"
                      formik={formik}
                      disabledHelperText
                      options={computedEpicList}
                      onChange={() => {
                        formik.setFieldValue("task_id", "");
                        formik.setFieldValue("stage_id", "");
                      }}
                    />
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
                    <FSelect
                      label="Stage"
                      name="stage_id"
                      formik={formik}
                      disabledHelperText
                      options={computedStageList}
                    />
                  </div>
                </div>

                <div className="description-block silver-bottom-border">
                  <div className="description-header">
                    <Typography variant="h6">DESCRIPTION:</Typography>
                  </div>
                  <FTextField
                    multiline
                    rows={6}
                    fullWidth
                    formik={formik}
                    placeholder="Description"
                    name="description"
                    disabledHelperText
                  />
                </div>

                <div className="description-block">
                  <div className="btns-block">
                    <SaveButton onClick={() => formik.handleSubmit()} />
                  </div>
                </div>
              </div>
              <div className="side"></div>
            </>
          )}
        </div>
      </Card>
    </Modal>
  );
};

export default BugCreateModal;
