import { add } from "date-fns/esm"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import CancelButton from "../../../../components/Buttons/CancelButton"
import SaveButton from "../../../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../../../components/CBreadcrumbs"
import FormCard from "../../../../components/FormCard"
import FDatePicker from "../../../../components/FormElements/FDatePicker"
import FRow from "../../../../components/FormElements/FRow"
import FSelect from "../../../../components/FormElements/FSelect"
import FTextField from "../../../../components/FormElements/FTextField"
import Header from "../../../../components/Header"
import { phaseActions } from "../../../../redux/slices/phase.slice"
import integrationService from "../../../../services/integrationService"
import roleService from "../../../../services/roleService"
import { generateSecretKey } from "../../../../utils/generateSecretKey"
import listToOptions from "../../../../utils/listToOptions"
import "./style.scss"

const IntegrationsForm = () => {
  const { platformId, typeId, integrationId, projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)
  const [rolesList, setRolesList] = useState([])

  const breadCrumbItems = [
    {
      label: "Integrations",
    },
    {
      label: "Create",
    },
  ]

  const fetchRolesList = () => {
    setRolesList([])
    roleService
      .getList({
        "client-platform-id": platformId,
        "client-type-id": typeId,
      })
      .then((res) => setRolesList(listToOptions(res.roles, "name")))
  }

  const fetchData = () => {
    if (!integrationId) return setLoader(false)

    integrationService
      .getById(integrationId)
      .then((res) => {
        formik.setValues(res)
        // setSelectedPermissions(res.permissions?.map((permission) => permission.id) ?? [])
      })
      .finally(() => setLoader(false))
  }

  const create = (data) => {
    setBtnLoader(true)
    integrationService
      .create(data)
      .then((res) => {
        navigate(
          `/settings/auth-matrix/${projectId}/${platformId}/${typeId}/crossed`
        )
        dispatch(phaseActions.addPhase(res))
      })
      .finally(() => setBtnLoader(false))
  }

  const update = async (data) => {
    setBtnLoader(true)
    try {
      await integrationService.update({
        ...data,
        id: integrationId,
      })

      navigate(
        `/settings/auth-matrix/${projectId}/${platformId}/${typeId}/crossed`
      )
    } finally {
      setBtnLoader(false)
    }
  }

  const onSubmit = (values) => {
    if (integrationId) return update(values)
    create(values)
  }

  useEffect(() => {
    fetchData()
    fetchRolesList()
  }, [])

  const formik = useFormik({
    initialValues: {
      active: 1,
      client_platform_id: platformId,
      client_type_id: typeId,
      project_id: projectId,
      title: "",
      expires_at: add(new Date(), { months: 6 }),
      ip_whitelist: "",
      role_id: "",
      secret_key: generateSecretKey(),
    },
    onSubmit,
  })

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

      <div className="IntegrationsForm">
        <FormCard visible={!loader} title="Main info" className="form-card">
          <div className="side">
            <FRow label="Title">
              <FTextField autoFocus fullWidth formik={formik} name="title" />
            </FRow>
            <FRow label="Role">
              <FSelect
                options={rolesList}
                fullWidth
                formik={formik}
                name="role_id"
              />
            </FRow>
            <FRow label="Secret key">
              <FTextField fullWidth formik={formik} name="secret_key" />
            </FRow>
          </div>

          <div className="side">
            <FRow label="Whitelist">
              <FTextField fullWidth formik={formik} name="ip_whitelist" />
            </FRow>

            <FRow label="Expires date">
              <FDatePicker
                width="100%"
                fullWidth
                formik={formik}
                name="expires_at"
              />
            </FRow>
          </div>
        </FormCard>
      </div>
    </form>
  )
}

export default IntegrationsForm
