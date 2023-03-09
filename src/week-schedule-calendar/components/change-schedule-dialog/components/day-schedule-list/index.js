import React, { memo, useContext } from 'react';
import { DayScheduleCard } from '../day-schedule-card';
import { DialogContext } from '../../dialog-context';
import './styles.scss';

export const DayScheduleList = memo(() => {
  const { changingSchedule } = useContext(
    DialogContext
  );
  
  if (!changingSchedule) {
    return null;
  }

  return (
    <ul className='list-container'>
      {changingSchedule.map((chunk,i) => <DayScheduleCard scheduleChunk={chunk} key={chunk['_id']} index={i} />)}
    </ul>
  );
})
