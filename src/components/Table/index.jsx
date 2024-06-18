import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import NoDataPng from "../../assets/images/no-data.png";
import cls from "./style.module.scss";
import { Switch } from "@mui/icons-material";

export default function StaticTable({
  headColumns = [],
  offset = 1,
  limit = 10,
  bodyColumns = [],
  clickHandler = () => {},
  heightFit = false,
  colTextCenter = false,
  isLoading = false,
  emptyDataImage = NoDataPng,
  nullData = false,
  switchFn = () => {},
  bodyHover = true,
}) {
  const [isHover, setIsHover] = useState("");
  const styleContainer = {
    width: "100%",
    transition: ".3s ease",
    border: "1px solid #E5E9EB",
    borderRadius: "8px",
    maxHeight: heightFit ? "" : "calc(100vh - 238px)",
    "&::-webkit-scrollbar": {
      display: "block",
      width: 15,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#e0eeff",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#7F8487",
      borderRadius: "6px",
      transition: "inherit",
      cursor: "pointer",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#413F42",
    },
  };

  return (
    <TableContainer className={cls.tableContainer} sx={styleContainer}>
      <Table
        stickyHeader
        aria-label="sticky table"
        classes={{
          root: {
            border: "none",
            position: "relative",
          },
        }}
        sx={{
          tableLayout: "auto",
        }}
      >
        {headColumns?.length ? (
          <TableHead className={cls.tableHead}>
            <TableRow>
              {headColumns?.map(
                (item, index) =>
                  item && (
                    <TableCell
                      className={`${
                        index !== headColumns.length - 1 ? cls.borderR : ""
                      } ${cls.headCell} ${cls.tableCell}`}
                      colSpan={item.columns ? item.columns.length : 1}
                      rowSpan={item.columns ? 1 : 2}
                      key={item?.key ? item.key + index : index}
                      style={{
                        width: item.width ? `${item.width}px` : "",
                        textAlign: colTextCenter ? "center" : "",
                      }}
                    >
                      <p
                        style={{
                          textAlign: colTextCenter ? "center" : "",
                        }}
                        className={`${cls.headItem} ${cls.tableCellInner}`}
                      >
                        {item?.title === "index" ? "#" : item?.title}
                      </p>
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
        ) : (
          ""
        )}
        {nullData ? (
          ""
        ) : (
          <TableBody className={cls.tableBody}>
            {isLoading ? (
              <h2>Loading...</h2>
            ) : (
              <>
                {bodyColumns?.map((row, rowIndex) => (
                    <TableRow
                      onMouseEnter={() => setIsHover(bodyHover ? rowIndex : "")}
                      onMouseLeave={() => setIsHover("")}
                      row={rowIndex}
                      style={{
                        background: `${isHover === rowIndex ? "#F6F8F9" : ""}`,
                      }}
                      key={row?.id || rowIndex}
                    >
                      {headColumns?.map((column, colIndex) => (
                        <TableCell
                          key={column.key || colIndex}
                          style={
                            column?.width && { width: `${column?.width}px` }
                          }
                          className={`${
                            colIndex !== headColumns?.length - 1
                              ? cls.borderR
                              : ""
                          } ${cls.bodyCell} ${cls.tableCell}`}
                        >
                          <p
                            className={`${cls.bodyItem} ${cls.tableCellInner} ${
                              isHover === rowIndex + row[column?.key]
                                ? cls.hover
                                : ""
                            }`}
                          >
                            {column.key === "order" ? (
                              rowIndex + (offset - 1) * limit + 1
                            ) : column.key === "status" && !column.render ? (
                              <Switch
                                checked={row?.[column.key]}
                                onClick={(e) => switchFn(row.id, e)}
                              />
                            ) : column.render ? (
                              Array.isArray(column.key) ? (
                                column.render(
                                  column.key.map((data) => row[data]),
                                  rowIndex
                                )
                              ) : column.objectChild ? (
                                column.render(
                                  row?.[column.key]?.[column.objectChild],
                                  rowIndex
                                )
                              ) : (
                                column.render(row?.[column.key], rowIndex)
                              )
                            ) : (
                              row?.[column?.key] || 0
                            )}
                          </p>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        )}
      </Table>

      {!isLoading && nullData && (
        <div className={cls.noData}>
          <img width={100} src={emptyDataImage} alt="Ma'lumot topilmadi" />
          <p>Data not available</p>
        </div>
      )}
    </TableContainer>
  );
}
