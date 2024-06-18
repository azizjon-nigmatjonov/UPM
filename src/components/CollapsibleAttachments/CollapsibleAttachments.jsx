import React from "react";
import SideLayout from "./SideLayout";
import cls from "./styles.module.scss";
import FileIcon from "../FileIcon";
import { biteToKilobite } from "../../utils/biteToKilobite";
import RectangleIconButton from "../Buttons/RectangleIconButton";
import { Download } from "@mui/icons-material";
import useDownloader from "../../hooks/useDownloader";
import UserMessages from "../UserMessages/UserMessages";

const CollapsibleAttachments = ({ files, key, comments }) => {
  const [download, downloadLoader] = useDownloader();

  const downloadHandler = (file) => {
    download({ fileId: file.id, fileName: file.name });
  };

  return (
    <div className={cls.main} key={key}>
      <SideLayout heading="Attachments">
        {files?.map((file) => (
          <div className={cls.imageWrapper}>
            <div className={cls.imageData}>
              <FileIcon />
              <div className={cls.imageInfo}>
                <p className={cls.imageName}>
                  {file.file_name}.{file.file_ext}
                </p>
                <div className={cls.imageSize}>{biteToKilobite(file.size)}</div>
              </div>
            </div>
            <div className={cls.imageActions}>
              <img
                src={`${process.env.REACT_APP_CDN_API_URL}/file/${file.id}`}
                alt="user"
                className={cls.imagePreview}
              />
              <RectangleIconButton
                color="primary"
                onClick={() => downloadHandler(file)}
                loader={downloadLoader}
              >
                <Download color="primary" fontSize="small" />
              </RectangleIconButton>
            </div>
          </div>
        ))}
      </SideLayout>
      <SideLayout heading={`${comments?.length ?? 0} comments`}>
        <div className={cls.comments}>
          {comments?.map((comment) => (
            <UserMessages
              key={comment.id}
              userImage={comment.creator_photo}
              name={comment.creator_name}
              date={comment.created_at}
              message={comment.message}
            />
          ))}
        </div>
      </SideLayout>
    </div>
  );
};

export default CollapsibleAttachments;
