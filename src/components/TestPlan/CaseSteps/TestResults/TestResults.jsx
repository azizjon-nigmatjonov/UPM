import React from "react";
import styles from "./styles.module.scss";
import { statuses } from "../../utils";
import { format } from "date-fns";
import TButton from "../../TButton";
const status = {
  NOT_DONE: {
    label: "Not Run",

    color: "#6E8BB7",
  },
  PASSED: {
    label: "Passed",
    color: "#1AC19D",
  },
  FAILED: {
    label: "Failed",
    color: "#F76659",
  },

  SKIPPED: {
    label: "Skipped",
    color: "#D29404",
  },
  RETEST: {
    label: "Retest",
    color: "#0E73F6",
  },
};

const TestResults = ({ results }) => {
  return (
    <div className={styles.items}>
      {results?.map((el) => (
        <div className={styles.item}>
          <div className={styles.status}>
            <TButton
              width="86px"
              text={status?.[el?.status].label}
              bgColor={status?.[el?.status].color}
              color="#ffffff"
            />
          </div>
          <div className={styles.title}>{el?.test_name}</div>
          <div className={styles.date}>
            {format(new Date(el?.test_date), "dd.MM.yyyy HH:mm")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestResults;
