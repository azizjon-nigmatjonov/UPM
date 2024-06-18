import AttachmentIcon from "@mui/icons-material/Attachment";
import { format } from "date-fns/esm";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import fileService from "../../../services/fileService";
import subtaskService from "../../../services/subtaskService";

const AttachFileForm = ({ subtaskId, addFile }) => {
  const projectInfo = useSelector((state) => state.project.info);
  const [loader, setLoader] = useState(false);

  const onUpload = (file) => {
    console.log("working", file);
    subtaskService
      .addAttachFile({
        file,
        subtask_id: subtaskId,
      })
      .then((res) => addFile(file))
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    const onUploadHandler = (file) => {
      console.log("uploading", file);

      setLoader(true);

      const data = new FormData();

      if (file.name === "image.png") {
        data.append(
          "file",
          file,
          `screenshot-${format(new Date(), "dd.MM.yyyy HH:mm:ss")}.png`
        );
      } else {
        data.append("file", file);
      }

      fileService
        .createFile(projectInfo?.attached_files_folder_id, data)
        .then((res) => {
          onUpload(res);
        })
        .catch(() => setLoader(false));
    };

    const pasteHandler = (event) => {
      console.log("EVENT =====>", event.clipboardData.items.length);

      const items = event.clipboardData.items;

      for (let index = 0; index < items.length; index++) {
        const element = items[index];

        console.log("ITEM =====>", element.kind, element.getAsFile());
      }

      var item = (event.clipboardData || event.originalEvent.clipboardData)
        .items[0];

      console.log("item=>kind", item);

      if (item.kind === "file") {
        var blob = item.getAsFile();

        onUploadHandler(blob);
      }
    };

    window.addEventListener("paste", pasteHandler);

    return () => {
      window.removeEventListener("paste", pasteHandler);
    };
  }, []);

  return (
    <div className="attachments space-top">
      <div className="with-icon">
        <AttachmentIcon />
        <h1 className="card-title">Attachments</h1>
      </div>
    </div>
  );
};

export default AttachFileForm;
