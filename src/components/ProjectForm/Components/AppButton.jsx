import React from 'react';
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    maxWidth: 'none',
  },
}))(Tooltip);

function AppButton({
  outlined,
  contained,
  buttonText,
  buttonIcon,
  greyButton,
  onClick,
  disabled,
  className,
  tooltip,
}) {
  const BootstrapButton = withStyles({
    root: {
      boxShadow: 'none',
      textTransform: 'none',
      padding: '3px 8px',
      border: '1px solid',
      backgroundColor: contained ? '#627daf' : greyButton ? '#eef2f6' : '',
      borderColor: outlined ? '#627daf' : greyButton ? '#eef2f6' : contained ? '#627daf' : '',
      color: outlined ? '#627daf' : greyButton ? '#000000' : contained ? '#ffffff' : '#000000',
      '&:hover': {
        backgroundColor: outlined
          ? '#627daf'
          : greyButton
            ? '#ffffff'
            : contained
              ? '#ffffff'
              : '#ffffff',
        borderColor: greyButton ? '#000000' : '#627daf',
        color: greyButton ? '#000000' : outlined ? '#ffffff' : '#627daf',
        boxShadow: 'none',
      },
      '&.Mui-disabled': {
        pointerEvents: 'auto',
      },
    },
  })(Button);
  return (
    <StyledTooltip title={tooltip}>
      {outlined ? (
        <BootstrapButton
          disabled={disabled}
          onClick={onClick}
          startIcon={buttonIcon ? buttonIcon : ''}
          variant="outlined"
          className={className}
        >
          {buttonText}
        </BootstrapButton>
      ) : contained ? (
        <BootstrapButton
          disabled={disabled}
          onClick={onClick}
          startIcon={buttonIcon ? buttonIcon : ''}
          variant="contained"
          className={className}
        >
          {buttonText}
        </BootstrapButton>
      ) : greyButton ? (
        <BootstrapButton
          disabled={disabled}
          onClick={onClick}
          startIcon={buttonIcon ? buttonIcon : ''}
          variant="contained"
          className={className}
        >
          {buttonText}
        </BootstrapButton>
      ) : (
        ''
      )}
    </StyledTooltip>
  );
}

export default React.memo(AppButton);
