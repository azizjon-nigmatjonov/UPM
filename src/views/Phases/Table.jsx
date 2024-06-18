import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import ButtonsPopover from "../../components/ButtonsPopover"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable"
import { phaseActions } from "../../redux/slices/phase.slice"
import phaseService from "../../services/phaseService"
import { pageToOffset } from "../../utils/pageToOffset"

const ProjectsTable = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [tableData, setTableData] = useState(null)
  const [loader, setLoader] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  
  const fetchTableData = () => {
    setLoader(true)
    phaseService
      .getList({
        limit: 10,
        offset: pageToOffset(currentPage),
      })
      .then((res) => {
        setTableData(res.phases)
        setPageCount(Math.ceil(res?.count / 10))
      })
      .finally(() => setLoader(false))
  }

  const deleteTableData = (e, id) => {
    setLoader(true)

    phaseService
      .delete(id)
      .then(res => {
        fetchTableData()
        dispatch(phaseActions.removePhase(id))
      })
      .catch(() => setLoader(false))
  }

  const navigateToEditForm = (e, id) => {
    navigate(`/settings/phases/${id}`)
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
              // onClick={() => navigate(`/projects/${data.id}/backlog`)}
            >
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>{data.title}</CTableCell>
              <CTableCell>
                <ButtonsPopover id={data.id} onEditClick={navigateToEditForm} onDeleteClick={deleteTableData} />
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
  )
}

export default ProjectsTable
