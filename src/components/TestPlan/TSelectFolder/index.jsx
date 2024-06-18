import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TButton from "../TButton";
import folderService from "../../../services/folderService";
import TFolders from "../TFolders";
import { useParams } from "react-router-dom";
import { LinearProgress } from "@mui/material";
export default function TSelectFolder({
  open,
  setOpen,
  values,
  selected,
  setSelected,
  title = "Create New Folder",
  label = "Folder Name",
  cancelText = "Cancel",
  okText = "Create",
  onSubmit = () => {},
  onChange = () => {},
  handleReset = () => {},
}) {
  const { projectId } = useParams();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    handleReset();
    setOpen(false);
  };

  const getFolders = () => {
    setLoading(true);
    folderService
      .getById({ project_id: projectId })
      .then((res) => setFolders(JSON.parse(res.folders)))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getFolders();
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "500px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "6px",
    padding: "16px 0",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={onSubmit}>
        <Box sx={style}>
          <div
            style={{
              borderBottom: "1px solid #E5E9EB",
              padding: "0 16px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "600",
            }}
          >
            {title}
            <CloseRoundedIcon
              onClick={handleClose}
              sx={{ color: "#6E8BB7", cursor: "pointer" }}
            />
          </div>
          <div
            style={{
              padding: "16px",
              height: "430px",
              overflowY: "auto",
            }}
          >
            <div>
              {loading && <LinearProgress />}
              {folders?.map((folder) => {
                return (
                  <TFolders
                    key={folder.id}
                    folder={folder}
                    title={folder.title}
                    depth={0}
                    selected={selected}
                    setSelected={setSelected}
                    setOpen={setOpen}
                    folderActions={false}
                    size="small"
                  />
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: "16px",
              padding: "0 16px 0 0",
            }}
          >
            <TButton
              text={cancelText}
              width="160px"
              height="36px"
              onClick={handleClose}
            />
            <TButton
              width="160px"
              height="36px"
              bgColor="#0E73F6"
              color="#fff"
              text={okText}
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              type="submit"
            />
          </div>
        </Box>
      </form>
    </Modal>
  );
}
