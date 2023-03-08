import React, { useMemo } from 'react'
import { SCHEDULE_EVENT_TYPE } from '../../../../utils/schedule-event-type';
import './styles.scss';

export const DayScheduleCard = ({ scheduleChunk }) => {
  const {type, start, stop} = scheduleChunk;
  console.log(scheduleChunk);
  const headerText = useMemo(
    () => (type === SCHEDULE_EVENT_TYPE.BREAK ? "Break" : "Work"),
    [type]
  );
  return (
    <div className="schedule-card-container">
      <div className="card-content">
        <h3>{headerText}</h3>
        <div className="inputs-container">
          <label className='input-label'>
            from
            <input className="time-input" />
          </label>

          <label className='input-label'>
            to
            <input className="time-input" />
          </label>
        </div>
      </div>
      <div>
        <button>delete</button>
      </div>
    </div>
  );
};
