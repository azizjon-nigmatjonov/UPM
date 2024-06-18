import React, { useEffect, useState } from "react";
import "./style.scss";
import CheckIcon from "@mui/icons-material/Check";

export default function CaseRow({
  item,
  depth,
  onCheck = () => {},
}) {
  return (
    <div
      className={`CaseInFolder ${item.checked && "selected"}`}
      style={{ marginLeft: (depth + 3) * 10 }}
    >
      <p className="label">{item.title} </p>
      <div
        onClick={(e) => {
          e.preventDefault();
          onCheck(!item.checked, item);
        }}
        className={`checkboxMini ${item?.checked ? "active" : ""}`}
      >
        {item?.checked ? <CheckIcon /> : ""}
      </div>
    </div>
  );
}
