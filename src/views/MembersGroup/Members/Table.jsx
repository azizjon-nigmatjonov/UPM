

import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import projectMembersService from "../../../services/projectMembersService"
import ButtonsPopover from "../../../components/ButtonsPopover"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../components/CTable"
// import projectMembersGroupService from "../../../services/projectMembersGroupService"
import { pageToOffset } from "../../../utils/pageToOffset"

const MembersTable = () => {
  const navigate = useNavigate()
  const { projectId, membersGroupId } = useParams()
  const location = useLocation()

  const [tableData, setTableData] = useState(null)
  const [loader, setLoader] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  
  const fetchTableData = () => {
    setLoader(true)
    projectMembersService
      .getList({
        limit: 10,
        offset: pageToOffset(currentPage),
        'project-id': projectId,
        'member-group-id': membersGroupId
      })
      .then((res) => {
        setTableData(res.project_members)
        setPageCount(Math.ceil(res?.count / 10))
      })
      .finally(() => setLoader(false))
  }

  const deleteTableData = (e, id) => {
    setLoader(true)

    const data = {
      id,
      project_id: projectId,
      member_group_id: membersGroupId
    }

    projectMembersService
      .delete(data)
      .then(res => {
        fetchTableData()
      })
      .catch(() => setLoader(false))
  }

  const navigateToEditForm = (e, id) => {
    navigate(`${location.pathname}/${id}`)
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
      removableHeight={242}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={20}>No</CTableCell>
          <CTableCell>Name</CTableCell>
          <CTableCell width={30}></CTableCell>
        </CTableHeadRow>
      </CTableHead>
      {
        <CTableBody loader={loader} columnsCount={3} dataLength={tableData?.length} >
          {tableData?.map((data, index) => (
            <CTableRow
              key={data.id}
              // onClick={() => navigate(`${location.pathname}/${data.id}/members`)}
            >
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>{data.title}</CTableCell>
              <CTableCell>
                <ButtonsPopover id={data.id} onDeleteClick={deleteTableData} />
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
  )
}

export default MembersTable
