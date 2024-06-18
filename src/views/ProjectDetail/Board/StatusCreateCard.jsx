import { Button } from "@mui/material"
import { useFormik } from "formik"
import { useParams } from "react-router-dom"
import FCheckbox from "../../../components/FormElements/FCheckbox"
import FTextField from "../../../components/FormElements/FTextField"

const StatusCreateCard = ({ onSubmit }) => {
  const { projectId } = useParams()

  const submitHandler = (val) => {
    onSubmit({
      ...val,
      state: val.state ? 1 : 0
    })
  }

  const formik = useFormik({
    initialValues: {
      project_id: projectId,
      state: false,
      title: "",
    },
    onSubmit: submitHandler,
  })

  return (
    <div className="StatusCreateCard card">
      <form onSubmit={formik.handleSubmit}>
        <FTextField fullWidth formik={formik} name="title" label="Title" />

        <FCheckbox formik={formik} name="state" label='State' />

        <Button fullWidth type="submit" variant="contained">
          SAVE
        </Button>
      </form>
    </div>
  )
}

export default StatusCreateCard
