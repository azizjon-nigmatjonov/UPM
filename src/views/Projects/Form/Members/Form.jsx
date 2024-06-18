import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import positionsService from "../../../../services/positionsService"
import sphereService from "../../../../services/sphereService"
import userService from "../../../../services/userService"
import CancelButton from "../../../../components/Buttons/CancelButton"
import SaveButton from "../../../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../../../components/CBreadcrumbs"
import FormCard from "../../../../components/FormCard"
import FRow from "../../../../components/FormElements/FRow"
import Header from "../../../../components/Header"
import FSelect from "../../../../components/FormElements/FSelect"
import projectMembersService from "../../../../services/projectMembersService"

const MembersForm = () => {
  const { membersGroupId, projectId, memberId } = useParams()
  const navigate = useNavigate()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)
  const [usersList, setUsersList] = useState([])
  const [spheresList, setSpheresList] = useState([])
  const [positionsList, setPositionsList] = useState([])

  const breadCrumbItems = [
    {
      label: "Members",
    },
    {
      label: "Create",
    },
  ]

  const fetchUsersList = () => {
    userService.getList().then((res) => setUsersList(res.users?.map(el => ({
      value: el.id,
      label: el.name ?? el.email
    })) ?? []))
  }

  const fetchSpheresList = () => {
    sphereService.getList().then((res) => setSpheresList(res.spheres?.map(el => ({
      value: el.id,
      label: el.title
    })) ?? []))
  }

  const fetchPositonsList = () => {
    positionsService.getList().then((res) => setPositionsList(res.positions?.map(el => ({
      value: el.id,
      label: el.title
    })) ?? []))
  }

  const fetchData = () => {
    if (!memberId) return setLoader(false)
    projectMembersService
      .getById(memberId)
      .then((res) => {
        formik.setValues(res)
      })
      .finally(() => setLoader(false))
  }

  const onSubmit = (values) => {
    if (memberId) return update(values)
    create(values)
  }

  const create = (data) => {
    setBtnLoader(true)
    projectMembersService
      .create(data)
      .then((res) => {
        navigate(`/projects/${projectId}/members-group/${membersGroupId}/members`)
      })
      .finally(() => setBtnLoader(false))
  }

  const update = (data) => {
    setBtnLoader(true)
    projectMembersService
      .update({
        ...data,
        id: memberId,
      })
      .then((res) => {
        navigate(`/projects/${projectId}/members-group/${membersGroupId}/members`)
      })
      .finally(() => setBtnLoader(false))
  }

  const formik = useFormik({
    initialValues: {
      project_id: projectId,
      member_group_id: membersGroupId,
      position_id: "",
      sphere_id: "",
      user_id: "",
    },
    onSubmit,
  })

  useEffect(() => {
    fetchData()
    fetchUsersList()
    fetchPositonsList()
    fetchSpheresList()
  }, [])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Header
        loader={loader}
        extra={
          <>
            <CancelButton onClick={() => navigate(-1)} />
            <SaveButton type="submit" loading={btnLoader} />
          </>
        }
      >
        <CBreadcrumbs withDefautlIcon items={breadCrumbItems} />
      </Header>
      <FormCard visible={!loader} title="Main info">
        <FRow label="Sphere">
          <FSelect options={spheresList} fullWidth formik={formik} name="sphere_id" />
        </FRow>
        <FRow label="Position">
          <FSelect options={positionsList} fullWidth formik={formik} name="position_id" />
        </FRow>
        <FRow label="User">
          <FSelect options={usersList} fullWidth formik={formik} name="user_id" />
        </FRow>
      </FormCard>
    </form>
  )
}

export default MembersForm
