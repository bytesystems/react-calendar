import moment from 'moment/moment';
import React, { memo, useMemo } from 'react'
import { PopUp } from '../../../pop-up'
import { DayScheduleList } from './components/day-schedule-list';
import './styles.scss'

export const ChangeScheduleDialog = memo(({ onClose, isOpened, currentDay, currentDaySchedule, onConfirm }) => {

  const currentDayTitle = useMemo(() => {
    return moment(currentDay).format('dddd, D. MMMM YYYY')
  }, [currentDay]);

  const deepCopySchedule = useMemo(() => JSON.parse(JSON.stringify(currentDaySchedule)), [currentDaySchedule])

  return (
    <PopUp isOpened={isOpened} onClose={onClose}>
      <div className="container">
        <div className="header">
          <h2 className="changing-day-title">
            {currentDayTitle}
          </h2>
        </div>
        <div className='main'>
          <div className='cards-container'>
            <DayScheduleList schedule={deepCopySchedule} />
          </div>
          <div className='actions-buttons-container'>
            <button>add work time</button>
            <button>add rest time</button>
          </div>
        </div>
        <div className='buttons'>
          <button>save</button>
        </div>
      </div>
    </PopUp>
  );
});
