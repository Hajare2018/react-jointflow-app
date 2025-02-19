import { Fab, Tooltip } from '@mui/material';
import React, { useState } from 'react';

function QuickDial({
  openIcon,
  closeIcon,
  actions,
  handleQuickDial,
  direction,
  justify,
  styles,
  toggleButtonStyles,
  toggleName,
  forDealPolice,
}) {
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  return (
    <div>
      <div
        className={styles.secondary}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: justify,
          flexDirection: direction,
        }}
      >
        {show
          ? actions?.map((action) => (
              // TODO FIXME
              // eslint-disable-next-line react/jsx-key
              <Tooltip
                title={action.name}
                placement={direction === 'row' || direction === 'row-reverse' ? 'top' : 'left'}
              >
                <Fab
                  style={{
                    backgroundColor: action.background,
                    color: action.color,
                    margin: '0.25rem',
                    boxShadow: '10px 2px 10px rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={() => {
                    handleQuickDial(action);
                    if (forDealPolice && action.name !== 'Edit Details') {
                      toggle();
                    }
                  }}
                  size="small"
                  className={action.class}
                >
                  {action.icon}
                </Fab>
              </Tooltip>
            ))
          : ''}
      </div>
      <Tooltip
        title={toggleName}
        placement="bottom"
      >
        <Fab
          size="small"
          style={{
            backgroundColor: toggleButtonStyles.background,
            color: toggleButtonStyles.color,
            boxShadow: '10px 2px 10px rgba(0, 0, 0, 0.3)',
          }}
          onClick={toggle}
          className="quick-dial"
        >
          {show ? closeIcon : openIcon}
        </Fab>
      </Tooltip>
    </div>
  );
}

export default React.memo(QuickDial);
