import { useFormik } from "formik"
import { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import CancelButton from "../../../../components/Buttons/CancelButton"
import SaveButton from "../../../../components/Buttons/SaveButton"
import CBreadcrumbs from "../../../../components/CBreadcrumbs"
import FormCard from "../../../../components/FormCard"
import FRow from "../../../../components/FormElements/FRow"
import FTextField from "../../../../components/FormElements/FTextField"
import Header from "../../../../components/Header"
import { phaseActions } from "../../../../redux/slices/phase.slice"
import clientPlatformService from "../../../../services/clientPlatformService"
import roleService from "../../../../services/roleService"
import userService from '../../../../services/userService'
import PermissionsRecursiveBlock from "../../ClientPlatform/PermissionsBlock/PermissionsRecursiveBlock"
import "./style.scss"

const RolesForm = () => {
  const { platformId, typeId, roleId, projectId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [btnLoader, setBtnLoader] = useState(false)
  const [loader, setLoader] = useState(true)
  const [permissions, setPermissions] = useState([])
  const [permissionLoader, setPermissionLoader] = useState(true)
  const [selectedPermissions, setSelectedPermissions] = useState([])

  const breadCrumbItems = [
    {
      label: "Roles",
    },
    {
      label: "Create",
    },
  ]

  const computedPermissions = useMemo(() => {
    return permissions.filter((permission) => !permission.parent_id)
  }, [permissions])

  const fetchData = () => {
    if (!roleId) return setLoader(false)

    roleService
      .getById(roleId)
      .then((res) => {
        formik.setFieldValue('name', res.name)
        setSelectedPermissions(res.permissions?.map((permission) => permission.id) ?? [])
      })
      .finally(() => setLoader(false))
  }

  const fetchPermissionsList = () => {
    if (!roleId) return setPermissionLoader(false)
    clientPlatformService
      .getDetail(platformId)
      .then((res) => {
        setPermissions(res.permissions ?? [])
      })
      .finally(() => setPermissionLoader(false))
  }

  const create = (data) => {
    setBtnLoader(true)
    roleService
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
      
      await roleService.update({
        ...data,
        id: roleId,
      })

      const permissions = selectedPermissions.map((permission) => ({
        permission_id: permission,
        role_id: roleId,
      }))

      await roleService.addPermissionToRole({ permissions })

      navigate(
        `/settings/auth-matrix/${projectId}/${platformId}/${typeId}/crossed`
      )

    } finally {
      setBtnLoader(false)
    }
    

    
    userService
      .update({
        ...data,
        id: roleId,
      })
      .then((res) => {
        navigate(
          `/settings/auth-matrix/${projectId}/${platformId}/${typeId}/user`
        )
      })
      .finally(() => setBtnLoader(false))
  }

  const onSwitchChange = (id, val) => {
    
    if(val) addSelectedPermission(id)
    else removeSelectedPermission(id)

    
    const childs = permissions.filter((item) => item.parent_id === id)

    childs.forEach(child => {
      onSwitchChange(child.id, val)
    })

  }
  
  const addSelectedPermission = (id) => {
    if(selectedPermissions.includes(id)) return
    setSelectedPermissions((prevState) => {
      return [...prevState, id]
    })
  }

  const removeSelectedPermission = (id) => {
    setSelectedPermissions((prevState) => {
      return prevState.filter((item) => item !== id)
    })
  }

  const onSubmit = (values) => {
    if (roleId) return update(values)
    create(values)
  }

  useEffect(() => {
    fetchData()
    fetchPermissionsList()
  }, [])

  const formik = useFormik({
    initialValues: {
      project_id: projectId,
      client_platform_id: platformId,
      client_type_id: typeId,
      name: "",
    },
    onSubmit,
  })

  console.log('selected permissions', selectedPermissions)

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

      <div className="RolesForm">
        <FormCard visible={!loader} title="Main info" className="form-card">
          <FRow label="Name">
            <FTextField autoFocus fullWidth formik={formik} name="name" />
          </FRow>
        </FormCard>
        {roleId && (
          <FormCard visible={!loader} title="Permissions" className="form-card">
            <div className="permissions-list">
              {computedPermissions?.map((permission) => (
                <PermissionsRecursiveBlock
                  permissions={permissions}
                  permission={permission}
                  disableActions
                  onSwitchChange={onSwitchChange}
                  selectedPermissions={selectedPermissions}
                />
              ))}
            </div>
          </FormCard>
        )}
      </div>
    </form>
  )
}

export default RolesForm
