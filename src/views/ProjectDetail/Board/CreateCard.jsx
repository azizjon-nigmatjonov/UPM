import { useFormik } from 'formik';
import { useEffect, useState, useMemo } from 'react';
import * as Yup from "yup"
import { useSelector } from 'react-redux';
import FSelect from '../../../components/FormElements/FSelect';
import FTextField from '../../../components/FormElements/FTextField';
import epicsService from '../../../services/epicsService';
import taskService from '../../../services/taskService';
import listToOptions from '../../../utils/listToOptions';

const CreateCard = ({
  status,
  onSubmit = () => {},
  submitState,
  setSubmitState,
}) => {
  const userId = useSelector((state) => state.auth.userInfo.id);
  const selectedVersionId = useSelector(
    (state) => state.version.selectedVersionId
  );
  const [epicsList, setEpicsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [stagesList, setStagesList] = useState([]);

  const submitHandler = (val) => {
    onSubmit({
      ...val,
      task_title: tasksList.find((el) => el.value === val.task_id)?.label,
      stage_title: stagesList.find((el) => el.value === val.stage_id)?.label,
    });
  };

  
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    epic_id: Yup.string().required("Epic is required"),
    task_id: Yup.string().required("Task is required"),
    stage_id: Yup.string().required("Stage is required"),
  });
  
  const formik = useFormik({
    initialValues: {
      creator_id: userId,
      description: '',
      version_id: '',
      epic_id: '',
      task_id: '',
      stage_id: '',
      status_id: status.id,
      title: '',
    },
    onSubmit: submitHandler,
    validationSchema,
  });


  const fetchEpicsList = () => {
    epicsService
      .getList(selectedVersionId)
      .then((res) => setEpicsList(listToOptions(res.epic_items)));
  };

  const fetchTasksList = (epicId) => {
    taskService
      .getList(epicId)
      .then((res) => setTasksList(listToOptions(res.tasks)));
  };

  const fetchStageList = (taskId) => {
    taskService
      .getById(taskId)
      .then((res) => setStagesList(listToOptions(res.stage_items)));
  };

  useEffect(() => {
    fetchEpicsList();
  }, [formik.values.version_id]);

  useEffect(() => {
    const epicid = formik.values.epic_id;
    setTasksList([]);
    if (!epicid) return null;
    fetchTasksList(epicid);
  }, [formik.values.epic_id]);

  useEffect(() => {
    const taskId = formik.values.task_id;
    setStagesList([]);
    if (!taskId) return null;
    fetchStageList(taskId);
  }, [formik.values.task_id]);

  useEffect(() => {
    if (submitState) {
      formik.handleSubmit();
    }
    setSubmitState(false);
  }, [submitState]);

  return (
    <div className='CreateCard main card'>
      {/* <FSelect
        formik={formik}
        name="version_id"
        label="Version"
        options={versionsList}
      /> */}
      <FSelect
        formik={formik}
        name='epic_id'
        label='Epic'
        options={epicsList}
      />
      <FSelect
        formik={formik}
        name='task_id'
        label='Task'
        options={tasksList}
      />
      <FSelect
        formik={formik}
        name='stage_id'
        label='Stage'
        options={stagesList}
      />
      <FTextField
        multiline
        rows='3'
        fullWidth
        formik={formik}
        name='title'
        label='Title'
      />
    </div>
  );
};

export default CreateCard;
