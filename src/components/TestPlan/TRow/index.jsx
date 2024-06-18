import React, { useMemo } from "react";
import "./style.scss";
import TCount from "../TCounter";
import { Checkbox } from "@mui/material";

export default function TRow({
  folder,
  setSelected,
  setSelectedFolders,
  selectedFolders,
}) {
  const onCheck = () => {
    if (selectedFolders.includes(folder)) {
      setSelectedFolders(selectedFolders.filter((i) => i.id !== folder.id));
    } else {
      setSelectedFolders([...selectedFolders, folder]);
    }
  };

  const isChecked = useMemo(
    () => selectedFolders.includes(folder),
    [selectedFolders, folder]
  );

  return (
    <div className="TRow">
      <div className="left pointer" onClick={() => setSelected(folder)}>
        <p>{folder?.title}</p>
        <TCount
          tColor="#0067F4"
          bColor="#0067F41A"
          count={folder.countCases ?? folder.count_step ?? 0}
        />
      </div>
      <div className="right">
        <Checkbox checked={isChecked} onClick={onCheck} />
      </div>
    </div>
  );
}
