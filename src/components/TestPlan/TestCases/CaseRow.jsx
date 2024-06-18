import React, { useState, useMemo, useReducer, useContext } from "react";
import TCount from "../TCounter";
import { Checkbox, IconButton } from "@mui/material";
import ButtonsPopover from "../../ButtonsPopover";
import { DefineContext } from "../Define/Define";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default function CaseRow({
  item,
  onDelete = () => {},
  handleUpdate = () => {},
  setSelectedCase = () => {},
  setSelectedCases,
  selectedCases,
  providerChild,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const { dispatchCase, setTags, tags } = useContext(DefineContext);
  const onCheck = () => {
    if (selectedCases.includes(item)) {
      setSelectedCases(selectedCases.filter((i) => i.id !== item.id));
    } else {
      setSelectedCases([...selectedCases, item]);
    }
  };

  const isChecked = useMemo(
    () => selectedCases.includes(item),
    [selectedCases, item]
  );

  const handleCase = () => {
    dispatchCase({ type: "SET_ALL", payload: item });
    setTags(item.tags.map((elm) => ({ label: elm })));
    if (item?.tags?.length) setTags((prev) => prev.concat({}));
    setSelectedCase(item);
  };

  return (
    <div>
      <div
        className="TRow"
        onMouseOver={() => setIsHovering(item.id)}
        onMouseLeave={() => setIsHovering(null)}
      >
        <IconButton
          {...providerChild.dragHandleProps}
          className="drag-icon drag-handler-btn"
          color="primary"
        >
          <DragIndicatorIcon />
        </IconButton>
        <div className="left pointer" onClick={() => handleCase()}>
          <p>{item?.title}</p>
          <TCount
            tColor="#0067F4"
            bColor="#0067F41A"
            count={item?.countCases ?? item?.count_step ?? 0}
          />
        </div>
        <div className="right">
          {item.id === isHovering && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              <ButtonsPopover
                color="#8D999F"
                id={item.id}
                onDeleteClick={() => onDelete(item.id)}
                onEditClick={() => handleUpdate(item.id, item.title, item)}
                loading={false}
              />
            </div>
          )}
          <Checkbox onClick={onCheck} checked={isChecked} />
        </div>
      </div>
    </div>
  );
}
