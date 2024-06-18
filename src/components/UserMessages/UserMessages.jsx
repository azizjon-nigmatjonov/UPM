import React from "react";
import cls from "./styles.module.scss";
import { format } from "date-fns";
import AuthorImage from "../TestPlan/TestSide/AuthorImage/AuthorImage";
import UserDefaultPhoto from "../../assets/images/user-default-photo.jpeg";

const UserMessages = ({ userImage, name, date, message }) => {
  return (
    <div className={cls.userMessages}>
      <div className={cls.userDataWrapper}>
        <AuthorImage
          url={userImage ?? UserDefaultPhoto}
          name={name}
          style={{ marginTop: "4px", marginRight: "12px" }}
        />
        <div className={cls.userData}>
          <p className={cls.name}>{name}</p>
          <span className={cls.date}>
            {format(new Date(date), "MMMM d, yyyy 'at' h:mma")}
          </span>
          <p className={cls.message}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default UserMessages;
