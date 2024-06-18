import { CircularProgress, IconButton, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState } from "react";
import subtaskService from "../../../../services/subtaskService";
import TypographyWithIcon from "../../../../components/TypographyWithIcon";
import html2Text from "../../../../utils/html2Text";

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
    <div className="description-block silver-bottom-border">
      <div className="description-header">
        <TypographyWithIcon icon={DescriptionIcon} variant="h6">
          DESCRIPTION
        </TypographyWithIcon>

        {!editable ? (
          <IconButton color="primary" onClick={(_) => setEditable(true)}>
            <EditIcon />
          </IconButton>
        ) : loader ? (
          <IconButton color="primary">
            <CircularProgress size={26} />
          </IconButton>
        ) : (
          <IconButton color="primary" onClick={submitHandler}>
            <SaveIcon />
          </IconButton>
        )}
      </div>

      {!editable ? (
        <pre className="text-block">{html2Text(value)}</pre>
      ) : (
        <TextField
          multiline
          rows={4}
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={submitHandler}
        />
      )}
    </div>
  );
};

export default DescriptionBlock;
