import "./style.scss";
import React, { useState } from "react";
import FolderIcon from "../../../assets/icons/folder2.svg";
import { Collapse, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { sortByOrderNumber } from "../../../utils/sortByOrderNumber";
import CaseRow from "./CaseRow";

const TFolderCases = ({
  folder,
  title,
  depth = 1,
  selected,
  selectedTests,
  setOpen = () => {},
  setSelected = () => {},
  deleteFolder = () => {},
  handleCreate = () => {},
  setSelectedTests = () => {},
  hanldeCheckBox = () => {},
  setFolderIds,
  cases,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderId,  setFolderId] = useState("")

  const switchFolderVisibility = (selected) => {
    setIsOpen((prev) => !prev);
    setSelected(selected);
  };

  const onCheck = (check, item) => {
    item.checked = check;
    setFolderIds(prev => {
      if(prev === undefined && check){
        return [item];
      }
      if(!prev.find(elm => elm.id === item.id)){
        return [
          ...prev,
          item
        ]
      }
      else if(prev?.find(elm => elm.id === item.id ) && !check){
        return prev?.filter(elm => elm.id !== item.id)
      } 
      
      else return prev
    })

    if (!check) {
      setSelectedTests(
        "folders",
        selectedTests.filter((i) => i.id !== item.id)
      );
    } else {
      setSelectedTests("folders", [...selectedTests, item]);
    }
  };

  return (
    <div className="TFolderCases" key={folder.id}>
      <MenuItem className={`folder`}>
        <div style={{ marginLeft: depth * 10 }} className="folder-infos">
          <div
            onClick={() => switchFolderVisibility(folder)}
            style={{ width: "100%" }}
          >
            <div className="with-icons">
              <div className="icon-wrapper">
                <ExpandMoreRoundedIcon
                  sx={{
                    color: "#5B6871",
                    transform: !isOpen ? "rotate(-90deg)" : "",
                  }}
                />
              </div>
              <img src={FolderIcon} alt="img" />
              <h1>{`${title} (${folder.countCases ?? 0})`}</h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              onClick={() => {
                hanldeCheckBox(
                  !folder?.checked,
                  folder,
                  folder?.parent_folder_id
                )
                  setFolderId(folder.id)
              }
              }
              className={`checkbox ${folder?.checked ? "active" : ""}`}
            >
              {folder?.checked ? <CheckIcon /> : ""}
            </div>
          </div>
        </div>
      </MenuItem>

      <Collapse in={isOpen}>
        {folder.child_folders &&
          folder.child_folders.sort(sortByOrderNumber).map((subfolder) => {
            return (
              <>
                <TFolderCases
                  key={subfolder.id}
                  folder={subfolder}
                  title={subfolder.title}
                  depth={depth + 1}
                  selected={selected}
                  setSelected={setSelected}
                  setOpen={setOpen}
                  deleteFolder={deleteFolder}
                  handleCreate={handleCreate}
                  selectedTests={selectedTests}
                  setSelectedTests={setSelectedTests}
                  hanldeCheckBox={hanldeCheckBox}
                  cases={subfolder?.cases}
                  setFolderIds={setFolderIds}
                />
              </>
            );
          })}
        {isOpen &&
          cases?.map((item) => (
            <CaseRow
              item={item}
              depth={depth}
              setSelectedTests={setSelectedTests}
              selectedTests={selectedTests}
              onCheck={onCheck}
              folderId={folderId}
            />
          ))}
      </Collapse>
    </div>
  );
};

export default TFolderCases;
