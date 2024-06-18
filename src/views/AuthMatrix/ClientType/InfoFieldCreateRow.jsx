import { Button, Skeleton } from "@mui/material"
import { useFormik } from "formik"
import FTextField from "../../../components/FormElements/FTextField"
import { useEffect } from "react"
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  title: Yup.string().required()
})

const InfoFieldCreateRow = ({ onSubmit, loader, visible, setLoader = () => {}, initialValues, btnText="CREATE" }) => {

  const formik = useFormik({
    initialValues: {
      data_type: '',
      field_name: '',
      field_type: ''
    },
    onSubmit,
  })
  
  useEffect(() => {
    if (visible) {
      setLoader(false)
    }
    else {
      formik.setFieldValue('data_type', initialValues?.data_type || '')
      formik.setFieldValue('field_name', initialValues?.field_name || '')
      formik.setFieldValue('field_type', initialValues?.field_type || '')
    }
  }, [visible])

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit} className="row" style={{ width: '100%' }} >
      {loader ? (
        <Skeleton variant="text" style={{ width: "100%" }} />
      ) : (
        <div style={{ width: '100%' }} >
          <div className="form-row">
            <FTextField
              fullWidth
              formik={formik}
              name="field_name"
              label="Name"
              disabledHelperText
              // inputRef={input => input && visible && input.focus()}
            />
          </div>
          <div className="form-row">
            <FTextField
              fullWidth
              formik={formik}
              name="data_type"
              label="Data type"
              disabledHelperText
            />
          </div>

          <div className="form-row">
            <FTextField
              fullWidth
              formik={formik}
              name="field_type"
              label="Field type"
              disabledHelperText
            />
          </div>

          <div className="form-row">
            <Button type="submit" variant="contained" size="large" fullWidth >{ btnText }</Button>
          </div>
        </div>
      )}
    </form>
  )
}

export default InfoFieldCreateRow
