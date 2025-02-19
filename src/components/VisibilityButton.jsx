import { VisibilityOff, VisibilitySharp } from '@mui/icons-material';

export const VisibilityButton = ({ isLockActivated, isAdmin, row, handleTaskVisibility }) => {
  let isIconDisabled = false;

  // disable the button if the internal lock is activated, the task side is internal and the user is not admin
  if (isLockActivated && row.side === 'internal' && !isAdmin) {
    isIconDisabled = true;
  }

  return (
    <button
      className={isIconDisabled ? '' : 'cursor-pointer'}
      disabled={isIconDisabled}
      onClick={() => handleTaskVisibility(row)}
    >
      {row?.client_visible ? (
        <VisibilitySharp className={isIconDisabled ? 'text-gray-500' : 'text-green-500'} />
      ) : (
        <VisibilityOff className={isIconDisabled ? 'text-gray-500' : 'text-red-500'} />
      )}
    </button>
  );
};
