import { Button, CircularProgress, TextField } from "@mui/material";
import { useRef, useState } from "react";
import TypographyWithIcon from "../../../../components/TypographyWithIcon";
import checklistService from "../../../../services/checklistService";
import ChecklistRow from "./ChecklistRow";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { useSelector } from "react-redux";

const ChecklistBlock = ({ checklist, setChecklist, subtaskId }) => {
  const checkListAreaRef = useRef();

  const userId = useSelector((state) => state.auth.userInfo.id);

  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState("");

  const addNewChecklist = (e) => {
    e.preventDefault();

    const data = {
      creator_id: userId,
      status: "NOT_DONE",
      subtask_id: subtaskId,
      title: value,
    };

    setLoader(true);
    checklistService
      .add(data)
      .then((res) => {
        setChecklist(
          res.checklist_items?.map((el) => ({
            ...el,
            status: el.status === "DONE" ? true : false,
          }))
        );
        setValue("");
        checkListAreaRef.current.scrollTo(
          0,
          checkListAreaRef.current.scrollHeight
        );
      })
      .finally(() => setLoader(false));
  };

  return (
    <div className="ChecklistBlock">
      <TypographyWithIcon
        className="title"
        icon={CheckBoxOutlinedIcon}
        variant="h6"
      >
        CHECKLIST
      </TypographyWithIcon>

      <div className="checklist">
        <div className="checklists-area" ref={checkListAreaRef}>
          {checklist?.map((checklistItem, index) => (
            <ChecklistRow
              key={checklistItem.id}
              checklistItem={checklistItem}
              subtaskId={subtaskId}
              setChecklist={setChecklist}
              index={index}
            />
          ))}
        </div>

        <form onSubmit={addNewChecklist} className="checklist-row create-row ">
          <TextField
            size="small"
            fullWidth
            style={{ marginRight: "20px" }}
            placeholder="Add checklist item"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={loader}
            variant="contained"
            color="primary"
            type="submit"
          >
            {loader ? <CircularProgress size={25} /> : "ADD"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChecklistBlock;
