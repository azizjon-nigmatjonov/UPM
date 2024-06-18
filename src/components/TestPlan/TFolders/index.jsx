import "./style.scss";
import React, { useContext, useState } from "react";
import FolderIcon from "../../../assets/icons/folder2.svg";
import FileIcon from "../../../assets/icons/notes-icon.svg";
import { Collapse, MenuItem, IconButton } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { sortByOrderNumber } from "../../../utils/sortByOrderNumber";
import ButtonsPopover from "../../ButtonsPopover";
import { DefineContext } from "../Define/Define";
import { useSelector, useDispatch } from "react-redux";

export default function TFolder({
  folder,
  title,
  depth = 1,
  selected,
  folderActions = true,
  size = "medium",
  setOpen = () => {},
  setSelected = () => {},
  deleteFolder = () => {},
  handleCreate = () => {},
  isCase = false,
  setSelectedCase = () => {},
  dispatchCase = () => {},
  setTags = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const checkedFolders = useSelector((state) => state.testPlan.checkedFolders);
  const selectedFolder = useSelector((state) => state.testPlan.selectedFolder);
  const dispatch = useDispatch();
  const switchFolderVisibility = (selected) => {
    setIsOpen((prev) => !prev);
    setSelected(selected);
  };

  // const handleCheckFolder = (selected) => {
  //   if (selected?.open) {
  //     selected.open = false
  //   } else {
  //     selected.open = true
  //   }
  //   return selected
  // }

  // function handleSetSelected (selected) {
  //   if (checkedFolders?.length) {
  //     if (!checkedFolders.includes(selected.id) && selected.open) {
  //       dispatch(testPlanActions.setCheckedFolders([...checkedFolders, selected.id]))
  //     } else {
  //       const filtered = checkedFolders.filter((item) => item !== selected.id)
  //       dispatch(testPlanActions.setCheckedFolders(filtered))
  //     }
  //   } else {
  //     if (selected.open) {
  //       dispatch(testPlanActions.setCheckedFolders([selected.id]))
  //     }
  //   }
  // }

  const addHandler = (e, folder) => {
    e.stopPropagation();
    handleCreate(folder);
  };

  const moreHandler = (e) => {
    e.stopPropagation();
    handleCreate({ ...folder, update: true });
  };
  const onFolderClick = (e) => {
    e.stopPropagation();
    if (isCase) {
      dispatchCase({ type: "SET_ALL", payload: folder });
      setSelectedCase(folder);
      setTags(folder.tags.map((elm) => ({ label: elm })));
      if (folder?.tags?.length) setTags((prev) => prev.concat({}));
    } else switchFolderVisibility(folder);
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
          <img
            src={!isCase ? FolderIcon : FileIcon}
            alt={!isCase ? "Folder icon" : "File icon"}
            width="16"
            height="16"
          />
          <h1>{`${title} (${folder.countCases ?? folder.count_step ?? 0})`}</h1>
        </div>
        {folder.id === isHovering && folderActions && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            {!folder?.cases?.length && !isCase && (
              <IconButton onClick={(e) => addHandler(e, folder)}>
                <AddRoundedIcon sx={{ color: "#8D999F" }} />
              </IconButton>
            )}
            {!isCase && (
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
      <Collapse in={isOpen}>
        {Boolean(folder.child_folders?.length) &&
          folder.child_folders
            .sort(sortByOrderNumber)
            .map((subfolder) => (
              <TFolder
                key={subfolder.id}
                folder={subfolder}
                title={subfolder.title}
                depth={depth + 1}
                selected={selected}
                setSelected={setSelected}
                setOpen={setOpen}
                deleteFolder={deleteFolder}
                handleCreate={handleCreate}
                folderActions={folderActions}
                size={size}
                setSelectedCase={setSelectedCase}
                dispatchCase={dispatchCase}
              />
            ))}
        {Boolean(folder.cases?.length) &&
          folder.cases
            .sort(sortByOrderNumber)
            .map((caseItem) => (
              <TFolder
                key={caseItem.id}
                folder={caseItem}
                title={caseItem.title}
                depth={depth + 1}
                selected={selected}
                setSelected={setSelected}
                setOpen={setOpen}
                deleteFolder={deleteFolder}
                handleCreate={handleCreate}
                folderActions={folderActions}
                setSelectedCase={setSelectedCase}
                size={size}
                isCase={true}
                dispatchCase={dispatchCase}
              />
            ))}
      </Collapse>
    </div>
  );
}
