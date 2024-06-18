import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import NoDataPng from "../../../../assets/images/no-data.png";
import cls from "./style.module.scss";
import TableSkleton from "./Skeleton";
import { Add, Delete } from "@mui/icons-material";
import Actions from "../../../../assets/icons/actions.svg";
import { MenuItem } from "@mui/material";
import MenuButton from "./MenuButton";
import useDebounce from "../../../../hooks/useDebounce";
export default function DynamicTable({
  headColumns = [],
  bodyColumns = [],
  clickHandler = () => {},
  inputChangeHandler = () => {},
  heightFit = false,
  colTextCenter = false,
  isLoading = false,
  emptyDataImage = NoDataPng,
  disabled = false,
  nullData,
  newColumn,
  tableId,
  getDataTableFn,
}) {
  const [initialVal, setInitialVal] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [isHover, setIsHover] = useState("");

  const updateOptions = useDebounce((status, val, id, headTitle) => {
    if (!newColumn && initialVal !== val && initialVal?.length) {
      inputChangeHandler(status, val, id);
    }
    if (!newColumn && !initialVal?.length && val?.length) {
      inputChangeHandler("newRowCell", val, id, headTitle);
    }
    if (newColumn && val?.length) {
      inputChangeHandler(newColumn, val, id, headTitle);
    }
  }, 0);

  useEffect(() => {
    if (newColumn === "newHeadCol") {
      headColumns[headColumns?.length - 1]?.titleRef?.focus();
    }
    if (newColumn === "newRowCol") {
      bodyColumns[bodyColumns?.length - 1]?.titleRef?.focus();
    }
  }, [headColumns, bodyColumns, newColumn]);

  const styleContainer = {
    width: "100%",
    transition: ".3s ease",
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

  const handleUpdateHeadCol = (e, item) => {
    e.stopPropagation();
    if (e.key === "Enter" && e.target.value.length && item.id) {
      inputChangeHandler("updateHeadCol", e.target.value, item?.id);
      setInitialVal(item.title);
      return;
    } else if (e.key === "Enter" && e.target.value.length) {
      inputChangeHandler("newHeadCol", e.target.value, item?.id);
      setInitialVal(item.title);
      return;
    }
  };

  const handleBlur = (e, item) => {
    if (e.target.value) {
      if (item.id) {
        inputChangeHandler("updateHeadCol", e.target.value, item?.id);
        setInitialVal(item.title);
        return;
      } else {
        inputChangeHandler("newHeadCol", e.target.value, item?.id);
        setInitialVal(item.title);
        return;
      }
    } else {
      getDataTableFn();
    }
  };

  const handleUpdateBodyCol = (e, row, column) => {
    e.stopPropagation();
    if (e.key === "Enter" && e.target.value.length) {
      updateOptions(
        "updateHeadCol",
        e.target.value,
        row.row?.id,
        column?.title
      );
      setInitialVal(row[column.title]?.title);
    }
  };

  const handleBodyColBlur = (e, row, column) => {
    inputChangeHandler(
      "newRowCell",
      e.target.value,
      row?.row?.id,
      column?.title
    );
    // updateOptions(
    //   "updateHeadCol",
    //   e.target.value ? e.target.value : "",
    //   row.row?.id,
    //   column?.title
    // );
    setInitialVal(row[column.title]?.title);
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
        <TableHead className={cls.tableHead}>
          <TableRow>
            {!nullData &&
              headColumns?.map(
                (item, index) =>
                  item && (
                    <TableCell
                      className={`${
                        index !== headColumns.length - 1 ? cls.borderR : ""
                      } ${cls.headCell} ${cls.tableCell}`}
                      colSpan={item.columns ? item.columns.length : 1}
                      rowSpan={item.columns ? 1 : 2}
                      key={item?.title ? item?.title : index}
                      onMouseEnter={() => setIsHover(item.id || "")}
                      onMouseLeave={() => setIsHover("")}
                    >
                      {item.title === "index" ||
                      item.title === "Dataset Name" ? (
                        <div
                          style={{
                            width: item.width ? `${item.width}px` : "",
                            textAlign: colTextCenter ? "center" : "",
                          }}
                          className={`${cls.headItem} ${
                            item.center ? cls.center : ""
                          }`}
                        >
                          {item?.title === "index" ? "#" : item?.title}
                        </div>
                      ) : (
                        <div>
                          <input
                            disabled={disabled}
                            onBlur={(e) => {
                              handleBlur(e, item);
                            }}
                            onKeyDown={(e) => {
                              handleUpdateHeadCol(e, item);
                            }}
                            defaultValue={item.title}
                            type={item?.inputType || "text"}
                            name={item?.inputName || ""}
                            ref={(e) => (item.titleRef = e)}
                          />
                        </div>
                      )}
                      {isHover === item.id &&
                        item.title !== "index" &&
                        item.title !== "Dataset Name" &&
                        !disabled && (
                          <div className={cls.headHoverActions}>
                            <Delete
                              onClick={(e) => {
                                e.preventDefault();
                                clickHandler("deleteHeadCol", {
                                  colId: item.id,
                                });
                              }}
                              style={{ color: "#F76659" }}
                            />
                          </div>
                        )}
                    </TableCell>
                  )
              )}
            {!nullData && !disabled ? (
              <TableCell
                onClick={(e) => {
                  e.preventDefault();
                  clickHandler("newHeadCol");
                }}
                className={`${cls.borderL} ${cls.headCell} ${cls.actionsAddBtn}`}
              >
                <Add style={{ color: "#0E73F6" }} />
              </TableCell>
            ) : (
              ""
            )}
          </TableRow>
        </TableHead>

        <TableBody className={cls.tableBody}>
          {isLoading ? (
            <TableSkleton headColumns={headColumns} />
          ) : (
            <>
              {bodyColumns &&
                bodyColumns?.map((row, rowIndex) => (
                  <TableRow key={row?.row?.id || rowIndex} row={rowIndex}>
                    {headColumns?.map((column, colIndex) => {
                      return (
                        <TableCell
                          key={
                            row.row?.items[colIndex]?.id
                              ? row.row?.items[colIndex]?.id
                              : row.row?.id
                              ? row.row.id + rowIndex
                              : rowIndex
                          }
                          style={
                            column?.width && { width: `${column?.width}px` }
                          }
                          className={`${
                            colIndex !== headColumns?.length - 1
                              ? cls.borderR
                              : ""
                          } ${cls.bodyCell} ${cls.tableCell}`}
                        >
                          {column.type === "read" ? (
                            <div
                              style={
                                column?.width && { width: `${column?.width}px` }
                              }
                              className={cls.bodyItem}
                            >
                              {row[column.title]}
                            </div>
                          ) : (
                            <div>
                              <div>
                                <input
                                  disabled={disabled}
                                  defaultValue={
                                    row?.row?.items[column.title]?.title || ""
                                  }
                                  // onChange={(e) => {
                                  //   updateOptions(
                                  //     "updateHeadCol",
                                  //     e.target.value,
                                  //     row.row?.id,
                                  //     column?.title
                                  //   );
                                  //   setInitialVal(row[column.title]?.title);
                                  // }}
                                  onBlur={(e) => {
                                    handleBodyColBlur(e, row, column);
                                  }}
                                  onKeyDown={(e) => {
                                    handleUpdateBodyCol(e, row, column);
                                  }}
                                  type={column.inputType || "text"}
                                  name={
                                    column?.inputNamehandleBodyColBlur ||
                                    column.title
                                  }
                                  ref={(e) =>
                                    column.title === "Dataset Name"
                                      ? (row.titleRef = e)
                                      : undefined
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                    {!disabled && (
                      <TableCell
                        className={`${cls.borderL} ${cls.actions} ${cls.bodyCell} ${cls.tableCell}`}
                        style={{ width: "20px", position: "relative" }}
                      >
                        <MenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentId(row.row.id);
                          }}
                        >
                          <img src={Actions} alt="actions" />
                          {currentId === row?.row?.id && (
                            <MenuButton
                              setCurrentId={setCurrentId}
                              row={row.row}
                              clickHandler={clickHandler}
                              active={currentId === rowIndex}
                            />
                          )}
                        </MenuItem>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>

      {!isLoading && nullData && (
        <div className={cls.noData}>
          <img width={100} src={emptyDataImage} alt="Ma'lumot topilmadi" />
          <p>Data not available</p>
        </div>
      )}
      {!disabled && (
        <div
          onClick={(e) => {
            e.preventDefault();
            clickHandler(tableId ? "newRowCol" : "createTable");
          }}
          className="tableAddBtn"
        >
          <Add />
          {tableId ? "Create new row" : "Create new table"}
        </div>
      )}
    </TableContainer>
  );
}
