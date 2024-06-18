import { Collapse, Grid } from "@mui/material";
import style from "./filter.module.scss";
import DateRangePicker from "../../components/FormElements/FRangePicker";

const PaymentFilter = ({ isShow, searchComponent, formik }) => {
  return (
    <>
      <Collapse in={isShow}>
        <div className={style.container}>
          <div className={style.filterBox}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <DateRangePicker formik={formik} name="fromToDate" />
              </Grid>
              <Grid item xs={2}>
                {searchComponent}
              </Grid>
            </Grid>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default PaymentFilter;
