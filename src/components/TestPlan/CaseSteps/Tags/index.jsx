import React, { useContext, useState } from "react";
import { DefineContext } from "../../Define/Define";
import cls from "./style.module.scss";
import ClearIcon from "@mui/icons-material/Clear";

const Tags = ({ title = "Add tags", tags = [], setTags }) => {
  const { handleUpdateCase, refetch } = useContext(DefineContext);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);

  const handleKeyDown = (elm, index, event) => {
    event.stopPropagation();
    // sorry, this logic is written in rush, I am gonna try to come back and change it asap if I have free time
    if (!tags?.[0]?.label && index === 0) {
      // setTags((prev) => [...prev, { label: event.target.value }, {}]);
      setTags([{ label: event.target.value }, {}]);
    } else if (tags.length !== 0 && index === tags.length - 1) {
      setTags((prev) => {
        return prev.map((elm, tagIndex) => {
          if (tagIndex === index) {
            return { ...elm, label: event.target.value };
          } else return elm;
        });
      });
      tags.push({});
    } else {
      setTags((prev) => {
        return prev.map((el, tagIndex) => {
          if (tagIndex === index) {
            return {
              ...el,
              label: event.target.value,
            };
          } else return el;
        });
      });
    }
  };

  const handleRequest = (filteredTags) => {
    handleUpdateCase(filteredTags);
    refetch();
  };

  const handleDeleteTag = (index) => {
    const filteredTags = tags?.filter((el, tagIndex) => tagIndex !== index);
    setTags(filteredTags);
    handleRequest(filteredTags);
  };

  const handleRequestWithKeys = (event, elm) => {
    if (event.key === "Enter" || event.key === "Tab") {
      handleRequest();
    }
  };

  return (
    <div className={cls.tagsWrapper}>
      <p className={cls.title}>{title}</p>
      <ul className={cls.tagWrapper}>
        {tags?.map((elm, index) => (
          <li
            className={cls.inputTagWrapper}
            style={{
              borderColor: currentEditingIndex === index ? "#0067F4" : "",
            }}
            onClick={() => setCurrentEditingIndex(index)}
          >
            <input
              placeholder="Add a tag"
              defaultValue={elm.label}
              key={elm.label}
              autoFocus={!!index}
              onBlur={() => setCurrentEditingIndex(null)}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.target.value.trim()) {
                  if (event.key === "Enter" && event.target.value) {
                    handleKeyDown(elm, index, event);
                  }
                  handleRequestWithKeys(event, elm);
                }
              }}
            />
            {elm?.label && (
              <span onClick={() => handleDeleteTag(index)}>
                <ClearIcon className={cls.icon} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
