import React, { useState, useEffect } from 'react'
import { DatePicker, LocalizationProvider } from "@mui/lab"
import { TextField } from "@mui/material"
import { get } from 'lodash-es'
import { enGB } from "date-fns/locale"
import AdapterDateFns from "@mui/lab/AdapterDateFns"

const FDatePicker = ({formik, name, label, width, inputProps, ...props}) => {
  const [open, setOpen] = useState(false)
  // const getValidDate = (date) => {
  //   // const formatDate = format(new Date(date), 'dd-MM-yyyy')
  //   let valid = '' 
  //       const initial = date ?  date?.split('-') : null
  //       if(initial){
  //        valid = `${initial[1]}-${initial[0]}-${initial[2]}`
  //       }
  //       return valid  ? new Date(valid) : ""
  // }
  
  // useEffect(() => {
  //   getValidDate()
  // }, [formik.values])
  
  // useEffect(() => {
  //   getValidDate()
  // }, [formik.values])
  return (
    <LocalizationProvider locale={enGB} dateAdapter={AdapterDateFns}>
      <DatePicker
        inputFormat="dd-MM-yyyy"
        onClose={() => setOpen(false)}
        open={open}
        mask="__.__.____"
        toolbarFormat="dd-MM-yyyy"
        value={get(formik.values, name)}
        name={name}
        onChange={value => {
          formik.setFieldValue(name, value)
          setOpen(false)
        }}
        {...props}
        renderInput={(params) => (
          <TextField 
            {...params}
            style={{ width }}
            size="small"
            onClick={() => setOpen(true)}
            error={get(formik.touched, name)&& Boolean(get(formik.errors, name))}
            helperText={(get(formik.touched, name) && get(formik.errors, name)) ?? " "}
            {...inputProps}
            label={label}
          />
        )}
      />
    </LocalizationProvider>
  )
}

export default FDatePicker
