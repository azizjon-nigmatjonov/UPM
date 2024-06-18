import "./weekPicker.scss";
import PickersDay from "../../components/PickersDay";
import {
  add,
  endOfWeek,
  startOfWeek,
  format,
  differenceInWeeks,
} from "date-fns";
import { useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { WeekArrowLeft, WeekArrowRight } from "../../assets/icons/icons.js";

const WeekPicker = ({
  selectedDate = new Date(),
  setSelectedDate,
  isDateValid,
  views,
  // isWeekend,
}) => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const td = new Date();
  const isWeekend = td.getDay() === 0 || td.getDay() === 6;

  const getLastWeek = () => {
    setCount(count - 1);
    setSelectedDate(add(selectedDate, { weeks: -1 }), { weekStartsOn: 1 });
  };

  const getNextWeek = () => {
    if (count < 0 || isWeekend) {
      setCount(count + 1);
      setSelectedDate(add(selectedDate, { weeks: 1 }), { weekStartsOn: 1 });
    }
  };

  useEffect(() => {
    setOpen(false);
    // monday of current week
    const mondayOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    // monday of selected week
    const mondayOfSelectedWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    // difference in weeks
    const diff = differenceInWeeks(mondayOfThisWeek, mondayOfSelectedWeek);
    setCount(diff * -1);
  }, [selectedDate]);

  return (
    <div className="weekPicker">
      <div onClick={getLastWeek} className="mFlex">
        <WeekArrowLeft />
      </div>
      <div className="range" onClick={() => setOpen(true)}>
        <span>
          {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "dd.MM.yy")}-
          {format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "dd.MM.yy")}
        </span>
      </div>
      <div
        onClick={getNextWeek}
        className={`mFlex ${count < 0 || isWeekend ? "" : "disabled"}`}
      >
        <WeekArrowRight />
      </div>
      {open && (
        <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
          <div className="modal">
            <PickersDay value={selectedDate} setValue={setSelectedDate}views={views} />
          </div>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default WeekPicker;
