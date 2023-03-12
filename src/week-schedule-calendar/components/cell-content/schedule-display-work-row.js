import moment from 'moment';
import React, { memo, useCallback } from 'react'

export const ScheduleDisplayWorkRow = memo((props) => {
  const { chunk } = props;
  const { start, stop } = chunk;

  return (
    <p style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{start} --&gt; {stop}</p>
  )
})