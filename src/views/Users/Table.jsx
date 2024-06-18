import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ButtonsPopover from "../../components/ButtonsPopover"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable"
import FSwitch from "../../components/FormElements/FSwitch"
import UserInfoBlock from "../../components/UserInfoBlock"
import useDebounce from "../../hooks/useDebounce"
import userService from "../../services/userService"
import { pageToOffset } from "../../utils/pageToOffset"

const UsersTable = ({ searchText,roleSelect }) => {
  const navigate = useNavigate()
  const [tableData, setTableData] = useState(null)
  const [loader, setLoader] = useState(true)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const fetchTableData = () => {
    setLoader(true)
    userService
      .getList({
        limit: 10,
        offset: pageToOffset(currentPage),
        search: searchText,
        "role-id":roleSelect || ""
      })
      .then((res) => {
        setTableData(res?.users)
        setPageCount(Math.ceil(res?.count / 10))
      })
      .finally(() => setLoader(false))
  }

  const deleteTableData = (e, id) => {
    setLoader(true)

    userService
      .delete(id)
      .then(() => {
        fetchTableData()
      })
      .catch(() => setLoader(false))
  }

  const handleUserActivation = (userId, active) => {
    userService
    .patchUserActivation(userId, active)
    .then(() => fetchTableData())
  }

  const navigateToEditForm = (e, id) => {
    navigate(`/settings/users/${id}`)
  }

  const filtersChangeHandle = useDebounce(() => {
    if (currentPage === 1) fetchTableData()
    else setCurrentPage(1)
  }, 400)

  useEffect(() => {
    filtersChangeHandle()
  }, [searchText])

  useEffect(() => {
    fetchTableData()
  }, [currentPage,roleSelect])

  return (
    <CTable
      count={pageCount}
      page={currentPage}
      setCurrentPage={setCurrentPage}
      loader={loader}
      removableHeight={242}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={20}>No</CTableCell>
          <CTableCell>FIO</CTableCell>
          <CTableCell>Email</CTableCell>
          <CTableCell>Login</CTableCell>
          <CTableCell>Active</CTableCell>
          <CTableCell width={30}></CTableCell>
        </CTableHeadRow>
      </CTableHead>
      {
        <CTableBody
          loader={loader}
          columnsCount={5}
          dataLength={tableData?.length}
        >
          {tableData?.map((data, index) => (
            <CTableRow
              key={data.id}
              // onClick={() => navigate(`/projects/${data.id}/backlog`)}
            >
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>
                {" "}
                <UserInfoBlock
                  img={data.photo_url}
                  title={data.name}
                  subtitle={data.phone}
                />{" "}
              </CTableCell>
              <CTableCell>{data.email}</CTableCell>
              <CTableCell>{data.login}</CTableCell>
              <CTableCell>
              <FSwitch
                  fullWidth
                  checked={data.active > 0 ? true : false}
                  onChange={(e, val) => handleUserActivation(data.id, val ? 1 : -1)}
                  containerStyle={{ display: "flex", justifyContent: "flex-end" }}
                />
              </CTableCell>
              <CTableCell>
                <ButtonsPopover
                  id={data.id}
                  onEditClick={navigateToEditForm}
                  onDeleteClick={deleteTableData}
                />
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
  )
}

export default UsersTable
