import React, { memo } from 'react'
import { Portal } from '../portal';
import './styles.scss';

export const PopUp = memo(({ children, onClose, isOpened }) => {
  if (!isOpened) {
    return null;
  }

  return (
    <Portal>
      <div className="popup" role="dialog">
        <div className="overlay" role="button" tabIndex={0} onClick={onClose} />
        <div className="content">
          {children}
        </div>
      </div>
    </Portal>
  );
})
