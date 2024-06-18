import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectTestService from "../../../../../../services/projectTestService";

import BasicModal from "../../../../../Modal/index";
import cls from "./style.module.scss";
import TButton from "../../../../TButton";

import PreconditionIcon from "../../../../../../assets/icons/precondition.svg";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
// import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";
import StepRow from "../../../../CaseSteps/StepRow";
import TShowBox from "../../../../TShowBox";
import CommentIcon from "@mui/icons-material/Comment";
import CaseComments from "../../../CaseComments/CaseComments";
import { useSelector } from "react-redux";
import AttachFiles from "../../../../../AttachFiles";
import CBreadcrumbs from "../../../../../CBreadcrumbs";
import DynamicTable from "../../../../CaseSteps/DynamicTable";
import { Draggable } from "react-drag-and-drop";

const status = [
  {
    label: "Not Run",
    value: "NOT_DONE",
    color: "#6E8BB7",
  },
  {
    label: "Passed",
    value: "PASSED",
    color: "#1AC19D",
  },
  {
    label: "Failed",
    value: "FAILED",
    color: "#F76659",
  },
  {
    label: "Skipped",
    value: "SKIPPED",
    color: "#D29404",
  },
  {
    label: "Retest",
    value: "RETEST",
    color: "#0E73F6",
  },
];

export default function ModalPage({
  open,
  setOpen,
  caseList,
  not_run,
  refetch,
  pieData,
  headColumns,
  bodyColumns = [],
  preconditions,
  preconditionsLoading,
}) {
  const { testId, projectId } = useParams();
  const [finished, setFinished] = useState(false);
  const [currentCase, setCurrentCase] = useState(0);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [notRun, setNotRun] = useState(not_run);
  const [comment, setComment] = useState("");
  const userInfo = useSelector((state) => state.auth.userInfo);
  const breadCrumbItems = [
    {
      label: "Integrations",
    },
    {
      label: "Create",
    },
  ];
  const onComment = (e) => {
    e.preventDefault();
    projectTestService
      .createComment({
        case_id: caseList?.[currentCase]?.id,
        creator_id: userInfo?.id,
        message: comment,
        test_id: testId,
      })

      .catch((err) => console.log(err))
      .finally(() => {
        refetch();
        setComment("");
      });
  };

  const onEndExecution = () => {
    projectTestService
      .updateStatus({
        id: testId,
        data: { status: "FINISHED" },
      })
      .then((res) => {
        setOpen(false);
        refetch();
      });
  };

  function handleSlideActions(status) {
    if (status === "forward") {
      if (currentCase < caseList.length - 1) {
        setCurrentCase(currentCase + 1);
      } else {
        setFinished(true);
        setCurrentCase((prev) => prev + 1);
      }
    }
    if (status === "back") {
      if (currentCase > 0) {
        setFinished(false);
        setCurrentCase(currentCase - 1);
      } else setFinished(false);
    }
  }
  const onStatusChange = () => {
    let newStatus = currentStatus === 4 ? 0 : currentStatus + 1;
    setCurrentStatus(newStatus);

    projectTestService
      .updateTestCase({
        case_id: caseList[currentCase].id,
        case_status: status[newStatus].value,
        folder_id: caseList[currentCase].folder_id,
        id: testId,
        project_id: projectId,
      })
      .then((res) => {
        setNotRun(res.not_run);
      });

    // set started status
    let onlyOnce = true;
    onlyOnce &&
      projectTestService
        .updateStatus({
          id: testId,
          data: { status: "STARTED" },
        })
        .then((res) => {
          onlyOnce = false;
        });
  };

  const ExtraHeader = () => {
    return (
      <div className={cls.modalHeader}>
        <div>
          <span className={cls.title}>
            {finished
              ? "Test execution summary"
              : caseList?.[currentCase]?.title}
          </span>
          {!finished && (
            <span className={cls.text}>{`Executed tests: ${currentCase + 1} / ${
              caseList.length
            }`}</span>
          )}
        </div>
        <div>
          <CBreadcrumbs
            items={caseList?.[currentCase]?.path.map((v) => ({ label: v }))}
          />
        </div>
        <button className={cls.closeBtn} onClick={() => setOpen(false)}>
          <CloseIcon />
        </button>
      </div>
    );
  };

  useEffect(() => {
    refetch();
    // getCaseSteps(caseList?.[currentCase]?.id);
    let statusOfCurrentCase = status.findIndex(
      (item) => item.value === caseList?.[currentCase]?.status
    );
    setCurrentStatus(statusOfCurrentCase);
  }, [currentCase]);

  return (
    <>
      <BasicModal
        open={open}
        setOpen={setOpen}
        header={<ExtraHeader />}
        okText={"Create"}
        footer={false}
        bodyStyle={{
          width: "800px",
          height: "auto",
          position: "relative",
          paddingTop: "26px",
        }}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            handleSlideActions("back");
          }}
          className={`${cls.leftBtn} ${cls.btn}`}
        ></div>
        <div>
          <TShowBox
            title="Precondition"
            icon={<img src={PreconditionIcon} alt="img" />}
            padding="0 24px"
            style={{ borderBottom: "none" }}
            content={
              !preconditionsLoading &&
              preconditions?.preconditionsQuery?.map((step, idx) => (
                <Draggable key={step.id}>
                  <StepRow
                    order={idx + 1}
                    key={step.id}
                    step={step}
                    hasActions={false}
                    step_title={step.title}
                  />
                </Draggable>
              ))
            }
          />
          {bodyColumns?.length > 0 && (
            <div>
              <h2 className={cls.tableHeading}>Data table</h2>
              <DynamicTable
                bodyColumns={bodyColumns?.slice(currentCase, currentCase + 1)}
                headColumns={headColumns}
                withBorder
                disabled
              />
            </div>
          )}
          {finished ? (
            <div className={cls.textEnded}>
              <div className={`${cls.info} ${cls.box}`}>
                <div className={cls.left}>
                  <div
                    className={`${cls.iconBox} ${
                      notRun ? cls.warn : cls.check
                    }`}
                  >
                    {notRun ? (
                      <ReportProblemOutlinedIcon sx={{ color: "#ffffff" }} />
                    ) : (
                      <DoneIcon sx={{ color: "#ffffff" }} />
                    )}
                  </div>
                  <div>
                    <h3>
                      {notRun
                        ? notRun + " test set as 'Not run'"
                        : "All test executed"}
                    </h3>
                    <h6>
                      You can still change execution statuses or end the current
                      cycle
                    </h6>
                  </div>
                </div>
              </div>

              <div className={`${cls.endUp} ${cls.box}`}>
                <div className={cls.left}>
                  <div className={`${cls.iconBox} ${cls.info}`}>
                    <InfoOutlinedIcon sx={{ color: "#ffffff" }} />
                  </div>
                  <div>
                    <h3>End execution cycle</h3>
                    <h6>This will definitely lock the execution statuses</h6>
                  </div>
                </div>

                <TButton
                  text="End execution cycle"
                  bgColor="#0E73F6"
                  color="#ffffff"
                  onClick={onEndExecution}
                />
              </div>
            </div>
          ) : (
            <div className={cls.crateOperator}>
              <div className={cls.header}>
                <h2>Test definition</h2>
                <div className={cls.status}>
                  All
                  <TButton
                    text={status[currentStatus]?.label}
                    bgColor={status[currentStatus]?.color}
                    color="#ffffff"
                    onClick={onStatusChange}
                  />
                </div>
              </div>
              <div className={cls.modalDataWrapper}>
                <ul className={cls.list}>
                  {pieData?.cases?.[currentCase]?.steps?.map((step) => (
                    <StepRow
                      noPadding
                      key={step.id}
                      step={step}
                      hasActions={false}
                      actionResult
                      step_title={step.step_title}
                    />
                  ))}
                </ul>

                <TShowBox
                  title="Comments"
                  icon={<CommentIcon />}
                  content={
                    <CaseComments
                      pieData={pieData}
                      currentCase={currentCase}
                      comment={comment}
                      setComment={setComment}
                      onComment={onComment}
                      userInfo={userInfo}
                    />
                  }
                />
                <AttachFiles
                  subtaskId={testId}
                  data={{
                    files: pieData?.cases?.[currentCase]?.files,
                  }}
                  caseId={caseList?.[currentCase]?.id}
                />
              </div>
            </div>
          )}
          {/* <div className={cls.slideBtns}>
          <div
            onClick={(e) => {
              e.preventDefault();
              handleSlideActions("back");
            }}
            className={`${cls.leftBtn} ${cls.btn}`}
          >
            <KeyboardArrowLeft />
          </div>

          {!finished && (
            <div
              onClick={(e) => {
                e.preventDefault();
                handleSlideActions("forward");
              }}
              className={`${cls.rightBtn} ${cls.btn}`}
            >
              <KeyboardArrowRight />
            </div>
          )}
        </div> */}
        </div>
        {!finished && (
          <div
            onClick={(e) => {
              e.preventDefault();
              handleSlideActions("forward");
            }}
            className={`${cls.rightBtn} ${cls.btn}`}
          ></div>
        )}
      </BasicModal>
    </>
  );
}
