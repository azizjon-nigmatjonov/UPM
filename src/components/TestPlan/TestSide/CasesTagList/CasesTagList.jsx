import React, { useState } from "react";
import cls from "./styles.module.scss";

const CasesTagList = ({ casesTagList, handleClick }) => {
  const [selectedTag, setSelectedTag] = useState([]);

  return (
    <div className={cls.casesTagList}>
      {casesTagList?.tags?.map((el) => (
        <div
          key={el}
          onClick={() => {
            handleClick(el);
            setSelectedTag((prev) => {
              if (prev.includes(el)) {
                return prev.filter((element) => element !== el);
              } else {
                return prev.concat(el);
              }
            });
          }}
          style={{
            backgroundColor: selectedTag.includes(el) ? "#D8D8D8" : "#eef0f2",
          }}
          className={cls.tags}
        >
          {el}
        </div>
      ))}
    </div>
  );
};

export default CasesTagList;
