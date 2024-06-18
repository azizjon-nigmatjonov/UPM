import React from "react";

import cls from "./styles.module.scss";

const SideLayout = ({ heading, children }) => {
  return (
    <div className={cls.sideLayout}>
      <h4 className={cls.head}>{heading}</h4>
      <div className={cls.content}>{children}</div>
    </div>
  );
};

export default SideLayout;
