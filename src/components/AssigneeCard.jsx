import {
  Avatar,
  Badge,
  Button,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { AccountBoxOutlined, Edit, Email, Phone } from '@mui/icons-material';
import React from 'react';
import { createImageFromInitials } from './Utils';
import ImgDialog from './Profile/ImgDialog';

const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

const StyledBadge = withStyles(() => ({
  badge: {
    right: 20,
    top: 120,
    '@media (max-width: 1023px)': {
      top: 70,
    },
    padding: '0 4px',
    height: 30,
    width: 30,
    borderRadius: '50%',
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
}))(Badge);

function AssigneeCard({ open, handleClose, dialogContent }) {
  const [showImgDialog, setShowImgDialog] = React.useState(false);
  // TODO FIXME this seems strange that the imgBlob is never used
  // eslint-disable-next-line no-unused-vars
  const [imgBlob, setImgBlob] = React.useState(null);

  const handleShowImgDialog = () => {
    setShowImgDialog(true);
  };

  const handleCloseImgDialog = () => {
    setShowImgDialog(false);
  };

  const handleShowImg = (e) => {
    setImgBlob(e.img);
  };

  return (
    <div>
      <Dialog
        maxWidth="xs"
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div
          style={{
            backgroundColor: 'rgba(99, 133, 183, 1)',
            color: '#ffffff',
          }}
        >
          <DialogTitle className="text-centre">
            {dialogContent?.internal || dialogContent?.external ? (
              <strong>{dialogContent?.internal ? 'Internal Assignee' : 'External Assignee'}</strong>
            ) : (
              <strong>
                {dialogContent?.data?.user_type === 'full' ? 'Internal User' : 'External User'}
              </strong>
            )}
          </DialogTitle>
          <DialogContent
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div className="d-flex justify-centre">
              <StyledBadge
                badgeContent={
                  <IconButton onClick={handleShowImgDialog}>
                    <Edit style={{ fontSize: 15, color: '#6385b7' }} />
                  </IconButton>
                }
                color="primary"
              >
                <Avatar
                  src={
                    dialogContent?.data?.avatar === null
                      ? createImageFromInitials(
                          200,
                          dialogContent?.data?.first_name + ' ' + dialogContent?.data?.last_name,
                          '#6385b7',
                        )
                      : dialogContent?.data?.avatar
                  }
                  style={{ height: 150, width: 150, marginBottom: 10 }}
                />
              </StyledBadge>
            </div>
            <h2>
              <strong>
                {dialogContent?.data?.first_name + ' ' + dialogContent?.data?.last_name}
              </strong>
            </h2>
            <h2>
              <AccountBoxOutlined /> <strong>{dialogContent?.data?.role}</strong>
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                marginTop: 10,
              }}
            >
              <div className="mb-2">
                <strong>Contacts:</strong>
                <h4>
                  <Email />{' '}
                  <a
                    href={'mailto:' + dialogContent?.data?.email}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <u>{dialogContent?.data?.email}</u>
                  </a>
                </h4>
                <h4>
                  <Phone />{' '}
                  {dialogContent?.data?.phone_number === 'false' ? (
                    'Unknown'
                  ) : dialogContent?.data?.phone_number === '' ? (
                    'Unknown'
                  ) : dialogContent?.data?.phone_number == 'undefined' ? (
                    'Unknown'
                  ) : (
                    <a
                      href={'tel:' + dialogContent?.data?.phone_number}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <u>{dialogContent?.data?.phone_number}</u>
                    </a>
                  )}
                </h4>
              </div>
              {dialogContent?.data?.reports_to_details !== null && (
                <div className="mb-2">
                  <strong>Reports to:</strong>
                  <CardHeader
                    style={{ padding: 2 }}
                    avatar={<Avatar src={dialogContent?.data?.reports_to_details?.avatar} />}
                    title={
                      <strong>
                        {dialogContent?.data?.reports_to_details?.first_name +
                          ' ' +
                          dialogContent?.data?.reports_to_details?.last_name}
                      </strong>
                    }
                    subheader={
                      <p style={{ color: '#ffffff' }}>
                        {dialogContent?.data?.reports_to_details?.role}
                      </p>
                    }
                  />
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions
            style={{
              justifyContent: 'center',
              backgroundColor: '#222',
            }}
          >
            <Button
              onClick={handleClose}
              style={{ color: '#ffffff' }}
            >
              OK
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      <ImgDialog
        open={showImgDialog}
        image={dialogContent?.data?.avatar}
        forEdit={true}
        showImg={handleShowImg}
        profileData={dialogContent?.data}
        handleClose={handleCloseImgDialog}
      />
    </div>
  );
}

export default React.memo(AssigneeCard);
