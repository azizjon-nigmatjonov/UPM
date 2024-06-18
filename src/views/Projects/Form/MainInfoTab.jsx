import "./style.scss";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SaveButton from "../../../components/Buttons/SaveButton";
import FormCard from "../../../components/FormCard";
import FImageUpload from "../../../components/FormElements/FImageUpload";
import FRow from "../../../components/FormElements/FRow";
import FSelect from "../../../components/FormElements/FSelect";
import FTextField from "../../../components/FormElements/FTextField";
import projectService from "../../../services/projectService";
import StatusCard from "./StatusCard";
import { useDispatch } from "react-redux";
import { projectActions } from "../../../redux/slices/project.slice";
import { showAlert } from "../../../redux/thunks/alert.thunk";
import MembersGroupCard from "./MembersGroupCard";
import StagesCard from "./StagesCard";
import { fetchProjectTypeList } from "../../../redux/thunks/project.thunk";
import versionsService from "../../../services/versionsService";
import FSwitch from "../../../components/FormElements/FSwitch";
import StandupCard from "./StandupCard";

const MainInfoTab = () => {
  const { projectId } = useParams();

  const dispatch = useDispatch();

  const phasesList = useSelector((state) => state.phase.phases);
  const projectTypeList = useSelector(
    (state) => state.project_types.project_types
  );
  const projectiInfo = useSelector((state) => state.project.info);
  const userId = useSelector((state) => state.auth.userInfo.id);

  const [versionsList, setVersionsList] = useState([]);
  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState(false);

  const computedPhasesList = useMemo(() => {
    return phasesList.map((phase) => ({
      label: phase.title,
      value: phase.id,
    }));
  }, [phasesList]);

  const computedProjectTypesList = useMemo(() => {
    return projectTypeList?.map((projectTypes) => ({
      label: projectTypes?.title,
      value: projectTypes?.id,
    }));
  }, [projectTypeList]);

  useEffect(() => {
    if (!projectiInfo) return null;
    formik.setValues(projectiInfo);
  }, [projectiInfo]);

  const onSubmit = (values) => {
    return update(values);
  };

  const update = (data) => {
    setBtnLoader(true);
    projectService
      .update({
        ...data,
        projectId,
      })
      .then((res) => {
        dispatch(
          showAlert(
            "Project information has been successfully updated",
            "success"
          )
        );
        dispatch(projectActions.setInfo(res));
      })
      .finally(() => setBtnLoader(false));
  };

  const formik = useFormik({
    initialValues: {
      active: true,
      phase_id: "",
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
      project_type_id: computedProjectTypesList[0],
    },
    onSubmit,
  });

  const versionFormik = useFormik({
    initialValues: {
      id: null,
      title: "",
      project_id: projectId,
      main: 1,
    },
    onSubmit: (values) => {
      updateVersion(values);
    },
  });

  const getVersions = () => {
    versionsService
      .getListInProject(projectId)
      .then((res) => {
        setVersionsList(res?.versions);
        versionFormik.setFieldValue(
          "id",
          res?.versions?.filter((version) => version?.main === 1)[0]?.id
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateVersion = (data) => {
    versionsService.update(data).then((res) => {
      getVersions();
    });
  };
  const computedVersionsList = useMemo(() => {
    return versionsList?.map((version) => ({
      label: version?.title,
      value: version?.id,
    }));
  }, [versionsList]);

  useEffect(() => {
    getVersions();
    dispatch(fetchProjectTypeList());
  }, []);

  const updateActive = (active) => {
    projectService.updateActive(projectId, active);
  };

  return (
    <div className="MainInfoTab">
      <div className="side" style={{ width: "58%" }}>
        <form onSubmit={formik.handleSubmit}>
          <FormCard visible={true} title="Main info">
            <div className="main-info-form">
              <div className="logo-side">
                <FRow label="Logo" position="vertical">
                  <FImageUpload
                    formik={formik}
                    name="logo"
                    className="logo-block"
                  />
                </FRow>
              </div>
              <div className="form-side">
                <FRow
                  label="Active"
                  labelStyle={{
                    transform: "translateY(0)",
                    fontWeight: "bold",
                  }}
                  style={{ alignItems: "center" }}
                >
                  <FSwitch
                    containerStyle={{ display: "flex", justifyContent: "end" }}
                    formik={formik}
                    name="active"
                    onChange={(e, val) => {
                      formik.setFieldValue("active", val);
                      updateActive(val);
                    }}
                  />
                </FRow>
                <FRow label="Title" position="vertical">
                  <FTextField fullWidth formik={formik} name="title" />
                </FRow>

                <FRow label="Description" position="vertical">
                  <FTextField
                    multiline
                    rows={4}
                    fullWidth
                    formik={formik}
                    name="description"
                  />
                </FRow>

                <FRow label="Phase" position="vertical">
                  <FSelect
                    width="100%"
                    options={computedPhasesList}
                    formik={formik}
                    name="phase_id"
                  />
                </FRow>
                <FRow label="Project type" position="vertical">
                  <FSelect
                    width="100%"
                    options={computedProjectTypesList}
                    formik={formik}
                    name="project_type_id"
                  />
                </FRow>
                <FRow label="Project version" position="vertical">
                  <FSelect
                    width="100%"
                    options={computedVersionsList}
                    formik={versionFormik}
                    name="id"
                    onChange={(e) => {
                      versionFormik.setFieldValue(
                        "title",
                        versionsList?.find((version) => version?.id === e)
                          ?.title
                      );
                      versionFormik.handleSubmit();
                    }}
                  />
                </FRow>
              </div>
            </div>

            <div className="btns-row">
              <SaveButton loading={btnLoader} type="submit" />
            </div>
          </FormCard>
        </form>

        {!loader && <StatusCard />}
      </div>

      <div style={{ width: "42%" }}>
        <StagesCard />
        <MembersGroupCard />
        <StandupCard />
      </div>
    </div>
  );
};

export default MainInfoTab;
