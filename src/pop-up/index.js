import React, { memo, useEffect } from 'react'
import { Portal } from '../portal';
import './styles.scss';

export const PopUp = memo(({ children, onClose, isOpened }) => {
    useEffect(() => {
      if(isOpened ) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      }
    }, [isOpened]);

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
