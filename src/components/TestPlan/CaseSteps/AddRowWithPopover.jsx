import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CASE_STEP_TEMPLATE_LIST } from "../../../apollo/requests/case-step-template/case-step-template";

export default function AddRowWithPopover({ handleSubmit, title }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleItemClick = (e) => {
    const current = data?.getCaseStepTemplateList?.find(
      (item) => item?.id === e.currentTarget.dataset.template
    );
    current?.case_steps?.forEach((caseStep) => handleSubmit(caseStep?.title));
    setValue("");
  };

  const { refetch, data } = useQuery(GET_CASE_STEP_TEMPLATE_LIST, {
    variables: {
      input: {
        offset: 0,
        limit: 100,
        // search: value,
        search: "",
      },
    },
  });

  useEffect(() => {
    if (value && data?.getCaseStepTemplateList?.length > 0) setOpen(true);
    else setOpen(false);
    // eslint-disable-next-line
  }, [value]);

  return (
    <form
      className="AddRow"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(value);
        setOpen(false);
        setValue("");
      }}
    >
      <p>{title}</p>
      <div
        className="field-row"
        id="field-row"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <OutlinedInput
          size="small"
          fullWidth
          placeholder="Enter name"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // REFETCH FOR GET TEMPLATES
            // refetch({ search: e.target.value });
          }}
          endAdornment={
            <InputAdornment position="end">
              {value ? (
                <IconButton
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   onCreate(value);
                  //   setValue("");
                  // }}
                  type="submit"
                  aria-label="toggle password visibility"
                  edge="end"
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
              ) : (
                ""
              )}
            </InputAdornment>
          }
        />
        {/* THIS JUST EXAMPLE FOR SUGGESTIONS AND ACTIONS */}
        {/* {value && data?.getCaseStepTemplateList?.length > 0 && (
          <div className="menu">
            <div className="menu__inner">
              <p className="menu__title">Actions</p>
              <ul className="menu__list">
                {data?.getCaseStepTemplateList?.map((item) => (
                  <li
                    className="menu__list-item"
                    key={item?.id}
                    data-template={item?.id}
                    onClick={handleItemClick}
                  >
                    {item?.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="menu__inner">
              <p className="menu__title">Suggestions</p>
              <ul className="menu__list">
                {data?.getCaseStepTemplateList?.map((item) => (
                  <li
                    className="menu__list-item"
                    key={item?.id}
                    data-template={item?.id}
                    onClick={handleItemClick}
                  >
                    {item?.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )} */}
      </div>
    </form>
  );
}
