import React from "react";
import UserMessages from "../../../UserMessages/UserMessages";
import cls from "./styles.module.scss";
import { Button, TextField } from "@mui/material";
import AuthorImage from "../AuthorImage/AuthorImage";

const CaseComments = ({
  pieData,
  currentCase,
  userInfo,
  onComment,
  comment,
  setComment,
}) => {
  return (
    <div className={cls.caseComments}>
      <div className={cls.messages}>
        {pieData?.cases?.[currentCase]?.comments ? (
          pieData?.cases?.[currentCase]?.comments?.map((el) => (
            <UserMessages
              key={el.id}
              userImage={el.creator_photo}
              name={el.creator_name}
              date={el.created_at}
              message={el.message}
            />
          ))
        ) : (
          <div className={cls.noComment}> No comments here yet.</div>
        )}
      </div>
      <div className={cls.sendMessage}>
        <AuthorImage url={userInfo?.photo_url} name={userInfo?.name} />
        <form onSubmit={(e) => onComment(e)}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add comment..."
            value={comment}
            onChange={(el) => setComment(el.target.value)}
          />
          <Button variant="contained" type="submit">
            Comment
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CaseComments;
