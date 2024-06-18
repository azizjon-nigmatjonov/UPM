import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import * as Yup from "yup";
import "./style.scss";
// import { add } from "date-fns";
// import clientTypeService from "../../../services/clientTypeService";
// import listToOptions from "../../../utils/listToOptions";
import userService from "../../../services/userService";
import Header from "../../../components/Header";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
// import CBreadcrumbs from "../../../components/CBreadcrumbs";
import FormCard from "../../../components/FormCard";
// import FAvatarUpload from "../../../components/FormElements/FAvatarUpload";
import FRow from "../../../components/FormElements/FRow";
import FTextField from "../../../components/FormElements/FTextField";
import FDatePicker from "../../../components/FormElements/FDatePicker";
import FSelect from "../../../components/FormElements/FSelect";
import operationTypeService from "../../../services/oparetionService";
import paymentService from "../../../services/paymentService";
import currencyService from "../../../services/currencyService";
import financeService from "../../../services/financeService";

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   email: Yup.string().required('Email is required').email('Email is incorrect'),
//   login: Yup.string().required('Login is required'),
//   phone: Yup.string().required('Phone is required'),
//   expires_at: Yup.mixed().required('Expires date is required'),
//   client_type_id: Yup.mixed().required('Type is required'),
//   role_id: Yup.mixed().required('Role is required')
// })

// const passwordValidation = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   email: Yup.string().required('Email is required').email('Email is incorrect'),
//   login: Yup.string().required('Login is required'),
//   phone: Yup.string().required('Phone is required'),
//   expires_at: Yup.mixed().required('Expires date is required'),
//   client_type_id: Yup.mixed().required('Type is required'),
//   role_id: Yup.mixed().required('Role is required'),
//   password: Yup.string().required('Password is required').min(6, "The password length must be at least 6")
// })

const PaymentForm = () => {
  const { projectId, financeId } = useParams();
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState(true);
  const [operationTypeList, setOperationTypeList] = useState([]);
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  function dateFormat(d) {
    const date = new Date(d);
    const month =
      date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
  }
  const fetchOperationTypeList = () => {
    operationTypeService.getList().then((res) => {
      setOperationTypeList(
        res.operation_types.map((el) => ({
          value: el.id,
          label: el.title,
        }))
      );
    });
  };
  const fetchPaymentTypeList = () => {
    paymentService.getPaymentTypeList().then((res) => {
      setPaymentTypeList(
        res.items.map((el) => ({
          value: el.id,
          label: el.title,
        }))
      );
    });
  };
  const fetchCurrencyList = () => {
    currencyService.getList().then((res) => {
      setCurrencyList(
        res.items.map((el) => ({
          value: el.id,
          label: el.code,
        }))
      );
    });
  };

  const fetchData = () => {
    if (!financeId) return setLoader(false);

    financeService
      .getById(financeId)
      .then((res) => {
        formik.setValues({
          ...formik.values,
          ...res,
        });
      })
      .finally(() => setLoader(false));
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      price: String(values.price),
      currency_value: String(values.currency_value),
    }
    if (financeId) return update(data);
    create(data);
  };

  const create = (data) => {
    const payment_date = dateFormat(data.payment_date);
    setBtnLoader(true);
    financeService
      .create({ ...data, payment_date })
      .then((res) => {
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const update = (data) => {
    setBtnLoader(true);
    financeService
      .update(data)
      .then((res) => {
        navigate(`/projects/${projectId}/payment`);
      })
      .catch(() => setBtnLoader(false));
  };

  const formik = useFormik({
    initialValues: {
      operation_type_id: "",
      currency_type_id: "",
      currency_value: "",
      payment_date: "",
      payment_type_id: "",
      price: "",
      project_id: projectId,
    },
    onSubmit,
  });

  useEffect(() => {
    fetchData();
    fetchCurrencyList();
    fetchOperationTypeList();
    fetchPaymentTypeList();
  }, []);

  // useEffect(() => {
  //   if (!formik.values.client_type_id) return null;
  // }, [formik.values.client_type_id]);

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
      ></Header>

      <FormCard visible={!loader} title="Создание операции">
        <div className="side">
          <FRow label="Дата">
            <FDatePicker
              fullWidth
              formik={formik}
              autoFocus
              width="100%"
              name="payment_date"
            />
          </FRow>

          <FRow label="Тип операции">
            <FSelect
              fullWidth
              formik={formik}
              options={operationTypeList}
              name="operation_type_id"
            />
          </FRow>
          <FRow label="Тип оплаты">
            <FSelect
              fullWidth
              formik={formik}
              options={paymentTypeList}
              name="payment_type_id"
            />
          </FRow>

          <FRow label="Валюта">
            <FSelect
              fullWidth
              formik={formik}
              options={currencyList}
              name="currency_type_id"
            />
          </FRow>

          <FRow label="Курс валюты">
            <FTextField
              text={true}
              fullWidth
              formik={formik}
              type="number"
              name="currency_value"
            />
          </FRow>

          <FRow label="Сумма">
            <FTextField fullWidth formik={formik} type="number" name="price" />
          </FRow>

          <FRow label="Коментарий">
            <FTextField
              fullWidth
              formik={formik}
              name="comment"
              placeholder="Enter comment"
            />
          </FRow>
        </div>
      </FormCard>
    </form>
  );
};

export default PaymentForm;
