import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import CancelButton from "../../components/Buttons/CancelButton"
import SaveButton from "../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../components/CBreadcrumbs"
import FormCard from "../../components/FormCard"
import FRow from "../../components/FormElements/FRow"
import FTextField from "../../components/FormElements/FTextField"
import Header from "../../components/Header"
import sphereService from "../../services/sphereService"

const SpheresForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)


  const breadCrumbItems = [
    {
      label: 'Spheres',
    },
    {
      label: 'Create'
    }
  ]


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    if (!id) return setLoader(false)

    sphereService
      .getById(id)
      .then((res) => {
        formik.setFieldValue("title", res.title)
        formik.setFieldValue("description", res.description)
      })
      .finally(() => setLoader(false))
  }


  const onSubmit = (values) => {
    if (id) return update(values)
    create(values)
  }

  const create = (data) => {
    setBtnLoader(true)
    sphereService
      .create(data)
      .then((res) => {
        navigate(`/settings/spheres`)
      })
      .finally(() => setBtnLoader(false))
  }

  const update = (data) => {
    setBtnLoader(true)
    sphereService
      .update({
        ...data,
        id
      })
      .then((res) => {
        navigate(`/settings/spheres`)
      })
      .finally(() => setBtnLoader(false))
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      description: ""
    },
    onSubmit
  })

  return (
    <form onSubmit={formik.handleSubmit} >
      <Header
        loader={loader}
        extra={
          <>
            <CancelButton onClick={() => navigate(-1)} />
            <SaveButton type="submit" loading={btnLoader}  />
          </>
        }
      >
        <CBreadcrumbs withDefautlIcon items={breadCrumbItems} />
      </Header>
      <FormCard visible={!loader} title="Main info">
       
        <FRow label="Title">
          <FTextField fullWidth formik={formik} name="title" />
        </FRow>

        <FRow label="Description">
          <FTextField multiline rows={4} fullWidth formik={formik} name="description" />
        </FRow>

      </FormCard>
    </form>
  )
}

export default SpheresForm
