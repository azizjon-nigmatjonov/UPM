import request from '../utils/request';

const dataTableService = {
  getDataTable: (params) => request.get(`/datatable`,  {params}),
  createTable: (params) => request.post(`/datatable`, params),
  createNewCol: (params) => request.post(`/datatable/column`, params),
  updateHeadCol: (params) => request.put(`/datatable/column`, params),
  createRowCol: (params, tableId) => request.post(`/datatable/row/${tableId}`, params),
  updateRowCol: (params) => request.put(`/datatable/row`, params),
  createRowCell: (params, rowId) => request.post(`/datatable/row-field/${rowId}`, params),
  deleteHeadCol: (params) => request.delete(`/datatable/column`, {data: params}),
  deleteRow: (params) => request.delete(`/datatable/row`, {data: params})
};

export default dataTableService;
