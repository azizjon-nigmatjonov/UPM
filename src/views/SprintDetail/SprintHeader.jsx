import React, { useState, useEffect } from "react"
import sprintService from "../../services/sprintService"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { getMonth } from "../../utils/getMonth"

function SprintHeader({ projectId, subtaskList, sprintDetail }) {
  const taskTypeList = useSelector((state) => state.taskType.list)
  const [searchParams] = useSearchParams()
  const index = searchParams.get("index") // "testCode"
  const [sprintDashboard, setSprintDashboard] = useState("")
  const [statusGroups, setStatusGroups] = useState([])
  const [sprintCounts, setSprintCounts] = useState({})
  const [bugCounts, setBugCounts] = useState({})

  const getCounts = (arr) => {
    arr?.forEach((item) => {
      if (item?.task_type_id === taskTypeList[0]?.id) {
        setSprintCounts((old) => {
          old[item.status_group_title] = item?.count || 0
          return old
        })
      } else if (item?.task_type_id === taskTypeList[1]?.id) {
        setBugCounts((old) => {
          old[item.status_group_title] = item?.count || 0
          return old
        })
      }
    })
  }

  const getSprintDashboardList = () => {
    sprintService
      .getSprintDashboardList(projectId, {
        project_id: projectId,
        offset: index,
        limit: 1,
      })
      .then((res) => {
        getCounts(res?.sprints_status_group_counts[0]?.counts)
        setSprintDashboard(res?.sprints_status_group_counts)
      })
  }

  useEffect(() => {
    getSprintDashboardList()
  }, [subtaskList, statusGroups, taskTypeList])

  const fromDate = sprintDetail?.from_date
    ? parseInt(
        format(new Date(sprintDetail && sprintDetail?.from_date), "dd"),
        10
      )
    : null
  const ToDate = sprintDetail?.to_date
    ? parseInt(
        format(new Date(sprintDetail && sprintDetail?.to_date), "dd"),
        10
      )
    : null
  const MonthDate = sprintDetail?.to_date
    ? parseInt(
        format(new Date(sprintDetail && sprintDetail?.to_date), "MM"),
        10
      )
    : null

  return (
    <div className="sprint_header_content">
      <h2 className="sprint_header_title">
        Sprint {sprintDashboard && sprintDashboard[0]?.order_number} |{" "}
        {fromDate}-{ToDate} {getMonth(MonthDate)}
      </h2>

      <div className="sprint_flex">
        <div className="sprint_header_context">
          <h3>Sprint</h3>

          <div className="sprint_header_sprints">
            <div className="sprints_item">
              Not done
              <span>{sprintCounts["NOT DONE"] || sprintCounts["NOT DONE ⛔️"] || 0}</span>
            </div>
            <div className="sprints_item">
              Rejected
              <span>{sprintCounts["REJECTED"] || sprintCounts["REJECTED ❌"] || 0}</span>
            </div>
            <div className="sprints_item">
              Done
              <span>{sprintCounts["DONE"] || sprintCounts["DONE ✅"] || 0}</span>
            </div>
            <div className="sprints_item">
              Accepted
              <span>{sprintCounts["ACCEPTED"] || sprintCounts["ACCEPTED ✅"] || 0}</span>
            </div>
          </div>
        </div>
        <div className="sprint_header_context">
          <h3>Bug</h3>
          <div className="sprint_header_bugs">
            <div className="bugs_item">
              Not done
              <span>{bugCounts["NOT DONE"] || 0}</span>
            </div>
            <div className="bugs_item">
              Rejected
              <span>{bugCounts["REJECTED"] || 0}</span>
            </div>
            <div className="bugs_item">
              Done
              <span>{bugCounts?.DONE} </span>
            </div>
            <div className="bugs_item">
              Accepted
              <span>{bugCounts["ACCEPTED"] || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SprintHeader
