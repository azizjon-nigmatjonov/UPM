import { Card, IconButton, Modal, Typography } from "@mui/material"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import { useFormik } from "formik"
import FTextField from "../../components/FormElements/FTextField"
import CancelButton from "../../components/Buttons/CancelButton"
import CreateButton from "../../components/Buttons/CreateButton"
import SaveButton from "../../components/Buttons/SaveButton"
import { useParams } from "react-router-dom"

const PlatformModal = ({
  closeModal,
  createPlatform,
  updatePlatform,
  loading,
  modalType,
  selectedPlatform,
}) => {
  const { projectId } = useParams()

  const onSubmit = (data) => {
    if (modalType === "platformCreate") return createPlatform(data)

    updatePlatform({
      ...selectedPlatform,
      ...data,
    })
  }

  const formik = useFormik({
    initialValues: {
      name: selectedPlatform?.name ?? "",
      subdomain: selectedPlatform?.subdomain ?? "",
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
              {modalType === "platformCreate"
                ? "Create platform"
                : "Edit platform"}
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

              <FTextField
                fullWidth
                label="Subdomain"
                formik={formik}
                name="subdomain"
              />
            </div>

            <div className="btns-row">
              <CancelButton onClick={closeModal} />
              {modalType === "platformCreate" ? (
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

export default PlatformModal
