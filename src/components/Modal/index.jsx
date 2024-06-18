import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Divider } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 620,
  bgcolor: "background.paper",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  borderRadius: "6px",
  boxShadow: 24,
};

const BasicModal = ({
  open = false,
  setOpen = () => {},
  title = "Modal title",
  children,
  footer,
  headerStyle = { padding: "16px 0" },
  bodyStyle = { padding: "16px" },
  footerStyle = { padding: "16px" },
  header,
}) => {
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "500px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "6px",
    padding: "16px",
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {header || (
            <Typography
              id="modal-modal-title"
              style={headerStyle}
              variant="h6"
              component="h2"
            >
              {title}
            </Typography>
          )}
          <Divider />
          <div style={bodyStyle}>
            {children ||
              "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."}
          </div>
          {footer && (
            <>
              <Divider />
              <div style={footerStyle}>{footer}</div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
