import { Collapse } from "@mui/material";
import React, { useState } from "react";
import "./style.scss";
export default function TShowBox({
  title,
  icon,
  content = "Empty Content",
  defaultOpen = false,
  padding = "0 28px",
  style = {},
}) {
  const [show, setShow] = useState(defaultOpen);
  const [isHovering, setIsHovering] = useState(false);

  const onVisibilityChange = () => setShow(!show);
  return (
    <div
      className="TShowBox"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(null)}
      style={style}
    >
      <div
        className="main-row"
        onClick={onVisibilityChange}
        style={{ padding: padding }}
      >
        <span className="with-icon">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {icon}
            <p className="box-title">{title}</p>
          </div>
        </span>
        {isHovering && <p className="label">{show ? "Hide" : "Show"}</p>}
      </div>
      <Collapse in={show}>{content}</Collapse>
    </div>
  );
}
