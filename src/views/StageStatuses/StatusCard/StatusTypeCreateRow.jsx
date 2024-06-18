import { CircularProgress, IconButton, Skeleton } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import { useFormik } from "formik"
import { useEffect } from "react"
import "./style.scss"
import { statusStates } from "../../../utils/statusStates"
import FTextField from "../../../components/FormElements/FTextField"
import FSelect from "../../../components/FormElements/FSelect"

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
      state: initialValues?.state || 0,
    },
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
