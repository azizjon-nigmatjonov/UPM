import { CircularProgress, IconButton, Skeleton } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import { useFormik } from "formik"
import FTextField from "../../FormElements/FTextField"
import { useEffect } from "react"
import * as Yup from "yup"
import OutsideClickHandler from "react-outside-click-handler"

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
})

const CreateRow = ({
  onSubmit,
  loader,
  visible,
  btnLoader,
  setVisible = () => {},
  setLoader = () => {},
  initialTitle,
  placeholder = "",
  color = "primary",
}) => {
  const formik = useFormik({
    initialValues: {
      title: initialTitle || "",
    },
    // validationSchema,
    onSubmit,
  })
  useEffect(() => {
    if (visible) {
      setLoader(false)
    } else {
      formik.setFieldValue("title", initialTitle || "")
    }
  }, [visible])

  return (
    <OutsideClickHandler
      display="contents"
      onOutsideClick={() => setVisible(false)}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="CreateRow"
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
              inputProps={{
                style: { color: color === "primary" ? "#000" : "#fff" },
              }}
            />
            <IconButton color={color} onClick={formik.handleSubmit}>
              {btnLoader ? <CircularProgress size={14} /> : <SaveIcon />}
            </IconButton>
          </>
        )}
      </form>
    </OutsideClickHandler>
  )
}

export default CreateRow
