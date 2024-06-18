import "./style.scss";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import CBreadcrumbs from "../../../components/CBreadcrumbs";
import FormCard from "../../../components/FormCard";
import FDatePicker from "../../../components/FormElements/FDatePicker";
import FImageUpload from "../../../components/FormElements/FImageUpload";
import FRow from "../../../components/FormElements/FRow";
import FTextField from "../../../components/FormElements/FTextField";
import Header from "../../../components/Header";
import projectService from "../../../services/projectService";
import { useSelector } from "react-redux";

const ProjectCreateForm = () => {
  const { phaseId } = useParams();
  const userId = useSelector((state) => state.auth.userInfo.id);

  const navigate = useNavigate();

  const [btnLoader, setBtnLoader] = useState(false);

  const breadCrumbItems = [
    {
      label: "Projects",
    },
    {
      label: "Create",
    },
  ];

  const onSubmit = (values) => {
    create(values);
  };

  const create = (data) => {
    setBtnLoader(true);
    projectService
      .create(data)
      .then((res) => {
        navigate(`/projects`);
      })
      .finally(() => setBtnLoader(false));
  };
  const formik = useFormik({
    initialValues: {
      phase_id: phaseId ?? "",
      project_type_id: "89be05ed-d48e-4039-9544-4bcfb9e13c0f",
      creator_id: userId,
      logo: null,
      title: "",
      description: "",
      start_date: {
        expected: null,
      },
      end_date: {
        expected: null,
      },
    },
    onSubmit,
  });

  return (
    <div className="ProjectForm">
      <form onSubmit={formik.handleSubmit}>
        <Header
          extra={
            <>
              <CancelButton onClick={() => navigate(-1)} />
              <SaveButton type="submit" loading={btnLoader} />
            </>
          }
        >
          <CBreadcrumbs withDefautlIcon items={breadCrumbItems} />
        </Header>
        <FormCard visible={true} title="Main info">
          <FRow label="Logo">
            {/* <ImageUpload value={logo} onChange={setLogo} /> */}
            <FImageUpload formik={formik} name="logo" />
          </FRow>

          <FRow label="Title">
            <FTextField fullWidth formik={formik} name="title" />
          </FRow>

          <FRow label="Description">
            <FTextField
              multiline
              rows={4}
              fullWidth
              formik={formik}
              name="description"
            />
          </FRow>

          <FRow label="Start date">
            <FDatePicker
              width="100%"
              formik={formik}
              name="start_date.expected"
            />
          </FRow>

          <FRow label="End date">
            <FDatePicker
              width="100%"
              formik={formik}
              name="end_date.expected"
            />
          </FRow>
        </FormCard>
      </form>
    </div>
  );
};

export default ProjectCreateForm;
