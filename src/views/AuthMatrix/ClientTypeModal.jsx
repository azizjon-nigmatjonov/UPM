import { Card, IconButton, Modal, Typography } from "@mui/material"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import { useFormik } from "formik"
import FTextField from "../../components/FormElements/FTextField"
import CancelButton from "../../components/Buttons/CancelButton"
import CreateButton from "../../components/Buttons/CreateButton"
import SaveButton from "../../components/Buttons/SaveButton"
import { useParams } from "react-router-dom"
import FCheckbox from "../../components/FormElements/FCheckbox"

const ClientTypeModal = ({
  closeModal,
  createType,
  updateType,
  loading,
  modalType,
  selectedType,
}) => {
  const { projectId } = useParams()

  const onSubmit = (data) => {
    if (modalType === "typeCreate") return createType(data)

    updateType({
      ...selectedType,
      ...data,
    })
  }

  const formik = useFormik({
    initialValues: {
      confirm_by: 1,
      name: selectedType?.name ?? "",
      self_recover: selectedType?.self_recover ?? false,
      self_register: selectedType?.self_register ?? false,
      project_id: projectId,
    },
    onSubmit,
  })

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {modalType === "typeCreate"
                ? "Create client type"
                : "Edit client type"}
            </Typography>
            <IconButton color="primary" onClick={closeModal}>
              <HighlightOffIcon fontSize="large" />
            </IconButton>
          </div>

          <form onSubmit={formik.handleSubmit} className="form">
            <div className="form-elements">
              <FTextField
                autoFocus
                fullWidth
                label="Name"
                formik={formik}
                name="name"
              />

              <FCheckbox
                label="Self recover"
                formik={formik}
                name="self_recover"
              />

              <FCheckbox
                label="Self register"
                formik={formik}
                name="self_register"
              />
            </div>

            <div className="btns-row">
              <CancelButton onClick={closeModal} />
              {modalType === "typeCreate" ? (
                <CreateButton type="submit" loading={loading} />
              ) : (
                <SaveButton type="submit" loading={loading} />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  )
}

export default ClientTypeModal
