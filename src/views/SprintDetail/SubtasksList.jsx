import { useMemo } from "react"
import { useSelector } from "react-redux"
import SubtasksGroup from "./SubtasksGroup"

const SubtasksList = ({
  subtaskList = [],
  disableEdit,
  step,
  removeSubtask,
  updateSubtask,
  disableEditStatus,
  listType,
  setSubtasksList,
  sprint,
}) => {
  const typeList = useSelector((state) => state.taskType.list)
  const statusList = useSelector((state) => state.status.list)

  const computedSubtaskList = useMemo(() => {
    if (!statusList.length) return subtaskList
    return subtaskList?.map((subtask) => ({
      ...subtask,
      status: statusList.find((status) => status.id === subtask.status_id),
    }))
  }, [subtaskList, statusList])

  const computedTypes = useMemo(() => {
    if (!typeList?.length || !computedSubtaskList?.length) return null
    if (listType === "list")
      return [
        {
          id: "1111111",
          title: "Subtasks",
          subtasks: computedSubtaskList,
        },
      ]

    if (listType === "group")
      return typeList?.map((type) => ({
        ...type,
        subtasks: computedSubtaskList.filter(
          (subtask) => subtask.status?.project_task_type_id === type.id
        ),
      }))

    if (listType === "groupByTask") {
      const taskList = []

      subtaskList.forEach((subtask) => {
        const findedTask = taskList.find((el) => el.id === subtask.task_id)

        if (!findedTask) {
          taskList.push({
            id: subtask.task_id,
            title: subtask.task_title,
            subtasks: [subtask],
          })
        } else {
          findedTask.subtasks.push(subtask)
        }
      })

      return taskList
    }

    if (listType === "groupByStage") {
      const stageList = []

      subtaskList.forEach((subtask) => {
        const findedStage = stageList.find(el => el.title === subtask.stage_title)


        if(!findedStage) {
          stageList.push({
            id: subtask.stage_id,
            title: subtask.stage_title,
            subtasks: [subtask],
          })
        } else {
          findedStage.subtasks.push(subtask)
        }
      })

      return stageList

    }

  }, [computedSubtaskList, typeList, listType, subtaskList])

  return (
    <div className="SubtasksList">
      {computedTypes?.map((type) => (
        <SubtasksGroup
          key={type.id}
          group={type}
          disableEdit={disableEdit}
          step={step}
          removeSubtask={removeSubtask}
          updateSubtask={updateSubtask}
          setSubtasksList={setSubtasksList}
          disableEditStatus={disableEditStatus}
          listType={listType}
          sprint={sprint}
          // editSubtask={editSubtask}
          // removeSubtask={removeSubtask}
          // disableEdit={!permissionToRemoveSubtask}
        />
      ))}
    </div>
  )
}

export default SubtasksList
