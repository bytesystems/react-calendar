import React, { memo, useContext } from 'react';
import { DayScheduleCard } from '../day-schedule-card';
import { DialogContext } from '../../dialog-context';
import './styles.scss';

export const DayScheduleList = memo(() => {
  const { schedule } = useContext(
    DialogContext
  );
  
  if (!schedule) {
    return null;
  }

  return (
    <ul className='list-container'>
      {schedule.map((chunk,i) => <DayScheduleCard scheduleChunk={chunk} key={chunk['_id']} index={i} />)}
    </ul>
  );
})
