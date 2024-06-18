import { Button } from "@mui/material"
import { useFormik } from "formik"

import FTextField from "../../../components/FormElements/FTextField"


const EditCard = ({ subtask, onSubmit = () => {} }) => {

  const submitHandler = (val) => {

    onSubmit({
      ...subtask,
      ...val
    })
  }

  const formik = useFormik({
    initialValues: {
      title: subtask?.title ?? "",
    },
    onSubmit: submitHandler,
  })

  
  return <div className="CreateCard card">
    <form onSubmit={formik.handleSubmit} >
      <FTextField fullWidth formik={formik} name="title" label="Title" />
      
      <Button fullWidth type="submit" variant="contained" >SAVE</Button>
    </form>
  </div>
}

export default EditCard
