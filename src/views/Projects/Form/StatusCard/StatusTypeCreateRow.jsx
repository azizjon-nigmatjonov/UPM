import { CircularProgress, IconButton, Skeleton } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import { useFormik } from "formik"
import FTextField from "../../../../components/FormElements/FTextField"
import { useEffect } from "react"
import * as Yup from "yup"
import OutsideClickHandler from "react-outside-click-handler"
import "./style.scss"
import FSelect from "../../../../components/FormElements/FSelect"
import { statusStates } from "../../../../utils/statusStates"

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
})

const StatusTypeCreateRow = ({
  onSubmit,
  loader,
  visible,
  btnLoader,
  setVisible = () => {},
  setLoader = () => {},
  initialValues,
}) => {
  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || "",
      state: initialValues?.state || 0
    },
    // validationSchema,
    onSubmit,
  })

  useEffect(() => {
    if (visible) {
      setLoader(false)
    } else {
      formik.setFieldValue("title", initialValues?.title || "")
      formik.setFieldValue("state", initialValues?.state || 0)
    }
  }, [visible])

  return (
      <form
        onSubmit={formik.handleSubmit}
        className="StatusTypeCreateRow"
        style={{ width: "100%" }}
      >
        {loader ? (
          <Skeleton variant="text" style={{ width: "100%" }} />
        ) : (
          <>
            <FTextField
              onClick={(e) => e.stopPropagation()}
              fullWidth
              formik={formik}
              name="title"
              disabledHelperText
              inputRef={(input) => input && visible && input.focus()}
            />
            <FSelect
              onClick={(e) => e.stopPropagation()}
              fullWidth
              formik={formik}
              options={statusStates}
              name="state"
              disabledHelperText
            />
            <IconButton color="primary" onClick={formik.handleSubmit}>
              {btnLoader ? <CircularProgress size={14} /> : <SaveIcon />}
            </IconButton>
          </>
        )}
      </form>
  )
}

export default StatusTypeCreateRow
