import { Card, IconButton, Modal, Typography } from "@mui/material"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import { useFormik } from "formik"
import FTextField from "../../../../components/FormElements/FTextField"
import CancelButton from "../../../../components/Buttons/CancelButton"
import CreateButton from "../../../../components/Buttons/CreateButton"
import "./style.scss"
import { useEffect } from "react"
import { useState } from "react"
import FSelect from "../../../../components/FormElements/FSelect"
import FDatePicker from "../../../../components/FormElements/FDatePicker"
import clientTypeService from "../../../../services/clientTypeService"
import listToOptions from "../../../../utils/listToOptions"
import userService from "../../../../services/userService"
import authPlatformConfig from "../../../../configs/authPlatform.config"
import FRow from "../../../../components/FormElements/FRow"
import AvatarUpload from "../../../../components/AvatarUpload"
import FAvatarUpload from "../../../../components/FormElements/FAvatarUpload"

const UsersCreateModal = ({ closeModal, setSelectedUser }) => {
  const [btnLoader, setBtnLoader] = useState(false)
  const [rolesList, setRolesList] = useState([])
  const [userTypesList, setUserTypesList] = useState([])

  const fetchUserTypesList = () => {
    clientTypeService
      .getList()
      .then((res) => setUserTypesList(listToOptions(res.client_types, "name")))
  }

  const fetchRolesList = () => {
    setRolesList([])
    clientTypeService
      .getById(formik.values.client_type_id)
      .then((res) => setRolesList(listToOptions(res.roles, "name")))
  }

  const create = (data) => {
    setBtnLoader(true)
    userService
      .create(data)
      .then((res) => {
        setSelectedUser(res)
        closeModal()
      })
      .catch(() => setBtnLoader(false))
  }

  const onSubmit = (values) => {
    create({
      ...values,
      user_id: values.user_id?.id,
    })
  }

  const formik = useFormik({
    initialValues: {
      client_platform_id: authPlatformConfig.platformID,
      project_id: authPlatformConfig.projectID,
      client_type_id: "",
      active: 1,
      name: "",
      email: "",
      login: "",
      password: "",
      phone: "",
      expires_at: "",
      photo_url: "",
      role_id: "",
    },
    onSubmit,
  })

  useEffect(() => {
    fetchUserTypesList()
  }, [])

  useEffect(() => {
    if (!formik.values.client_type_id) return null
    fetchRolesList()
  }, [formik.values.client_type_id])

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="MemberCreateModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">Create user</Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <form onSubmit={formik.handleSubmit} className="form">
            <div className="form-elements silver-bottom-border">
              {/* <FImageUpload fullWidth formik={formik} name="photo_url" /> */}

              <div>
                <FAvatarUpload formik={formik} name="photo_url" />
              </div>

              <div className="side">
                <FRow label="Fullname">
                  <FTextField placeholder="Enter fullname" fullWidth formik={formik} name="name" />
                </FRow>

                <FRow label="Email">
                  <FTextField placeholder="Enter email" fullWidth formik={formik} name="email" />
                </FRow>

                <FRow label="Phone">
                  <FTextField placeholder="Enter phone" fullWidth formik={formik} name="phone" />
                </FRow>

                <FRow label="Login">
                  <FTextField placeholder="Enter login" fullWidth formik={formik} name="login" />
                </FRow>

                <FRow label="Password">
                  <FTextField
                    type="password"
                    fullWidth
                    formik={formik}
                    name="password"
                    placeholder="Enter password"
                  />
                </FRow>

                <FRow label="Expires date">
                  <FDatePicker width="100%" formik={formik} name="expires_at" />
                </FRow>

                <FRow label="Type">
                  <FSelect
                    options={userTypesList}
                    fullWidth
                    formik={formik}
                    name="client_type_id"
                  />
                </FRow>

                <FRow label="Role">
                  <FSelect
                    options={rolesList}
                    fullWidth
                    formik={formik}
                    name="role_id"
                  />
                </FRow>
              </div>
            </div>

            <div className="btns-row">
              <CancelButton onClick={closeModal} />
              <CreateButton type="submit" loading={btnLoader} />
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  )
}

export default UsersCreateModal
