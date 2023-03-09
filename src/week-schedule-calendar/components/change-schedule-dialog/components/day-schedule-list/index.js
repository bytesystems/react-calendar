import React, { memo } from 'react';
import { DayScheduleCard } from '../day-schedule-card';
import './styles.scss';
import { v4 } from 'uuid';

export const DayScheduleList = memo(({schedule}) => {
  
  if (!schedule) {
    return null;
  }
  return (
    <ul className='list-container'>
      {schedule.map((chunk,i) => <DayScheduleCard key={v4()} scheduleChunk={chunk} index={i} />)}
    </ul>
  );
})
