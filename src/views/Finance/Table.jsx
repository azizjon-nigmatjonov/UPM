import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable";
import { numToMonth } from "../../utils/numToMonth";

const FinanceTable = ({ projects = [], totalBalance, loader }) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const calculateTotal = (monthNum, name) => {
    let total = 0;
    projects.forEach((project) => {
      project?.months?.forEach((month) => {
        if (month.number === monthNum) {
          total += month?.[name] || 0;
        }
      });
    });
    return total;
  };

  return (
    <CTable
      columnsCount={4}
      loader={loader}
      disablePagination
      removableHeight={120}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell
            style={{
              position: "sticky",
              left: "0",
              backgroundColor: "white",
              minWidth: "204px",
            }}
          ></CTableCell>
          <CTableCell
            style={{
              position: "sticky",
              left: "204px",
              backgroundColor: "white",
              borderRight: "1.5px solid #ccc",
            }}
          ></CTableCell>
          {months.map((month) => (
            <CTableCell colspan="2" align="center">
              {numToMonth(month - 1)}
            </CTableCell>
          ))}
        </CTableHeadRow>
        <CTableHeadRow>
          <CTableCell
            style={{
              position: "sticky",
              left: "0",
              backgroundColor: "white",
            }}
          >
            Project
          </CTableCell>
          <CTableCell
            style={{
              position: "sticky",
              left: "204px",
              backgroundColor: "white",
              borderRight: "1.5px solid #ccc",
            }}
          >
            Balance
          </CTableCell>
          {months.map((month) => (
            <>
              <CTableCell>Invoice</CTableCell>
              <CTableCell>Payment</CTableCell>
            </>
          ))}
        </CTableHeadRow>
      </CTableHead>
      <CTableBody
        loader={loader}
        columnsCount={26}
        dataLength={projects?.length}
      >
        {projects.map((project, idx) => (
          <CTableRow>
            <CTableCell
              style={{
                position: "sticky",
                left: "0",
                backgroundColor: idx % 2 === 0 ? "#f4f6fa" : "#fff",
              }}
            >
              {project.title}
            </CTableCell>
            <CTableCell
              style={{
                position: "sticky",
                left: "204px",
                backgroundColor: idx % 2 === 0 ? "#f4f6fa" : "#fff",
                borderRight: "1.5px solid #ccc",
              }}
            >
              {project.total_balance || 0}
            </CTableCell>
            {months.map((month) => (
              <>
                <CTableCell>
                  {project?.months?.find(
                    (monthItem) => monthItem.number === month
                  )?.total_invoice || 0}
                </CTableCell>
                <CTableCell>
                  {project?.months?.find(
                    (monthItem) => monthItem.number === month
                  )?.total_payment || 0}
                </CTableCell>
              </>
            ))}
          </CTableRow>
        ))}
        <CTableRow>
          <CTableCell
            style={{
              position: "sticky",
              left: "0",
              backgroundColor: "#fff",
            }}
          >
            Total
          </CTableCell>
          <CTableCell
            style={{
              position: "sticky",
              left: "204px",
              backgroundColor: "#fff",
              borderRight: "1.5px solid #ccc",
            }}
          >
            {totalBalance}
          </CTableCell>
          {months.map((month) => (
            <>
              <CTableCell>
                {calculateTotal(month, "total_invoice") || 0}
              </CTableCell>
              <CTableCell>
                {calculateTotal(month, "total_payment") || 0}
              </CTableCell>
            </>
          ))}
        </CTableRow>
      </CTableBody>
    </CTable>
  );
};

export default FinanceTable;
