import React, { useMemo, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import "./templateStyles.scss";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import StatustTitle from "../../../StatusTitle/StatustTitle";
import { Button } from "@mui/material";
import TModal from "../../TModal";

export default function TemplatePie({
  item,
  width = "436px",
  additionClass,
  handleOpen = false,
  handleCreateTestTemplate = () => {},
}) {
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();
  const [statusType, setStatusType] = useState("");
  const handleOnChange = (e) => {
    const value = e.target.value;
    setModalTitle(value);
  };
  const handleOnSubmit = () => {
    setOpenModal(false);
    const itemModify = {
      ...item,
      name: modalTitle,
    };
    handleCreateTestTemplate(itemModify);
    navigate(`/projects/${item.project_id}/test-plan/?tab=1`);
    window.location.reload();
  };

  const responsiveData = [
    {
      id: "passed",
      value: item.passed,
      color: "#1AC19D",
    },
    {
      id: "failed",
      value: item.failed,
      color: "#F2271C",
    },
    {
      id: "not_run",
      value: item.not_run,
      color: "#6F7B8F",
    },
    {
      id: "retest",
      value: item.retest,
      color: "#0E73F6",
    },
    {
      id: "skipped",
      value: item.skipped,
      color: "#D29404",
    },
  ];

  const fromatDate = (item) => {
    format(new Date(item?.updated_at), "'Last edited at' d MMM kk:mm");
    const date = new Date(item?.updated_at);
    const formattedDate = format(date, "dd:MM:yyyy");
    return formattedDate;
  };

  function calculatePercentages(statuses) {
    const totalCount = Object.values(statuses).reduce((a, b) => a + b);
    const percentages = {};
    for (const [status, count] of Object.entries(statuses)) {
      percentages[status] = ((count / totalCount) * 100).toFixed(2) + "%";
    }
    return percentages;
  }

  const { passed, failed, not_run, retest, skipped } = calculatePercentages({
    passed: item.passed,
    failed: item.failed,
    not_run: item.not_run,
    retest: item.retest,
    skipped: item.skipped,
  });

  const statusInfo = useMemo(() => {
    if (!item || !item.cases) return;
    const data = item?.cases?.filter((el) => el.status === statusType);
    return data;
  }, [item, statusType]);

  const calcItems = (item) => {
    return (
      item?.passed ||
      0 + item?.failed ||
      0 + item?.not_run ||
      0 + item?.retest ||
      0 + item?.skipped ||
      0
    );
  };
  return (
    <>
      <div
        className={`TemplateChart ${additionClass}`}
        style={{ width: width }}
        // onClick={() => {
        //   if (!handleOpen)
        //     navigate(
        //       `/projects/${item.project_id}/test-plan/${item.id}/?tab=1`
        //     );
        // }}
      >
        <div className="pie-charts-wrapper">
          <div className="pie-chart">
            <ResponsivePie
              data={responsiveData}
              innerRadius={0.7}
              activeOuterRadiusOffset={8}
              enableArcLinkLabels={false}
              isInteractive={false}
              enableArcLabels={false}
              colors={["#1AC19D", "#F2271C", "#6F7B8F", "#0E73F6", "#D29404"]}
            />
            <div className="overlay-center">
              <span>{calcItems(item)}</span>
            </div>
          </div>
          <div className="pie-info">
            <p className="name">{item.name}</p>
            <div className="authorSide">
              <div className="bottom">
                <span>Last edited at: </span>
                {fromatDate(item)}
              </div>
              <div className="bottom">
                <span>Author: </span>
                {item?.creator?.name}
              </div>
            </div>
            <div>
              <Button onClick={() => setOpenModal(true)} variant="contained">
                Run template
              </Button>
            </div>
          </div>
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
      <TModal
        title="Create new Template"
        label="Template name"
        values={{ title: modalTitle }}
        open={openModal}
        setOpen={setOpenModal}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
      />
    </>
  );
}
