import moment from 'moment';
import React, { memo, useCallback } from 'react'

export const ScheduleDisplayWorkRow = memo((props) => {
  const { chunk } = props;
  const { start, stop } = chunk;

  const getTimeIn24Format = useCallback((time) => moment(time).format('HH:mm'), [])

  return (
    <p>{getTimeIn24Format(start)} --&gt; {getTimeIn24Format(stop)}</p>
  )
})