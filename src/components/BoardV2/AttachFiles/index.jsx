import { useState } from "react";
import AttachFileForm from "./AttachFileForm";
import AttachFileRow from "./AttachFileRow";
import ImageViewer from "react-simple-image-viewer";
import "./style.scss";
import VideoModal from "../../../components/VideoModal";
import "react-tuby/css/main.css";
import FileUploadButton from "../../../components/FileUploadButton";
import { useSelector } from "react-redux";
import subtaskService from "../../../services/subtaskService";
import { makeStyles } from "@mui/styles";
const AttachFiles = ({ subtaskId, data, files = [], setFiles }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loader, setLoader] = useState(false);
  const projectInfo = useSelector((state) => state.project.info);
  const useStyles = makeStyles({
    uploadBtn: {
      backgroundColor: "#EAECF0",
      borderRadius: "4px",
      fontFamily: "Inter",
      fontWeight: "400",
      fontSize: "14px",
      lineHeight: "24px",
    },
  });
  const classes = useStyles();
  const addFile = (file) => {
    setFiles((prev) => [...prev, file]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((el) => el.id !== id));
  };

  const openGallery = (file) => {
    setSelectedImage(process.env.REACT_APP_CDN_API_URL + "/file/" + file.id);
  };

  const openPlayer = (file) => {
    setSelectedVideo(process.env.REACT_APP_CDN_API_URL + "/file/" + file.id);
  };

  const openFile = (file) => {
    if (file.type === "image") return openGallery(file);
    if (file.type === "video") return openPlayer(file);
    if (file.type === "pdf") return window.open(file.link, "_blank");
  };

  const onUpload = (file) => {
    subtaskService
      .addAttachFile({
        file,
        subtask_id: subtaskId,
      })
      .then((res) => addFile(file))
      .finally(() => setLoader(false));
  };

  return (
    <div className="AttachFilesNew space-top">
      <AttachFileForm subtaskId={subtaskId} addFile={addFile} />

      <div className="files-area">
        {files.map((file) => (
          <AttachFileRow
            key={file.id}
            subtaskId={subtaskId}
            file={file}
            removeFile={removeFile}
            openFile={openFile}
          />
        ))}
        <div className="space-left upload-btn">
          <FileUploadButton
            className={classes.uploadBtn}
            variant=""
            text="Add attachments"
            folderId={projectInfo?.attached_files_folder_id}
            onChange={onUpload}
          />
        </div>
      </div>

      {selectedImage && (
        <ImageViewer
          src={[selectedImage]}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {selectedVideo && (
        <VideoModal
          src={selectedVideo}
          closeModal={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default AttachFiles;
