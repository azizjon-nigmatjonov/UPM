import RectangleIconButton from "../Buttons/RectangleIconButton";
import { Download, Delete, Visibility } from "@mui/icons-material";
import FileIcon from "../FileIcon";
import { useState } from "react";
import subtaskService from "../../services/subtaskService";
import { biteToKilobite } from "../../utils/biteToKilobite";
import useDownloader from "../../hooks/useDownloader";
import projectTestService from "../../services/projectTestService";

const AttachFileRow = ({ subtaskId, file, removeFile, openFile, caseId }) => {
  const [loader, setLoader] = useState(false);
  const [download, downloadLoader] = useDownloader();

  const deleteHandler = () => {
    setLoader(true);

    if (caseId) {
      console.log("123", {
        case_id: caseId,
        file_id: file.id,
        test_id: subtaskId,
      });
      projectTestService
        .deleteFile({
          case_id: caseId,
          file_id: file?.id,
          test_id: subtaskId,
        })
        .then((res) => {
          removeFile(file.id);
        })
        .catch(() => setLoader(false));
    } else {
      subtaskService
        .deleteAttachFile(subtaskId, file.id)
        .then((res) => {
          removeFile(file.id);
        })
        .catch(() => setLoader(false));
    }
  };

  const downloadHandler = () => {
    download({ fileId: file.id, fileName: file.name });
  };

  const openHandler = () => {
    openFile(file);
  };

  return (
    <div className="AttachFileRow silver-bottom-border">
      <FileIcon />
      <div className="icon"></div>
      <div className="info">
        <p className="name">
          {file.file_name}.{file.file_ext}
        </p>
        <div className="size">{biteToKilobite(file.size)}</div>
      </div>

      <div className="btns-block">
        <RectangleIconButton color="primary" onClick={openHandler}>
          <Visibility color="primary" />
        </RectangleIconButton>
        <RectangleIconButton
          loader={downloadLoader}
          color="primary"
          onClick={downloadHandler}
        >
          <Download color="primary" />
        </RectangleIconButton>
        <RectangleIconButton
          loader={loader}
          color="error"
          onClick={deleteHandler}
        >
          <Delete color="error" />
        </RectangleIconButton>
      </div>
    </div>
  );
};

export default AttachFileRow;
