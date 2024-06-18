import "./style.scss";
import React, { useState } from "react";
import FolderIcon from "../../../../assets/icons/folder2.svg";
import { MenuItem } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ButtonsPopover from "../../../ButtonsPopover";

export default function CaseStepsTemplateFolders({
  folder,
  title,
  depth = 1,
  selected,
  folderActions = true,
  size = "medium",
  deleteFolder = () => {},
  handleOnUpdate = () => {},
  isCase = false,
  setSelectedCase = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const moreHandler = (e) => {
    e.stopPropagation();
    handleOnUpdate({ ...folder, update: true });
  };
  const onFolderClick = (e) => {
    e.stopPropagation();
    if (isCase) {
      setSelectedCase(folder);
    }
  };
  return (
    <div className="TFolder" key={folder.id}>
      <MenuItem
        className={`folder ${isOpen && "open"} ${size} ${
          selected?.id === folder.id && "selected"
        }`}
        onClick={onFolderClick}
        onMouseOver={() => setIsHovering(folder.id)}
        onMouseLeave={() => setIsHovering(null)}
      >
        <div style={{ marginLeft: depth * 10 }} className="with-icons">
          <div className="icon-wrapper">
            <ExpandMoreRoundedIcon
              sx={{
                color: "#5B6871",
                transform: isOpen && "rotate(-90deg)",
                display: folder.child_folders?.length > 0 ? "block" : "none",
              }}
            />
          </div>
          <img src={FolderIcon} alt={FolderIcon} />
          <h1>{`${title} (${folder?.case_steps?.length ?? 0})`}</h1>
        </div>
        {folder.id === isHovering && folderActions && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            {isCase && (
              <ButtonsPopover
                color="#8D999F"
                id={folder.id}
                onDeleteClick={deleteFolder}
                onEditClick={(e) => moreHandler(e, folder)}
                loading={false}
              />
            )}
          </div>
        )}
      </MenuItem>
    </div>
  );
}
