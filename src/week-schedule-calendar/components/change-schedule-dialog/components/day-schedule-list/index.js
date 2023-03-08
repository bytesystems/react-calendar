import React, { memo } from 'react';
import { DayScheduleCard } from '../day-schedule-card';
import './styles.scss';

export const DayScheduleList = memo(({schedule}) => {
  
  if (!schedule) {
    return null;
  }
  return (
    <ul className='list-container'>
      {schedule.map((chunk) => <DayScheduleCard scheduleChunk={chunk} />)}
    </ul>
  );
})
