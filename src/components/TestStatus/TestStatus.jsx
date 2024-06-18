import cls from "./style.module.scss";

const TestStatus = ({
  percent = "0.00%",
  count = "0",
  status = "Passed",
  color = "#1AC19D",
  setStatusType,
  statusType,
  activeStatusType,
  setIsActiveStatusType,
}) => {
  return (
    <div
      className={cls.testStatus}
      style={{
        backgroundColor: activeStatusType === statusType ? "#f6f8f9" : "",
      }}
      onClick={() => {
        setStatusType(statusType);
        setIsActiveStatusType(statusType);
      }}
    >
      <div className={cls.testStatusWrapper}>
        <p className={cls.percent} style={{ color: color }}>
          {percent}
        </p>
        <h2 className={cls.count}>{count}</h2>
        <div className={cls.line} style={{ backgroundColor: color }}></div>
        <p className={cls.status} style={{ color: color }}>
          {status}
        </p>
      </div>
    </div>
  );
};

export default TestStatus;
