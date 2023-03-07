import React, { memo } from 'react'

export const ButtonAddSchedule = memo((props) => {
  const {onClick} = props;
  return (
    <button onClick={onClick}>+</button>
  )
})
