import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../components/CTable";
import TPieSingle from "../TPieSingle";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRounded from "@mui/icons-material/KeyboardArrowDownRounded";
const UsersTable = ({
  currentPage,
  setCurrentPage,
  items,
  loading,
  setFilters,
}) => {
  const navigate = useNavigate();

  const onSort = (target, val) => setFilters({ [target]: val });

  const WithFilter = ({ title, target }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p>{title}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "-8px",
          cursor: "pointer",
        }}
      >
        <KeyboardArrowUpRoundedIcon onClick={() => onSort(target, "asc")} />
        <KeyboardArrowDownRounded onClick={() => onSort(target, "desc")} />
      </div>
    </div>
  );

  return (
    <CTable
      count={items.count}
      page={currentPage}
      setCurrentPage={setCurrentPage}
      removableHeight={242}
      disablePagination
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell alignCenter width={"1%"}>
            No
          </CTableCell>
          <CTableCell width={"15%"}>Name</CTableCell>
          <CTableCell width={"15%"}>
            <WithFilter title={"Passed"} target="passed" />
          </CTableCell>
          <CTableCell width={"15%"}>
            <WithFilter title={"Failed"} target="failed" />
          </CTableCell>
          <CTableCell width={"15%"}>
            <WithFilter title={"Not run"} target="not_run" />
          </CTableCell>
          <CTableCell width={"15%"}>
            <WithFilter title={"Retest"} target="retest" />
          </CTableCell>
          <CTableCell width={"15%"}>
            <WithFilter title={"Skipped"} target="skipped" />
          </CTableCell>
          <CTableCell width={"15%"}>
            <WithFilter title={"Run date"} target="run_date" />
          </CTableCell>
        </CTableHeadRow>
      </CTableHead>
      {
        <CTableBody
          loader={loading}
          columnsCount={5}
          dataLength={items?.Tests?.length}
        >
          {items?.Tests?.map((data, index) => (
            <CTableRow
              key={data.id}
              onClick={() =>
                navigate(`/projects/${data.project_id}/test-plan/${data.id}`)
              }
            >
              <CTableCell align="center">{index + 1}</CTableCell>
              <CTableCell>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {data.name} <TPieSingle item={data} width={30} />
                </div>
              </CTableCell>
              <CTableCell>{data.passed}</CTableCell>
              <CTableCell>{data.failed}</CTableCell>
              <CTableCell>{data.not_run}</CTableCell>
              <CTableCell>{data.retest}</CTableCell>
              <CTableCell>{data.skipped}</CTableCell>
              <CTableCell>
                {format(new Date(data.updated_at), "dd.MM.yyyy kk:mm")}
              </CTableCell>
            </CTableRow>
          ))}
        </CTableBody>
      }
    </CTable>
  );
};

export default UsersTable;
