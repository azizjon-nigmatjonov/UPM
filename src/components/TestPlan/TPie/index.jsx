import { DeleteOutline } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { ResponsivePie } from "@nivo/pie";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatustTitle from "../../StatusTitle/StatustTitle";
import TestStatus from "../../TestStatus/TestStatus";
import "./style.scss";

export default function TPie({
  item,
  width = "436px",
  additionClass,
  handleOpen = false,
  onDeleteButtonClick = () => {},
}) {
  const navigate = useNavigate();
  const [statusType, setStatusType] = useState("");
  const [activeStatusType, setIsActiveStatusType] = useState("");

  const statuses = [
    {
      label: "Passed",
      status: "passed",
      id: "passed",
      value: item?.passed || 0,
      color: "#1AC19D",
    },
    {
      label: "FAiled",
      status: "failed",
      id: "failed",
      value: item?.failed || 0,
      color: "#F2271C",
    },
    {
      label: "Not run",
      status: "not_run",
      id: "not_run",
      value: item?.not_run || 0,
      color: "#6F7B8F",
    },
    {
      label: "Retest",
      status: "retest",
      id: "retest",
      value: item?.retest || 0,
      color: "#0E73F6",
    },
    {
      label: "Skipped",
      status: "skipped",
      id: "skipped",
      value: item?.skipped || 0,
      color: "#D29404",
    },
  ];
  /////////// Statuses actions///////////////////////////////////
  const getAllColors = (statuses) => statuses.map((v) => v.color);

  const calcItems = (statuses) => {
    return statuses.reduce((a, e) => a + e.value, 0);
  };

  const calculatePercent = (data, itemValue) =>
    ((itemValue / calcItems(data)) * 100).toFixed(2) + "%";
  ////////////////////////////////////////////////////////////////

  const fromatDate = (item) => {
    format(new Date(item?.updated_at), "'Last edited at' d MMM kk:mm");
    const date = new Date(item?.updated_at);
    const formattedDate = format(date, "dd:MM:yyyy");
    return formattedDate;
  };

  const statusInfo = useMemo(() => {
    if (!item || !item.cases) return;
    const data = item?.cases?.filter((el) => el.status === statusType);
    return data;
  }, [item, statusType]);

  return (
    <>
      <div
        className={`TPieChart ${additionClass}`}
        style={{ width: width }}
        onClick={() => {
          if (!handleOpen)
            navigate(
              `/projects/${item.project_id}/test-plan/${item.id}/?tab=1`
            );
        }}
      >
        <div className="pie-charts-wrapper">
          <div className="pie-chart">
            <ResponsivePie
              data={statuses}
              innerRadius={0.7}
              activeOuterRadiusOffset={8}
              enableArcLinkLabels={false}
              isInteractive={false}
              enableArcLabels={false}
              colors={getAllColors(statuses)}
            />
            <div className="overlay-center">
              <span>{calcItems(statuses)}</span>
            </div>
          </div>
          <div className="pie-info">
            <div className="top">
              <p className="name">{item.name}</p>
              <div className="statuses">
                {statuses.map((v) => (
                  <TestStatus
                    key={v.id}
                    count={v.value}
                    status={v.label}
                    color={v.color}
                    percent={calculatePercent(statuses, v.value)}
                    statusType={v.status.toUpperCase()}
                    setStatusType={setStatusType}
                    activeStatusType={activeStatusType}
                    setIsActiveStatusType={setIsActiveStatusType}
                  />
                ))}
              </div>
            </div>
          </div>
          {!additionClass && (
            <div className="authorSide">
              <div className="top">
                <IconButton>
                  <DeleteOutline
                    color="error"
                    onClick={(e) => onDeleteButtonClick(e, item.id)}
                  />
                </IconButton>
              </div>
              <div className="bottom">
                <p>
                  <span>Last edited at: </span>
                  {fromatDate(item)}
                </p>
                <p>
                  <span>Author: </span>
                  {item?.creator?.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {additionClass && item.updated_at && (
          <>
            <div className="bottom" style={{ display: "block" }}>
              <span>Last edited at: </span>
              {fromatDate(item)}
            </div>

            <div className="bottom" style={{ display: "block" }}>
              <span>Author: </span>
              {item?.creator?.name}
            </div>
          </>
        )}
      </div>

      {statusType && (
        <div>
          {statusInfo &&
            statusInfo?.map((elm) => (
              <StatustTitle
                id={elm.id}
                title={elm.title}
                status={elm.status}
                files={elm.files}
                comments={elm.comments}
              />
            ))}
        </div>
      )}
    </>
  );
}
