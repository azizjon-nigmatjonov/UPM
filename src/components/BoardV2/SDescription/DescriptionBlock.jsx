import { CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import subtaskService from "../../../services/subtaskService";
import html2Text from "../../../utils/html2Text";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SButton from "../SButton";

const DescriptionBlock = ({ data }) => {
  const [value, setValue] = useState(data?.description || "");
  const [editable, setEditable] = useState(false);
  const [loader, setLoader] = useState(false);

  const updateDescription = () => {
    setLoader(true);
    subtaskService
      .update({
        ...data,
        description: value,
      })
      .then((res) => setEditable(false))
      .finally(() => setLoader(false));
  };

  const submitHandler = () => {
    updateDescription();
  };

  return (
    <div className="space-top">
      <div className="with-icon">
        <DescriptionOutlinedIcon />
        <h1 className="card-title">Description</h1>
        {!editable ? (
          <SButton title="Edit" onClick={(_) => setEditable(true)} />
        ) : loader ? (
          <SButton icon={<CircularProgress size={26} />}></SButton>
        ) : (
          <SButton title="Save" onClick={submitHandler}></SButton>
        )}
      </div>

      {!editable ? (
        <pre style={{ marginTop: "8px" }} className="text-block space-left">
          {html2Text(value)}
        </pre>
      ) : (
        <TextField
          multiline
          rows={4}
          autoFocus
          fullWidth
          style={{ marginTop: "8px", padding: "8px" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={submitHandler}
        />
      )}
    </div>
  );
};

export default DescriptionBlock;
