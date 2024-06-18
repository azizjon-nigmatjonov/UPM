import { Button, Skeleton } from "@mui/material"
import { useFormik } from "formik"
import FTextField from "../../../components/FormElements/FTextField"
import { useEffect, useMemo } from "react"
import * as Yup from 'yup'
import { RELATION_TYPES } from "../../../constans/authMatrixConsts"
import FSelect from "../../../components/FormElements/FSelect"

const validationSchema = Yup.object().shape({
  title: Yup.string().required()
})

const RelationCreateRow = ({ onSubmit, loader, visible, setLoader = () => {}, initialValues, btnText="CREATE" }) => {

  const formik = useFormik({
    initialValues: {
      description: '',
      name: '',
      type: 0
    },
    onSubmit,
  })
  
  useEffect(() => {
    if (visible) {
      setLoader(false)
    }
    else {
      formik.setFieldValue('description', initialValues?.description || '')
      formik.setFieldValue('name', initialValues?.name || '')
      formik.setFieldValue('type', initialValues?.type || '')
    }
  }, [visible])

  const computedRelationTypes = useMemo(() => {
    return RELATION_TYPES.map((type, index) => ({
      label: type,
      value: index
    }))
  }, [])

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
              name="name"
              label="Name"
              disabledHelperText
              // inputRef={input => input && visible && input.focus()}
            />
          </div>

          <div className="form-row">
            <FTextField
              fullWidth
              formik={formik}
              name="description"
              label="Description"
              disabledHelperText
              multiline
              rows={4}
            />
          </div>

          {/* <div className="form-row"> */}
            <FSelect
              fullWidth
              formik={formik}
              options={computedRelationTypes}
              name="type"
              label="Type"
            />
          {/* </div> */}

          <div className="form-row">
            <Button type="submit" variant="contained" size="large" fullWidth >{ btnText }</Button>
          </div>
        </div>
      )}
    </form>
  )
}

export default RelationCreateRow
