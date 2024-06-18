import { Button, Skeleton } from "@mui/material"
import { useFormik } from "formik"
import FTextField from "../../../../components/FormElements/FTextField"
import { useEffect, useState } from "react"
import * as Yup from 'yup'
import FRangePicker from "../../../../components/FormElements/FRangePicker"
import WeekPicker from "./WeekPicker.jsx";
import { add, differenceInWeeks, endOfWeek, getDate, getMonth, startOfWeek, format } from "date-fns";

const validationSchema = Yup.object().shape({
  title: Yup.string().required()
})

const SprintCreateRow = ({ onSubmit, loader, visible, setLoader = () => {}, initialDate, btnText="CREATE" }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const formik = useFormik({
    initialValues: {
      date: [null, null]
    },
    // validationSchema,
    onSubmit,
  })
  
  useEffect(() => {
    if (visible) {
      setLoader(false)
    }
    else {
      // formik.setFieldValue('date', initialDate || [null, null])
    }
  }, [visible])


  return (
    <form onClick={e => e.stopPropagation()} autoComplete="off" onSubmit={formik.handleSubmit} className="row" style={{ width: '100%' }} >
      {loader ? (
        <Skeleton variant="text" style={{ width: "100%" }} />
      ) : (
        <div style={{ width: '100%' }} >
          {/* <div className="form-row">
            <FTextField
              fullWidth
              formik={formik}
              name="title"
              disabledHelperText
              inputRef={input => input && visible && input.focus()}
            />
          </div> */}

          <div className="form-row">
            {/* <FRangePicker label='asd' formik={formik} name="date" /> */}
            <WeekPicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} formik={formik}/>
          </div>

          <div className="form-row">
            <Button type="submit" variant="contained" size="large" fullWidth >{ btnText }</Button>
          </div>

          {/* <IconButton color="primary" onClick={formik.handleSubmit}>
            <SaveIcon />
          </IconButton> */}
        </div>
      )}
    </form>
  )
}

export default SprintCreateRow
