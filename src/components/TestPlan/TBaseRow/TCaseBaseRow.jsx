import React, { useEffect, useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import "./style.scss";
import TCount from "../TCounter";
import { Checkbox } from "@mui/material";
import TButton from "../TButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { COPY_CASES, DELETE_CASES } from "../../../apollo/requests/cases/cases";
import { useMutation } from "@apollo/client";
import { arrayOfIds } from "../../../utils/arrayOfIds";
import TSelectFolder from "../TSelectFolder";
import "./style.scss"

export default function TBaseRow({
  folder,
  title,
  selectedCases,
  setSelectedCases,
  cases = [],
  refetch,
  getFolders,
}) {
  const [checked, setChecked] = useState(false);
  const [selectModal, setModal] = useState(false);
  const [destination, setDestination] = useState({});

  const [deleteCases] = useMutation(DELETE_CASES);
  const [copyCases] = useMutation(COPY_CASES);

  const onCheck = () => {
    setChecked((isChecked) => {
      if (!isChecked) {
        setSelectedCases(cases);
      } else {
        setSelectedCases([]);
      }
      return !isChecked;
    });
  };

  const onDelete = () => {
    deleteCases({
      variables: { ids: arrayOfIds(selectedCases) },
    }).then(() => {
      setSelectedCases([]);
      refetch();
      getFolders();
    });
  };

  const onCopy = () => {
    destination.id &&
      copyCases({
        variables: {
          folder_id: destination.id,
          ids: arrayOfIds(selectedCases),
        },
      }).then(() => {
        setSelectedCases([]);
        setModal(false);
        refetch();
      });
  };

  const handleOpen = () => {
    setModal(true);
  };

  useEffect(() => {
    setChecked(false);
    setSelectedCases([]);
  }, [folder]);

  useEffect(() => {
    const isAllCasesSelectes = selectedCases.length == cases.length;
    setChecked(isAllCasesSelectes);
  }, [selectedCases]);

  return (
    <div className="TBaseRow">
      <div className="left">
        <FolderIcon />
        <p className="case-title">{title}</p>
        <TCount count={cases?.length ?? 0} />
      </div>
      {Boolean(selectedCases?.length) && (
        <div className="right">
          <TButton
            text="Copy"
            icon={<ContentCopyIcon sx={{ color: "#0E73F6" }} />}
            onClick={handleOpen}
          />
          {/* <TButton
            text='Move'
            icon={<DriveFolderUploadIcon sx={{ color: '#0E73F6' }} />}
            onClick={handleOpen}
          /> */}
          <TButton
            text="Trash"
            color="#F76659"
            icon={<DeleteOutlineIcon sx={{ color: "#F76659" }} />}
            onClick={onDelete}
          />
          <div>
            <span>All</span>
            <Checkbox checked={checked} onChange={onCheck} />
          </div>
        </div>
      )}

      {selectModal && (
        <TSelectFolder
          open={selectModal}
          setOpen={setModal}
          title="Choose destination folder"
          okText="Confirm"
          selected={destination}
          setSelected={setDestination}
          onSubmit={onCopy}
        />
      )}
    </div>
  );
}
