import React, { useState } from "react";
import LinearProgress from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TButton from "../TButton";
import { TextField, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import TFolderCases from "../TFolderCases";
import folderService from "../../../services/folderService";
import TShowBox from "../TShowBox";
import FilterListIcon from "@mui/icons-material/FilterList";
import CasesTagList from "./CasesTagList/CasesTagList";
import TDoubleButton from "../TDoubleButton/TDoubleButton";
import { WeekArrowDown } from "../../../assets/icons/icons";

const CreateModal = ({
  setFieldValue,
  handleBlur,
  open,
  setOpen,
  values,
  folders = [],
  loading,
  title = "Create New Folder",
  label = "Folder Name",
  cancelText = "Cancel",
  okText = "Create",
  onSubmit = () => {},
  onChange = () => {},
  handleReset = () => {},
  hanldeCheckBox = () => {},
  casesTagList,
  selectedFolders,
  setSelectedFolders,
  projectId,
  setFolders,
  folderIds,
  setFolderIds,
  setCreateTemplate,
  createTemplate,
  errors,
  touched,
}) => {
  const [selected, setSelected] = useState([]);
  const handleClose = () => {
    handleReset();
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "6px",
    padding: "16px 0",
  };

  const handleClick = (value) => {
    const tags = selectedFolders?.includes(value)
      ? selectedFolders?.filter((el) => el !== value)
      : [...selectedFolders, value];

    setSelectedFolders(tags);
    // getFolders(tags);
    folderService
      .getById({ project_id: projectId, tags: tags ?? [] })
      .then((res) => {
        setFolders(JSON.parse(res.folders));
      })
      .catch((err) => console.log(err));
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
            }}
          >
            <div>
              <p style={{ marginBottom: "8px", fontWeight: "600" }}>{label}</p>
              <TextField
                name="name"
                id="name"
                onChange={onChange}
                value={values.name}
                onBlur={handleBlur}
                helperText={errors.name && touched?.name ? errors.name : ""}
                error={!!errors.name && touched?.name}
                fullWidth
                size="small"
                placeholder="Enter test name"
                autoFocus
              />
            </div>
            <div style={{ marginTop: "8px" }}>
              <RadioGroup row name="folders" defaultValue="all">
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="Include All Test Cases"
                  onChange={(e) => {
                    setFieldValue("full_case", e.target.value);
                    setFieldValue("folders", []);
                  }}
                />
                <FormControlLabel
                  value="case_ids"
                  control={<Radio />}
                  label="Select A Subset Of Tests"
                  onChange={(e) => {
                    setFieldValue("folders", []);
                    setFieldValue("full_case", e.target.value);
                  }}
                />
              </RadioGroup>
            </div>
            {values.full_case !== "all" && (
              <>
                <TShowBox
                  title="Filters"
                  icon={<FilterListIcon />}
                  padding="0"
                  content={
                    <CasesTagList
                      casesTagList={casesTagList}
                      handleClick={handleClick}
                    />
                  }
                />

                <p>Selected test ({folderIds?.length})</p>
                <div
                  style={{
                    margin: "8px 0",
                    height: "350px",
                    overflowY: "scroll",
                  }}
                >
                  {loading && <LinearProgress />}
                  {folders?.map((folder) => {
                    return (
                      <TFolderCases
                        key={folder?.id}
                        folder={folder}
                        title={folder?.title}
                        depth={0}
                        selected={selected}
                        setSelected={setSelected}
                        setSelectedTests={setFieldValue}
                        selectedTests={values?.folders}
                        setOpen={setOpen}
                        hanldeCheckBox={hanldeCheckBox}
                        setFolderIds={setFolderIds}
                      />
                    );
                  })}
                </div>
              </>
            )}
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
            <TDoubleButton
              iconRight={<WeekArrowDown color="#fff" />}
              setCreateTemplate={setCreateTemplate}
              createTemplate={createTemplate}
              height="36px"
              bgColor="#0E73F6"
              color="#fff"
              text={okText}
              onSubmit={onSubmit}
              type="submit"
            />
          </div>
        </Box>
      </form>
    </Modal>
  );
};

export default CreateModal;
