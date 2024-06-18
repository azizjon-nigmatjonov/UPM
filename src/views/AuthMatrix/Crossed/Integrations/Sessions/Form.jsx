import { Card, Typography } from "@mui/material"
import { add } from "date-fns"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import CreateButton from "../../../../../components/Buttons/CreateButton"
import FTextField from "../../../../../components/FormElements/FTextField"
import integrationService from "../../../../../services/integrationService"

const SessionCreateForm = ({ addSession }) => {
  const { integrationId } = useParams()
  const [loader, setLoader] = useState(false)

  const onSubmit = (values) => {
    setLoader(true)

    const data = {
      ...values,
      data: JSON.stringify({ title: values.title })
    }
    // session
    integrationService
      .createNewSession(integrationId, data)
      .then((res) => {
        addSession({
          ...res.session,
          data: res.session?.data ? JSON.parse(res.session.data) : {}
        })
        formik.setFieldValue('title', '')
      })
      .finally(() => setLoader(false))
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      expires_at: add(new Date(), { years: 1 }),
      integration_id: integrationId,
      secret_key: "",
    },
    onSubmit,
  })

  const getIntegrationData = async () => {
    try {
      const res = await integrationService.getById(integrationId)

      formik.setFieldValue("secret_key", res.secret_key)
    } catch (error) {}
  }

  useEffect(() => {
    getIntegrationData()
  }, [])

  return (
    <Card className="SessionCreateForm p-2">
      <Typography className="title" variant="h5">
        Create new sessions
      </Typography>

      <form className="form" onSubmit={formik.handleSubmit}>
        <FTextField
          autoFocus
          disabledHelperText
          fullWidth
          formik={formik}
          name="title"
          label="Title"
        />

        <CreateButton type="submit" loading={loader} />
      </form>
    </Card>
  )
}

export default SessionCreateForm
