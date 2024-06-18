import { useNavigate } from "react-router-dom";
import CreateButton from "../../../components/Buttons/CreateButton";
import DownloadButton from "../../../components/Buttons/DownloadButton";
import Header from "../../../components/Header";
import Table from "./Table";
import "./style.scss";
import SearchInput from "../../../components/SearchInput";
import { useState } from "react";
import PaymentFilter from "../../../components/PaymentFilter";
import { useFormik } from "formik";
import PermissionWrapper from "../../../components/PermissionWrapper";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [isfilterShow, setIsFilterShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      fromToDate: [null, null],
    },
  });

  return (
    <div className="PaymentPage">
      <Header
        extra={
          <>
            <DownloadButton title="Excel" />
            <PermissionWrapper permission="PROJECTS/DETAIL/PAYMENT">
              <CreateButton onClick={() => navigate(`create`)} title="Create" />
            </PermissionWrapper>
          </>
        }
      />
      <div className="p-2">
        <PaymentFilter
          formik={formik}
          searchComponent={
            <SearchInput value={searchText} onChange={setSearchText} />
          }
          isShow={true}
        />
        <Table
          formik={formik}
          tableStyle={{ borderRadius: isfilterShow ? "0 0 8px 8px" : "8px" }}
          searchText={searchText}
          setIsFilterShow={setIsFilterShow}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
