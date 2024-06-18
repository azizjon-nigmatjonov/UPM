import { format } from "date-fns";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editGanttTaskPosisitonAction } from "../../../../redux/thunks/task.thunk";
import DynamicGanttItem from "./DynamicGanttItem";
import GanttStageRow from "./GanttStageRow";
import StaticGanttItem from "./StaticGanttItem";

const GanttTaskRow = ({ task }) => {
  const dispatch = useDispatch();

  const openedTasks = useSelector((state) => state.task.openedTasks);
  const allStageList = useSelector((state) => state.stage.list);
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

  const subtaskList = useMemo(() => {
    return allSubtaskList.filter((subtask) => subtask.task_id === task.id);
  }, [allSubtaskList, task.id]);

  const computedIndexes = useMemo(() => {
    if (true) {
      const expectedStartDate = format(
        new Date(task.start_date?.expected),
        ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
      );

      const expectedEndDate = format(
        new Date(task.end_date?.expected),
        ganttPeriod === "year" ? "MM-yyyy" : "MM-dd-yyyy"
      );

      return {
        expectedStartIndex: indexedDates.findIndex(
          (el) => el === expectedStartDate
        ),
        expectedEndIndex: indexedDates.findIndex(
          (el) => el === expectedEndDate
        ),
        factStartIndex: 0,
        factEndIndex: 0,
      };
    }
    // if no subtasks periods
    // let expectedStartIndex = 10000;
    // let expectedEndIndex = 0;
    // let factStartIndex = 10000;
    // let factEndIndex = 0;

    // subtaskList.forEach((subtask) => {
    //   if (subtask.expectedStartIndex < expectedStartIndex)
    //     expectedStartIndex = subtask.expectedStartIndex;
    //   if (subtask.expectedEndIndex > expectedEndIndex)
    //     expectedEndIndex = subtask.expectedEndIndex;
    //   if (subtask.factStartIndex < factStartIndex)
    //     factStartIndex = subtask.factStartIndex;
    //   if (subtask.factEndIndex > factEndIndex)
    //     factEndIndex = subtask.factEndIndex;
    // });

    // return {
    //   expectedStartIndex,
    //   expectedEndIndex,
    //   factStartIndex,
    //   factEndIndex,
    // };
  }, [subtaskList, task, indexedDates]);

  const childBlockVisible = useMemo(() => {
    return openedTasks.includes(task.id);
  }, [openedTasks, task.id]);

  const stageList = useMemo(() => {
    return allStageList.filter((stage) => stage.task_id === task.id) ?? [];
  }, [allStageList, task]);

  const onChange = (data) => {
    if (!data) return null;

    const beginIndex = Math.floor((data.translate[0] + 2) / 38);
    const endIndex = Math.ceil((data.translate[0] + data.width) / 38);

    dispatch(
      editGanttTaskPosisitonAction({
        task,
        beginIndex,
        endIndex,
      })
    );
  };

  return (
    <div className="GanttTaskRow">
      {subtaskList?.length ? (
        <StaticGanttItem
          title={task.title}
          {...computedIndexes}
          percent={task.percent}
          type="task"
        />
      ) : (
        <DynamicGanttItem
          indexes={computedIndexes}
          type="task"
          title={task.title}
          onChange={onChange}
        />
      )}

      {childBlockVisible &&
        stageList.map((stage) => (
          <GanttStageRow key={stage.id} stage={stage} />
        ))}
    </div>
  );
};

export default GanttTaskRow;
