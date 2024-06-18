import Delete from "@mui/icons-material/Delete"
import { format } from "date-fns"
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton"
import ButtonsPopover from "../../../../../components/ButtonsPopover"
import { CTable, CTableBody, CTableCell, CTableHead, CTableHeadRow, CTableRow } from "../../../../../components/CTable"

const SessionsTable = ({ loader, tableData, deleteTableData, setSelectedSessionId }) => {
  
  return <CTable
      loader={loader}
      removableHeight={340}
      disablePagination
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={20}>No</CTableCell>
          <CTableCell>Title</CTableCell>
          <CTableCell>IP <address></address></CTableCell>
          <CTableCell>Expires date</CTableCell>
          <CTableCell>Created date</CTableCell>
          <CTableCell width={30}></CTableCell>
        </CTableHeadRow>
      </CTableHead>
      {
        <CTableBody
          loader={loader}
          columnsCount={6}
          dataLength={tableData?.length}
        >
          {tableData?.map((data, index) => (
            <CTableRow
              key={data.id}
              onClick={() => setSelectedSessionId(data.id)}
            >
              <CTableCell>{index + 1}</CTableCell>
              <CTableCell>{data.data?.title}</CTableCell>
              <CTableCell>{data.ip}</CTableCell>
              <CTableCell>{data.expires_at && format(new Date(data.expires_at), 'dd.MM.yyyy HH:mm:ss')}</CTableCell>
              <CTableCell>{data.created_at && format(new Date(data.created_at), 'dd.MM.yyyy HH:mm:ss')}</CTableCell>
              <CTableCell>
                {/* <ButtonsPopover
                  id={data.id}
                  // onEditClick={navigateToEditForm}
                  // onDeleteClick={deleteTableData}
                /> */}
                <RectangleIconButton color="error" onClick={deleteTableData(data.id)} >
                  <Delete color="error" />
                </RectangleIconButton>
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
}

export default SessionsTable
