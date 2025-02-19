import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../Redux/Actions/loader';
import { editUser } from '../../Redux/Actions/user-info';

export default function DeActivateUserDialog({ open, handleClose, data, forUsers }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const boards = useSelector((state) => state.docummentsData);

  const deActivateUser = () => {
    dispatch(show(true));
    const formData = new FormData();
    formData.append('first_name', data?.first_name);
    formData.append('last_name', data?.last_name);
    formData.append('is_active', data?.deactivate ? 'False' : 'True');
    formData.append('is_staff', data?.is_staff);
    formData.append('role', data?.role);
    formData.append('user_type', data?.user_type);
    formData.append('email', data?.email);
    if (data?.deactivate) {
      dispatch(
        editUser({
          id: data?.id,
          data: formData,
          onlyStaff: forUsers ? false : true,
        }),
      );
    } else {
      dispatch(
        editUser({
          id: data?.id,
          data: formData,
          onlyStaff__archived: forUsers ? false : true,
        }),
      );
    }
    if (!loader.show) {
      handleClose();
    }
  };

  const isUserOwnsABoard =
    boards?.data?.length > 0
      ? (boards || [])?.data?.filter(
          (item) => item?.owner_name === data?.first_name + ' ' + data?.last_name,
        )
      : [];
  return (
    <Dialog open={open}>
      <DialogTitle>
        <strong>
          {data.deactivate && isUserOwnsABoard?.length === 0
            ? 'Are you sure to Deactivate this user?'
            : !data.deactivate && isUserOwnsABoard?.length === 0
              ? "Are you sure you'd like to reactivate this user?"
              : isUserOwnsABoard?.length > 0 && data.deactivate
                ? `User owns ${isUserOwnsABoard?.length} projects, are you sure you want to deactivate this user?`
                : '¯'}
        </strong>
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={handleClose}
          color="primary"
        >
          NO
        </Button>
        <Button
          onClick={deActivateUser}
          color="primary"
        >
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
}
