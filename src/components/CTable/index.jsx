import { Paper } from "@mui/material";
import { forwardRef } from "react";
import CPagination from "../CPagination";
import EmptyDataComponent from "../EmptyDataComponent";
import TableLoader from "../TableLoader";
import "./style.scss";

export const CTable = ({
  callOnScroll = false,
  children,
  count,
  page,
  setCurrentPage,
  removableHeight = 216,
  disablePagination,
  style,
}) => {
  const scrollHandler = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const bottom = scrollHeight - scrollTop - clientHeight < 5;
    const top2bottom = scrollTop !== 0;
    if (bottom && top2bottom) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Paper className="CTableContainer" style={{ ...style }}>
      <div
        onScroll={callOnScroll ? scrollHandler : null}
        className="table"
        style={{ height: `calc(100vh - ${removableHeight}px)` }}
      >
        <table>{children}</table>
      </div>

      {!disablePagination && (
        <CPagination
          count={count}
          page={page}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Paper>
  );
};

export const CTableHead = ({ children }) => {
  return <thead className="CTableHead">{children}</thead>;
};

export const CTableHeadRow = ({ children }) => {
  return <tr className="CTableHeadRow">{children}</tr>;
};

export const CTableBody = forwardRef(
  ({ children, columnsCount, loader, dataLength, ...props }, ref) => {
    return (
      <tbody className="CTableBody" {...props} ref={ref}>
        {!loader && children}
        <EmptyDataComponent isVisible={!loader && !dataLength} />
        <TableLoader isVisible={loader} columnsCount={columnsCount} />
      </tbody>
    );
  }
);

export const CTableRow = ({ children, ...props }) => {
  return (
    <tr className="CTableRow" {...props}>
      {children}
    </tr>
  );
};

export const CTableCell = ({ children, className = "", ...props }) => {
  return (
    <td className={`CTableCell ${className}`} {...props}>
      {children}
    </td>
  );
};
