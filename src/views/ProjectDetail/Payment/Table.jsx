import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonsPopover from "../../../components/ButtonsPopover";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../components/CTable";
import useDebounce from "../../../hooks/useDebounce";
import paymentService from "../../../services/paymentService";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { format } from "date-fns";
import PermissionWrapper from "../../../components/PermissionWrapper";

const PaymentTable = ({ searchText, formik, tableStyle, setIsFilterShow }) => {
  const navigate = useNavigate();
  const [priceTotal, setPriceTotal] = useState("");
  const [tableData, setTableData] = useState(null);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { projectId } = useParams();

  const fetchTableData = () => {
    setLoader(true);
    paymentService
      .getList(
        {
          limit: 10,
          offset: currentPage,
          search: searchText,
          start_date: formik?.values?.fromToDate[0],
          end_date: formik?.values?.fromToDate[1],
        },
        projectId
      )
      .then((res) => {
        setTableData(res.items);
        setPriceTotal(res.total);
        setPageCount(Math.ceil(res?.count / 10));
      })
      .finally(() => setLoader(false));
  };

  const deleteTableData = (e, id) => {
    setLoader(true);

    paymentService
      .delete(id)
      .then((res) => {
        fetchTableData();
      })
      .catch(() => setLoader(false));
  };

  const navigateToEditForm = (e, id) => {
    navigate(`${id}`);
  };
  function priceFormat(price) {
    const newPrice = price ? price.toString().split(".") : "";
    if (newPrice[0]) {
      const arr = newPrice[0]?.toString()?.split("");
      while (arr?.length % 3 !== 0) {
        arr?.unshift(" ");
      }
      const result = arr?.join("").match(/.{1,3}/g);
      const res =
        ("result",
        `${result.join(" ")}${newPrice[1] ? "." + newPrice[1] : ""}`);
      return res;
    }
  }
  const filtersChangeHandle = useDebounce(() => {
    if (currentPage === 1) fetchTableData();
    else setCurrentPage(1);
  }, 400);

  useEffect(() => {
    filtersChangeHandle();
  }, [searchText]);

  useEffect(() => {
    fetchTableData();
  }, [currentPage, formik?.values?.fromToDate]);

  return (
    <CTable
      count={pageCount}
      page={currentPage}
      setCurrentPage={setCurrentPage}
      loader={loader}
      removableHeight={242}
      style={tableStyle}
    >
      <CTableHead>
        <CTableHeadRow>
          <CTableCell width={20}>No</CTableCell>
          <CTableCell>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Дата{" "}
              <FilterAltIcon
                color="disabled"
                style={{ cursor: "pointer" }}
                onClick={() => setIsFilterShow((prev) => !prev)}
              />
            </div>
          </CTableCell>
          <CTableCell>Тип операции</CTableCell>
          <CTableCell>Тип оплаты</CTableCell>
          <CTableCell>Валюта</CTableCell>
          <CTableCell>Курс валюты</CTableCell>
          <CTableCell>Сумма</CTableCell>
          <CTableCell>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              Коментарий{" "}
              <FilterAltIcon
                color="disabled"
                style={{ cursor: "pointer" }}
                onClick={() => setIsFilterShow((prev) => !prev)}
              />
            </div>
          </CTableCell>
          <PermissionWrapper permission="PROJECTS/DETAIL/PAYMENT/EDIT">
            <CTableCell width={30}></CTableCell>
          </PermissionWrapper>
        </CTableHeadRow>
      </CTableHead>

      <CTableBody
        loader={loader}
        columnsCount={8}
        dataLength={tableData?.length}
      >
        {tableData?.map((data, index) => (
          <CTableRow key={data.id} onClick={() => navigate(`${data.id}`)}>
            <CTableCell>{index + 1}</CTableCell>
            <CTableCell>
              {format(new Date(data.payment_date), "dd.MM.yyyy")}
            </CTableCell>
            <CTableCell>{data.operation_type}</CTableCell>
            <CTableCell>{data.payment_type}</CTableCell>
            <CTableCell>{data.currency_type}</CTableCell>
            <CTableCell>{data.currency_value}</CTableCell>
            <CTableCell>{priceFormat(data.price)}</CTableCell>
            <CTableCell>{data.comment}</CTableCell>
            <PermissionWrapper permission="PROJECTS/DETAIL/PAYMENT/EDIT">
              <CTableCell>
                <ButtonsPopover
                  id={data.id}
                  onEditClick={navigateToEditForm}
                  onDeleteClick={deleteTableData}
                />
              </CTableCell>
            </PermissionWrapper>
          </CTableRow>
        ))}
        <CTableRow>
          <CTableCell style={{ padding: "12px" }}>Balance</CTableCell>
          <CTableCell rowspan="2"></CTableCell>
          <CTableCell rowspan="2"></CTableCell>
          <CTableCell rowspan="2"></CTableCell>
          <CTableCell rowspan="2"></CTableCell>
          <CTableCell rowspan="2"></CTableCell>
          <CTableCell rowspan="2">{priceFormat(priceTotal) || 0}</CTableCell>
          <CTableCell rowspan="2"></CTableCell>
          <PermissionWrapper permission="PROJECTS/DETAIL/PAYMENT/EDIT">
            <CTableCell rowspan="2"></CTableCell>
          </PermissionWrapper>
        </CTableRow>
      </CTableBody>
    </CTable>
  );
};

export default PaymentTable;
