import React from 'react';
import './weekDayPicker.scss'
import { WeekDay, WeekArrowDown } from '../../assets/icons/icons.js'

function WeekDayPicker(props) {
    return (
        <div className='weekDayPikcer'>
            <div className="icon">
                <WeekDay/>
            </div>
            <div className="context">
            <h3>
            Week/Day
            </h3>
            </div>
            <div className="arrow">
                <WeekArrowDown/>
            </div>
        </div>
    );
}

export default WeekDayPicker;