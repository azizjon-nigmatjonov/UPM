import React, { useState } from "react";
import "./ReportStyle.scss";

function ReportFilter({
  setFilter = () => {},
  setIsFilterActive = () => {},
  closeProject,
  filterName,
  initialFilters = {},
}) {
  const [active, setActive] = useState("");
  const handleClick = (e) => {
    setActive(e);
  };
  return (
    <div>
      <span className="table_filter">
        <div className="reportPlan" onMouseEnter={() => {}}>
          <button
            value="1"
            className={active === "1" ? "active" : undefined}
            onClick={(e) => {
              setFilter(() => ({
                ...initialFilters,
                [filterName]: 1,
              }));
              setIsFilterActive(true);
              handleClick(1);
              closeProject();
              e.stopPropagation();
            }}
          >
            {"Sort A --> Z"}
          </button>
          <button
            value="-1"
            className={`${active === "-1" ? "active" : undefined} filter_btn`}
            onClick={(e) => {
              setFilter(() => ({
                ...initialFilters,
                [filterName]: -1,
              }));
              setIsFilterActive(true);
              handleClick(1);
              closeProject();
              e.stopPropagation();
            }}
          >
            {"Sort Z--> A"}
          </button>
        </div>
      </span>
    </div>
  );
}

export default ReportFilter;
