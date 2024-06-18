import { Card, IconButton, Modal, TextField, Typography } from "@mui/material"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import integrationService from "../../../../../services/integrationService"
import RingLoaderWithWrapper from "../../../../../components/Loaders/RingLoader/RingLoaderWithWrapper"

const TokenModal = ({ closeModal, sessionId }) => {
  const { integrationId } = useParams()
  const [tokens, setTokens] = useState(null)
  const [loader, setLoader] = useState(true)

  const getSessionToken = useCallback(() => {
    integrationService
      .getSessionToken(integrationId, sessionId)
      .then((res) => setTokens(res))
      .finally(() => setLoader(false))
  }, [sessionId, integrationId])

  useEffect(() => {
    getSessionToken()
  }, [getSessionToken])

  return (
    <Modal
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      open
      className="child-position-center"
      onClose={closeModal}
    >
      <Card className="TokenModal">
        <div className="modal-header silver-bottom-border">
          <Typography variant="h4">Tokens</Typography>
          <IconButton color="primary" onClick={closeModal}>
            <HighlightOffIcon fontSize="large" />
          </IconButton>
        </div>

        {loader ? (
          <RingLoaderWithWrapper />
        ) : (
          <div className="form">
            <div className="label">Access token</div>
            <div className="row">
              <TextField
                size="small"
                fullWidth
                aria-readonly
                value={tokens?.access_token}
              />
            </div>
            <div className="label">Refresh token</div>
            <div className="row">
              <TextField
                size="small"
                fullWidth
                aria-readonly
                value={tokens?.access_token}
              />
            </div>
          </div>
        )}
      </Card>
    </Modal>
  )
}

export default TokenModal
