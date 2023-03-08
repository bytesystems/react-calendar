import moment from 'moment/moment';
import React, { memo, useMemo } from 'react'
import { PopUp } from '../../../pop-up'
import './styles.scss'

export const AddScheduleChunkDialog = memo(({ onClose, isOpened, currentDay, currentDaySchedule, onConfirm }) => {

  const currentDayTitle = useMemo(() => {
    return moment(currentDay).format('dddd, D. MMMM YYYY')
  }, [currentDay]);

  return (
    <PopUp isOpened={isOpened} onClose={onClose}>
      <div className="container">
        <h2 className="changing-day-title">
          {currentDayTitle}
        </h2>
        
      </div>
    </PopUp>
  );
});
