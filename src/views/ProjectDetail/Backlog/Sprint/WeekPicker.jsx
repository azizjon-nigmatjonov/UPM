import { ChevronLeftIcon, ChevronRightIcon } from "../../../../assets/icons/icons";
import "./weekPicker.scss";
import PickersDay from "../../../../components/PickersDay";
import { add, differenceInWeeks, endOfWeek, getDate, getMonth, startOfWeek, format } from "date-fns";
import { numToMonth } from "../../../../utils/numToMonth";
import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

const WeekPicker = ({ selectedDate = new Date(), setSelectedDate, formik}) => {
  const [open, setOpen] = useState(true);
  
  useEffect(() => {
    setOpen(false);
  }, []);
  
  useEffect(() => {
    formik.setFieldValue('date', [startOfWeek(selectedDate, { weekStartsOn: 1 }), endOfWeek(selectedDate, { weekStartsOn: 1 })])
  }, [selectedDate])
  


  return (
    // Old one
    <div className="weekPicker">
      <div className="range" onClick={() => setOpen(true)}>
        {/* <span>{numToMonth(getMonth(selectedDate))}</span> */}
        <div className='date_picker'>
          {/* {getDate(startOfWeek(selectedDate, { weekStartsOn: 1 }))} -{" "} */}
         <span className='date_content' >{format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'dd.MM.yyyy')}</span>
         <span className='line'>-</span>
          <span className='date_content'>{format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'dd.MM.yyyy')}</span>
        </div>
      </div>
      {open && (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
          <div className="modal">
            <PickersDay setOpen={setOpen} value={selectedDate} setValue={setSelectedDate} />
          </div>
        </OutsideClickHandler>
      )}
    </div>

    // New one
    // <div className="weekPicker">
    //   <div className="range" onClick={() => setOpen(true)}>
    //     <span>{numToMonth(getMonth(today))}</span>
    //     <span>
    //       {getDate(startOfWeek(today, { weekStartsOn: 1 }))} -{" "}
    //       {getDate(endOfWeek(today, { weekStartsOn: 1 }))}
    //     </span>
    //   </div>
    // </div>
  );
};

export default WeekPicker;
