import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import projectService from "../../../services/projectService"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../components/CTable"
import { pageToOffset } from "../../../utils/pageToOffset"
import { useSelector } from "react-redux"
import IconGenerator from "../../../components/IconPicker/IconGenerator"
import { format } from "date-fns"
import { getMonth } from '../../../utils/getMonth'

const ProjectDashboardTable = () => {
  const navigate = useNavigate()
  const { projectId } = useParams()

  const taskTypeList = useSelector((state) => state.taskType.list)
  const [tableData, setTableData] = useState(null)
  const [loader, setLoader] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusGroups, setStatusGroups] = useState([])
  const sprintList = useSelector((state) => state?.sprint?.list);

  const sprintsMap = useMemo(() => {
    const result = {}
    
    sprintList?.forEach(sprint => {
      result[sprint.id] = sprint
    })
     return result
  }, [sprintList])
  
  
  
  const computedTableData = useMemo(() => {
    
    return tableData?.map(data => {
      const dateFrom = sprintsMap[data.id]?.from_date
      const dateTo = sprintsMap[data.id]?.to_date
      const month = sprintsMap[data.id]?.to_date
      
      return {
        ...data,
        date_from: dateFrom ? format(new Date(dateFrom), 'dd.MM.yyyy') : '',
        date_to: dateTo ? format(new Date(dateTo), 'dd.MM.yyyy') : '',
        month: month ? getMonth(+format(new Date(month), 'M')) : '',
        
      }
    })
  }, [ tableData, sprintsMap ])
  
  
  
  const computedTaskTypeList = useMemo(() => {
    return taskTypeList.map((taskType) => ({
      ...taskType,
      statusGroups: statusGroups?.filter(
        (el) => el.task_type_id === taskType.id
      ),
    }))
  }, [statusGroups, taskTypeList])

  const fetchTableData = () => {
    setLoader(true)
    projectService
      .getReportBySprints(projectId, {
        limit: 10,
        offset: pageToOffset(currentPage),
      })
      .then((res) => {
        setTableData(res.sprints_status_group_counts)
        setStatusGroups(res.sprints_status_group_counts?.[0]?.counts)
        setPageCount(Math.ceil(res?.count / 10))
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    fetchTableData()
  }, [currentPage])
  
  return (
    <CTable
      count={pageCount}
      page={currentPage}
      setCurrentPage={setCurrentPage}
      columnsCount={4}
      loader={loader}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell rowSpan={2}>Sprint</CTableCell>
          {computedTaskTypeList.map((taskType) => (
            <CTableCell
              colSpan={taskType.statusGroups?.length}
              key={taskType.id}
            >
              <div className="child-position-center" style={{ gap: "10px" }}>
                <IconGenerator icon={taskType.icon} color="primary" />
                {taskType.title}
              </div>
            </CTableCell>
          ))}
          <CTableCell rowSpan={2}>Percent</CTableCell>
        </CTableHeadRow>

        <CTableHeadRow>
          {computedTaskTypeList.map((taskType) =>
            taskType.statusGroups?.map((group) => (
              <CTableCell style={{ textAlign: "center" }} key={group.id}>
                {group.status_group_title}
              </CTableCell>
            ))
          )}
        </CTableHeadRow>
      </CTableHead>
      {
        <CTableBody
          loader={loader}
          columnsCount={3}
          dataLength={tableData?.length}
        >
          {computedTableData?.map((data, index) => (
            <CTableRow
              key={data.id}
              onClick={() =>
                navigate(`/projects/${projectId}/sprint/${data.id}?index=${index}`)
              }
            >
              <CTableCell>Sprint {data.order_number}  {`(${data.date_from.slice(0, 2)} - ${data.date_to.slice(0, 2)} ${data.month})`} </CTableCell>
              
              {computedTaskTypeList.map((taskType) =>
                taskType.statusGroups?.map((group) => (
                  <CTableCell key={group.id}>
                    <div className="count-cell">
                      <div className="count-block">
                        {data.counts?.find(
                          (el) => el.status_group_id === group.status_group_id
                        )?.count ?? 0}
                      </div>
                    </div>
                  </CTableCell>
                ))
              )}
              <CTableCell>
                <div className="count-cell">
                  <div className="count-block">{data.percent_done ?? 0}%</div>
                </div>
                
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
  )
}

export default ProjectDashboardTable
