import React, { useState } from "react";
import cls from "./styles.module.scss";
import { statuses } from "../TestPlan/utils";
import CollapsibleAttachments from "../CollapsibleAttachments/CollapsibleAttachments";

const StatustTitle = ({ id, title, status = "PASSED", files, comments }) => {
  const [activeId, setActiveId] = useState(null);
  return (
    <>
      <div
        key={id}
        className={cls.statusTitle}
        onClick={() =>
          setActiveId((prev) => {
            if (prev === id) {
              return null;
            } else return id;
          })
        }
      >
        <span
          className={cls.dot}
          style={{ backgroundColor: statuses[status] }}
        />
        <p>{title}</p>
      </div>
      {activeId === id && (
        <CollapsibleAttachments files={files} comments={comments} />
      )}
    </>
  );
};

export default StatustTitle;
