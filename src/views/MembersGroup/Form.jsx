

import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CancelButton from "../../components/Buttons/CancelButton"
import SaveButton from "../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../components/CBreadcrumbs"
import FormCard from "../../components/FormCard"
import FRow from "../../components/FormElements/FRow"
import FTextField from "../../components/FormElements/FTextField"
import Header from "../../components/Header"
import projectMembersGroupService from "../../services/projectMembersGroupService"
import sphereService from "../../services/sphereService"

const MembersGroupForm = () => {
  const { membersGroupId, projectId } = useParams()
  const navigate = useNavigate()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)


  const breadCrumbItems = [
    {
      label: 'Members group',
    },
    {
      label: 'Create'
    }
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    if (!membersGroupId) return setLoader(false)

    projectMembersGroupService
      .getById(membersGroupId)
      .then((res) => {
        formik.setValues(res)
      })
      .finally(() => setLoader(false))
  }

  const onSubmit = (values) => {
    if (membersGroupId) return update(values)
    create(values)
  }

  const create = (data) => {
    setBtnLoader(true)
    projectMembersGroupService
      .create(data)
      .then((res) => {
        navigate(`/projects/${projectId}/members-group`)
      })
      .finally(() => setBtnLoader(false))
  }

  const update = (data) => {
    setBtnLoader(true)
    projectMembersGroupService
      .update({
        ...data,
        id: membersGroupId
      })
      .then((res) => {
        navigate(`/projects/${projectId}/members-group`)
      })
      .finally(() => setBtnLoader(false))
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      project_id: projectId
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

export default MembersGroupForm
