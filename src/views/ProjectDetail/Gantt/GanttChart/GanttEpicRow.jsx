import { format } from "date-fns";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import GanttTaskRow from "./GanttTaskRow";
import StaticGanttItem from "./StaticGanttItem";

const GanttEpicRow = ({ epic, idx }) => {
  const openedEpics = useSelector((state) => state.epic.openedEpics);
  const allTaskList = useSelector((state) => state.task.list);
  const allSubtaskList = useSelector((state) => state.subtask.list);
  const ganttPeriod = useSelector((state) => state.gantt.ganttPeriod);
  const indexedDates = useSelector((state) =>
    ganttPeriod === "week"
      ? state.gantt.indexedDates
      : ganttPeriod === "month"
      ? state.gantt.indexedDatesForMonth
      : state.gantt.indexedDatesForYear
  );
  // const indexedDates = useSelector((state) => state.gantt.indexedDates)

  const childBlockVisible = useMemo(() => {
    return openedEpics.includes(epic.id);
  }, [openedEpics, epic.id]);

  const computedIndexes = useMemo(() => {
    const subtaskList = allSubtaskList.filter(
      (subtask) => subtask.epic_id === epic.id
    );

    if (true) {
      const expectedStartDate = format(
        new Date(epic.start_date?.expected),
        ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
      );

      const expectedEndDate = format(
        new Date(epic.end_date?.expected),
        ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
      );

      const factStartDate = epic.start_date?.fact
        ? format(
            new Date(epic.start_date?.fact),
            ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
          )
        : null;

      const factEndDate = epic.end_date?.fact
        ? format(
            new Date(epic.end_date?.fact),
            ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
          )
        : null;

      return {
        expectedStartIndex: indexedDates.findIndex(
          (el) => el === expectedStartDate
        ),
        expectedEndIndex: indexedDates.findIndex(
          (el) => el === expectedEndDate
        ),
        factStartIndex: indexedDates.findIndex((el) => el === factStartDate),
        factEndIndex: indexedDates.findIndex((el) => el === factEndDate),
      };
    }
    // if no epic dates
    // let expectedStartIndex = 10000;
    // let expectedEndIndex = 0;
    // let factStartIndex = 10000;
    // let factEndIndex = 0;

    // let isFullFactDates = true;

    // subtaskList.forEach((subtask) => {
    //   if (subtask.expectedStartIndex < expectedStartIndex)
    //     expectedStartIndex = subtask.expectedStartIndex;
    //   if (subtask.expectedEndIndex > expectedEndIndex)
    //     expectedEndIndex = subtask.expectedEndIndex;

    //   if (
    //     !isFullFactDates ||
    //     !subtask.factStartIndex ||
    //     !subtask.factEndIndex
    //   ) {
    //     isFullFactDates = false;
    //     factStartIndex = 0;
    //     factEndIndex = 0;
    //   } else {
    //     if (subtask.factStartIndex < factStartIndex)
    //       factStartIndex = subtask.factStartIndex;
    //     if (subtask.factEndIndex > factEndIndex)
    //       factEndIndex = subtask.factEndIndex;
    //   }
    // });

    // return {
    //   expectedStartIndex,
    //   expectedEndIndex,
    //   factStartIndex,
    //   factEndIndex,
    // };
  }, [allSubtaskList, epic, indexedDates, openedEpics]);

  const taskList = useMemo(() => {
    return allTaskList.filter((task) => task.epic_id === epic.id) ?? [];
  }, [epic, allTaskList]);


  return (
    <div className="GanttEpicRow">
      <StaticGanttItem
        title={epic.title}
        {...computedIndexes}
        idx={idx}
        type="epic"
        percent={epic.percent}
      />

      {childBlockVisible &&
        taskList.map((task) => <GanttTaskRow task={task} key={task.id} />)}
    </div>
  );
};

export default GanttEpicRow;
