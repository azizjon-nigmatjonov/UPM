import React, { useEffect, useState } from "react";
import DynamicTable from "./DynamicTable/index";
import dataTableService from "../../../services/dataTableService";
export default function Datatable({ case_id }) {
  const inisialHeadData = { title: "index", type: "read", width: 10 };
  const [newColumn, setNewColumn] = useState("");
  const [headColumns, setHeadColumns] = useState([inisialHeadData]);
  const [bodyColumns, setBodyColumns] = useState([]);
  const [table, setTable] = useState({});

  function getDataTableFn() {
    const params = {
      limit: 10,
      offset: 0,
      "case-id": case_id,
    };
    dataTableService
      .getDataTable(params)
      .then((res) => {
        setTable(res?.datatables?.[0]);
        setTableColumns(res?.datatables?.[0]);
      })
      .catch((err) => console.log(err));
  }

  function hanldeTableActionsFn(status, props) {
    let params = {};
    if (status === "createTable") {
      dataTableService.createTable({ case_id: case_id }).then(() => {
        getDataTableFn();
      });
    }

    if (status === "newHeadCol") {
      setHeadColumns((prev) => [
        ...prev,
        { title: "", titleRef: null, width: 150 },
      ]);
      setNewColumn("newHeadCol");
    }

    if (status === "newRowCol") {
      let obj = {};
      for (let i = 0; i < headColumns?.length; i++) {
        obj.index = bodyColumns?.length + 1;
        obj[headColumns[i]?.title] = {};
      }
      if (bodyColumns?.length) {
        setBodyColumns([...bodyColumns, obj]);
      } else {
        setBodyColumns([obj]);
      }
      setNewColumn("newRowCol");
    }

    if (status === "deleteHeadCol") {
      params = {
        column_id: props.colId,
        id: table?.id,
      };
      dataTableService.deleteHeadCol(params).then(() => {
        getDataTableFn();
      });
    }
    if (status === "deleteRow") {
      params = {
        row_id: props.rowId,
        id: table?.id,
      };
      dataTableService.deleteRow(params).then(() => {
        getDataTableFn();
      });
    }
    if (status === "dublicateRow") {
      let obj = {};
      for (let key in props.row.items) {
        obj[key] = props.row.items[key].title;
      }
      params = {
        row: {
          additionalProp1: obj,
        },
      };
      dataTableService.createRowCol(params, table?.id).then(() => {
        getDataTableFn();
        setNewColumn("");
      });
    }
  }

  function inputActionsHandler(status, val, colId, headTitle) {
    let params = {};
    if (val?.length) {
      if (status === "updateHeadCol") {
        dataTableService.updateHeadCol({ title: val, id: colId }).then(() => {
          getDataTableFn();
        });
      }
      if (status === "updateRowCol") {
        params = {
          id: table?.id,
          row_item_id: colId,
          row_item_value: val,
        };
        dataTableService.updateRowCol(params).then(() => {
          getDataTableFn();
        });
      }
      if (status === "newHeadCol") {
        dataTableService
          .createNewCol({ column_title: val, id: table?.id })
          .then(() => {
            getDataTableFn();
            setNewColumn("");
          });
      }
      if (status === "newRowCol") {
        params = {
          row: {
            additionalProp1: {
              [headTitle]: val,
            },
          },
        };
        dataTableService.createRowCol(params, table?.id).then(() => {
          getDataTableFn();
          setNewColumn("");
        });
      }
      if (status === "newRowCell") {
        params = {
          row: {
            additionalProp1: {
              [headTitle]: val ?? "",
            },
          },
        };
        dataTableService.createRowCell(params, colId).then(() => {
          getDataTableFn();
        });
      }
    } else if (status === "newRowCell" && !val?.length) {
      params = {
        row: {
          additionalProp1: {
            [headTitle]: "",
          },
        },
      };
      dataTableService.createRowCell(params, colId).then(() => {
        getDataTableFn();
      });
    }
  }

  function setTableColumns(table) {
    setHeadColumns([]);
    setBodyColumns([]);
    if (table?.columns?.length) {
      const data = table?.columns?.map((item) => ({
        ...item,
        width: 150,
      }));
      setHeadColumns([inisialHeadData, ...data]);
    }
    if (table?.rows?.length) {
      setBodyColumns(
        table?.rows?.map((item, index) => ({
          ...item,
          index: index + 1,
          titleRef: null,
        }))
      );
    }
  }

  useEffect(() => {
    getDataTableFn();
  }, [case_id]);

  return (
    <div className="dataTable">
      <DynamicTable
        clickHandler={hanldeTableActionsFn}
        inputChangeHandler={inputActionsHandler}
        headColumns={headColumns}
        bodyColumns={bodyColumns ?? []}
        nullData={!table?.id}
        newColumn={newColumn}
        tableId={table?.id}
        getDataTableFn={getDataTableFn}
      />
    </div>
  );
}
