import React, { memo } from 'react'
import { PopUp } from '../../pop-up'

export const AddScheduleChunk = memo(({ onClose, isOpened }) => {
  console.log({ onClose, isOpened })
  return (
    <PopUp isOpened={isOpened} onClose={onClose}>
      <div>
        ghahagafsdafsadfasfgsad
      </div>
    </PopUp>
  );
});
