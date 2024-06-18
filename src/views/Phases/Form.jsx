import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import CancelButton from "../../components/Buttons/CancelButton"
import SaveButton from "../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../components/CBreadcrumbs"
import FormCard from "../../components/FormCard"
import FRow from "../../components/FormElements/FRow"
import FTextField from "../../components/FormElements/FTextField"
import Header from "../../components/Header"
import { phaseActions } from "../../redux/slices/phase.slice"
import phaseService from "../../services/phaseService"

const PhasesForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)


  const breadCrumbItems = [
    {
      label: 'Phases',
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

    phaseService
      .getById(id)
      .then((res) => {
        formik.setFieldValue("title", res.title)
      })
      .finally(() => setLoader(false))
  }

  const onSubmit = (values) => {
    if (id) return update(values)
    create(values)
  }

  const create = (data) => {
    setBtnLoader(true)
    phaseService
      .create(data)
      .then((res) => {
        navigate(`/settings/phases`)
        dispatch(phaseActions.addPhase(res))
      })
      .finally(() => setBtnLoader(false))
  }

  const update = (data) => {
    setBtnLoader(true)
    phaseService
      .update({
        ...data,
        id
      })
      .then((res) => {
        navigate(`/settings/phases`)
        dispatch(phaseActions.updatePhase({
          ...data,
          id
        }))
      })
      .finally(() => setBtnLoader(false))
  }

  const formik = useFormik({
    initialValues: {
      title: ""
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

      </FormCard>
    </form>
  )
}

export default PhasesForm
