import { useEffect, useState } from "react"
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
import sphereService from "../../services/sphereService"
import { pageToOffset } from "../../utils/pageToOffset"

const SpheresTable = () => {
  const navigate = useNavigate()

  const [tableData, setTableData] = useState(null)
  const [loader, setLoader] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  
  const fetchTableData = () => {
    setLoader(true)
    sphereService
      .getList({
        limit: 10,
        offset: pageToOffset(currentPage),
      })
      .then((res) => {
        setTableData(res.spheres)
        setPageCount(Math.ceil(res?.count / 10))
      })
      .finally(() => setLoader(false))
  }

  const deleteTableData = (e, id) => {
    setLoader(true)

    sphereService
      .delete(id)
      .then(res => {
        fetchTableData()
      })
      .catch(() => setLoader(false))
  }

  const navigateToEditForm = (e, id) => {
    navigate(`/settings/spheres/${id}`)
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
          <CTableCell>Description</CTableCell>
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
              <CTableCell>{data.description}</CTableCell>
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

export default SpheresTable
