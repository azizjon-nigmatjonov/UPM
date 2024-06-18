import React, { useEffect, useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import "./style.scss";
import TCount from "../TCounter";
import { Checkbox } from "@mui/material";
import TButton from "../TButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function TBaseRow({
  folder,
  title,
  selectedFolders,
  setSelectedFolders,
  onDelete = () => {},
  onCopy = () => {},
}) {
  const [checked, setChecked] = useState(false);

  const onCheck = () => {
    if (!checked) setSelectedFolders(folder?.child_folders);
    else {
      setSelectedFolders(
        selectedFolders.filter((i) => i.parent_folder_id !== folder.id)
      );
    }
  };

  useEffect(() => {
    setChecked(false);
    setSelectedFolders([]);
  }, [folder]);

  return (
    <div className="TBaseRow">
      <div className="left">
        <FolderIcon />
        <p>{title}</p>
        <TCount count={folder?.child_folders?.length ?? 0} />
      </div>
      {Boolean(selectedFolders?.length) && (
        <div className="right">
          <TButton
            text="Copy"
            icon={<ContentCopyIcon sx={{ color: "#0E73F6" }} />}
            onClick={onCopy}
          />
          <TButton
            text="Trash"
            color="#F76659"
            icon={<DeleteOutlineIcon sx={{ color: "#F76659" }} />}
            onClick={onDelete}
          />
          <div>
            <span>All</span>
            <Checkbox
              checked={checked}
              onChange={(e) => {
                setChecked(!checked);
                onCheck();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
