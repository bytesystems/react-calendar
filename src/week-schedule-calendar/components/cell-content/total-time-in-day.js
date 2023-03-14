import React, {memo, useMemo} from 'react'
import {format24H} from "../../utils/time-utils";

export const TotalTimeInDay = memo((props) => {
  const { workTime, restTime } = props;


  return (
    <b className="total-time-in-delay">{ `${format24H(workTime)} Arbeit + ${format24H(restTime)} Pause`}</b>
  )
})
