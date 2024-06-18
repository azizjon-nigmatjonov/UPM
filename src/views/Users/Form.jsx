import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CancelButton from "../../components/Buttons/CancelButton";
import SaveButton from "../../components/Buttons/SaveButton";
import CBreadcrumbs from "../../components/CBreadcrumbs";
import FormCard from "../../components/FormCard";
import FAvatarUpload from "../../components/FormElements/FAvatarUpload";
import FDatePicker from "../../components/FormElements/FDatePicker";
import FRow from "../../components/FormElements/FRow";
import FSelect from "../../components/FormElements/FSelect";
import FTextField from "../../components/FormElements/FTextField";
import Header from "../../components/Header";
import authPlatformConfig from "../../configs/authPlatform.config";
import clientTypeService from "../../services/clientTypeService";
import userService from "../../services/userService";
import listToOptions from "../../utils/listToOptions";
import * as Yup from "yup";
import "./style.scss";
import { add } from "date-fns";
import FSwitch from "../../components/FormElements/FSwitch";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email("Email is incorrect"),
  login: Yup.string().required("Login is required"),
  phone: Yup.string().required("Phone is required"),
  expires_at: Yup.mixed().required("Expires date is required"),
  client_type_id: Yup.mixed().required("Type is required"),
  role_id: Yup.mixed().required("Role is required"),
});

const passwordValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email("Email is incorrect"),
  login: Yup.string().required("Login is required"),
  phone: Yup.string().required("Phone is required"),
  expires_at: Yup.mixed().required("Expires date is required"),
  client_type_id: Yup.mixed().required("Type is required"),
  role_id: Yup.mixed().required("Role is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "The password length must be at least 6"),
});

const UsersForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [userTypesList, setUserTypesList] = useState([]);
  const [userActive, setUserActive] = useState(false);

  const breadCrumbItems = [
    {
      label: "Users",
      link: "/settings/users",
    },
    {
      label: "Create",
    },
  ];

  const fetchUserTypesList = () => {
    clientTypeService
      .getList()
      .then((res) => setUserTypesList(listToOptions(res.client_types, "name")));
  };

  const fetchRolesList = () => {
    setRolesList([]);
    clientTypeService
      .getById(formik.values.client_type_id)
      .then((res) => setRolesList(listToOptions(res.roles, "name")));
  };

  const fetchData = () => {
    if (!id) return setLoader(false);

    userService
      .getById(id)
      .then((res) => {
        setUserActive(res?.active);
        formik.setValues({
          ...formik.values,
          ...res,
        });
      })
      .finally(() => setLoader(false));
  };

  const onSubmit = (values) => {
    values.active = userActive;
    if (id) return update(values);
    create(values);
  };

  const create = (data) => {
    setBtnLoader(true);
    userService
      .create(data)
      .then((res) => {
        navigate(`/settings/users`);
      })
      .catch(() => setBtnLoader(false));
  };

  const update = (data) => {
    setBtnLoader(true);
    userService
      .update(data)
      .then((res) => {
        navigate(`/settings/users`);
      })
      .catch(() => setBtnLoader(false));
  };

  const formik = useFormik({
    initialValues: {
      client_platform_id: authPlatformConfig.platformID,
      project_id: authPlatformConfig.projectID,
      client_type_id: "",
      active: false,
      name: "",
      email: "",
      login: "",
      password: "",
      phone: "",
      expires_at: add(new Date(), { years: 1 }),
      photo_url: "",
      role_id: "",
    },
    validationSchema: id ? validationSchema : passwordValidation,
    onSubmit,
  });

  useEffect(() => {
    fetchData();
    fetchUserTypesList();
  }, []);

  useEffect(() => {
    if (!formik.values.client_type_id) return null;
    fetchRolesList();
  }, [formik.values.client_type_id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Header
        loader={loader}
        extra={
          <>
            <CancelButton onClick={() => navigate(-1)} />
            <SaveButton type="submit" loading={btnLoader} />
          </>
        }
      >
        <CBreadcrumbs withDefautlIcon items={breadCrumbItems} type="link" />
      </Header>

      <FormCard visible={!loader} title="Main info" className="UsersForm">
        <div>
          <FAvatarUpload formik={formik} name="photo_url" />
        </div>

        <div className="side">
          <FRow label={"Status"}>
            <FSwitch
              fullWidth
              formik={formik}
              // name="active"
              checked={userActive > 0 ? true : false}
              onChange={(e, val) => setUserActive(val ? 1 : -1)}
              containerStyle={{
                display: "flex",
                justifyContent: "flex-start",
                transform: "translateY(-30%)",
              }}
            />
          </FRow>
          <FRow label="Fullname">
            <FTextField
              placeholder="Enter fullname"
              fullWidth
              formik={formik}
              autoFocus
              name="name"
            />
          </FRow>

          <FRow label="Email">
            <FTextField
              placeholder="Enter email"
              fullWidth
              formik={formik}
              name="email"
            />
          </FRow>

          <FRow label="Phone">
            <FTextField
              placeholder="Enter phone"
              fullWidth
              formik={formik}
              name="phone"
            />
          </FRow>

          <FRow label="Login">
            <FTextField
              placeholder="Enter login"
              fullWidth
              formik={formik}
              name="login"
            />
          </FRow>

          {!id && (
            <FRow label="Password">
              <FTextField
                type="password"
                fullWidth
                formik={formik}
                name="password"
                placeholder="Enter password"
              />
            </FRow>
          )}

          <FRow label="Expires date">
            <FDatePicker width="100%" formik={formik} name="expires_at" />
          </FRow>

          <FRow label="Type">
            <FSelect
              options={userTypesList}
              fullWidth
              formik={formik}
              onChange={() => formik.setFieldValue("role_id", "")}
              name="client_type_id"
            />
          </FRow>

          <FRow label="Role">
            <FSelect
              options={rolesList}
              fullWidth
              formik={formik}
              name="role_id"
            />
          </FRow>
        </div>
      </FormCard>
    </form>
  );
};

export default UsersForm;
