import React, { useMemo, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import cls from "./style.module.scss";

export default function TPieSingle({
  width = 56,
  additionClass,
  centerEl = "",
  startAngle = -290,
  innerRadius = 0.8,
  activeOuterRadiusOffset = 4,
  item,
}) {
  const [pieData, setPieData] = useState([
    {
      id: "pass",
      value: item.passed,
      color: "#1AC19D",
    },
    {
      id: "fail",
      value: item.failed,
      color: "#F76659",
    },
    {
      id: "not_run",
      value: item.not_run,
      color: "#5b6871",
    },
    {
      id: "retest",
      value: item.retest,
      color: "#D29404",
    },
    {
      id: "skipped",
      value: item.skipped,
      color: "#6F7B8F",
    },
  ]);

  const colors = useMemo(() => {
    return (
      pieData
        ?.map((item) => {
          return item?.color;
        })
        ?.filter((i) => i !== undefined) ?? []
    );
  }, [pieData]);

  return (
    <div
      className={`${cls.TPieChart} ${additionClass}`}
      style={{ height: `${width}px` }}
    >
      <div style={{ width: `${width}px`, height: `${width}px` }}>
        <ResponsivePie
          data={pieData}
          innerRadius={innerRadius}
          activeOuterRadiusOffset={activeOuterRadiusOffset}
          colors={colors}
          enableArcLinkLabels={false}
          isInteractive={false}
          enableArcLabels={false}
          startAngle={startAngle}
        />
        <div className="overlay-center">
          {centerEl ? <div>{centerEl}</div> : ""}
        </div>
      </div>
    </div>
  );
}
