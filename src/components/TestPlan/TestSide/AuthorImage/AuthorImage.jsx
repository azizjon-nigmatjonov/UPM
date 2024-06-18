import React from "react";
import cls from "./styles.module.scss";

const AuthorImage = ({ url, name, style }) => {
  return (
    <>
      {url ? (
        <img src={url} alt="user" className={cls.userImage} style={style} />
      ) : (
        <div className={cls.noImage} style={style}>
          {name?.[0]}
        </div>
      )}
    </>
  );
};

export default AuthorImage;
