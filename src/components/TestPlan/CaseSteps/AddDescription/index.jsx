import { OutlinedInput } from "@mui/material";
import cls from "./style.module.scss";

const AddDescription = ({
  rowTitle = "default title",
  title,
  onClickAway,
  onInputChange,
  editing,
  value,
  handleEditing,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      onInputChange(e);
    } else if (e.key === "Enter") {
      onClickAway(e);
    }
  };

  return (
    <form className={cls.addDescriptionWrapper}>
      <p className={cls.title}>{rowTitle}</p>
      <div className={cls.inputField} onClick={() => handleEditing()}>
        {editing ? (
          <OutlinedInput
            autoFocus={true}
            size="small"
            fullWidth
            multiline
            placeholder="Add description"
            value={value}
            defaultValue={title}
            onBlur={onClickAway}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div>
            {value ? (
              <OutlinedInput
                autoFocus={false}
                size="small"
                fullWidth
                multiline
                value={value}
                defaultValue={title}
              />
            ) : (
              <span className={cls.placeholder}>Add description</span>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default AddDescription;
