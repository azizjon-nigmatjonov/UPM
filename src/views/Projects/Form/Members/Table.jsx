

import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import projectMembersService from "../../../../services/projectMembersService"
import ButtonsPopover from "../../../../components/ButtonsPopover"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../../components/CTable"
// import projectMembersGroupService from "../../../services/projectMembersGroupService"
import { pageToOffset } from "../../../../utils/pageToOffset"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import { Delete } from "@mui/icons-material"

const MembersTable = ({ membersGroupId, counter }) => {
  const navigate = useNavigate()
  const { projectId } = useParams()
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

  const deleteTableData = (id) => {
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
  }, [currentPage, counter])

  return (
    <CTable
      count={pageCount}
      page={currentPage}
      setCurrentPage={setCurrentPage}
      removableHeight={320}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={20}>No</CTableCell>
          <CTableCell>Name</CTableCell>
          <CTableCell>Email</CTableCell>
          <CTableCell>Phone</CTableCell>
          <CTableCell width={30}></CTableCell>
        </CTableHeadRow>
      </CTableHead>
      {
        <CTableBody loader={loader} columnsCount={4} dataLength={tableData?.length} >
          {tableData?.map((data, index) => (
            <CTableRow
              key={data.id}
              // onClick={() => navigate(`${location.pathname}/${data.id}/members`)}
            >
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>{data?.user?.name ?? '---'}</CTableCell>
              <CTableCell>{data?.user?.email ?? '---'}</CTableCell>
              <CTableCell>{data?.user?.phone ?? '---'}</CTableCell>
              <CTableCell>
                <RectangleIconButton color="error" onClick={() => deleteTableData(data.id)} >
                  <Delete color="error"  />
                </RectangleIconButton>
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
  )
}

export default MembersTable
