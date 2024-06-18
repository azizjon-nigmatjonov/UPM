import React, { useEffect } from "react";
import { Card } from "@mui/material";
import { useState } from "react";
import Header from "../../components/Header";
import Table from "./Table";
import "react-calendar/dist/Calendar.css";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./Table.scss";

import reportService from "../../services/reportService";
import OutsideClickHandler from "react-outside-click-handler";

const Finance = () => {
  const [loader, setLoader] = useState(true);
  const [projetcs, setProjects] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [openYearPicker, setOpenYearPicker] = useState(false);
  const [value, setValue] = React.useState(new Date());

  const getProjects = () => {
    setLoader(true);
    const data = {
      from_date: value.getFullYear() + "-01-01",
      to_date: value.getFullYear() + 1 + "-01-01",
    };
    reportService.postFinance(data).then((res) => {
      setProjects(res.projects);
      setTotalBalance(res.total_balance);
      setLoader(false);
    });
  };

  useEffect(() => {
    getProjects();
  }, [value]);

  return (
    <div>
      <Header
        title="Finance"
        children={
          <div
            className="date__holder"
            onClick={() => {
              setOpenYearPicker(!openYearPicker);
            }}
          >
            <div className="finance__info">
              {value.getFullYear() + "-01-01"} -{" "}
              {value.getFullYear() + 1 + "-01-01"}
            </div>
            {openYearPicker && (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setOpenYearPicker(false);
                }}
              >
                <div className="finance__date" onClick={(e) => e.stopPropagation()}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDatePicker
                      minDate={new Date("2000-01-01")}
                      displayStaticWrapperAs="desktop"
                      openTo="year"
                      value={value}
                      onChange={(newValue) => {
                        setValue(newValue);
                        setOpenYearPicker(false);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
              </OutsideClickHandler>
            )}
          </div>
        }
      />

      <div style={{ padding: "10px 20px", borderRadius: "0px" }}>
        <Card style={{ padding: "0px", borderRadius: "0px" }}>
          <Table
            loader={loader}
            projects={projetcs}
            totalBalance={totalBalance}
          />
        </Card>
      </div>
    </div>
  );
};

export default Finance;
