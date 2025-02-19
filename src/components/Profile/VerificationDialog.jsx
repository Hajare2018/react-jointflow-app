import { Dialog, DialogTitle, Divider, IconButton, Slide, Tooltip, Alert } from '@mui/material';
import { Close, FileCopyOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import ReactInputVerificationCode from 'react-input-verification-code';
import { useDispatch, useSelector } from 'react-redux';
import { submitOtp } from '../../Redux/Actions/mfa';
import { showInfoSnackbar } from '../../Redux/Actions/snackbar';
import GoogleAuthIcon from '../../assets/icons/google-auth-icon.png';
import MsftAuthIcon from '../../assets/icons/MicrosoftAuthenticator_App.png';
import GetOnGoogle from '../../assets/icons/GetOnGooglePlayIcon.png';
import GetOnApple from '../../assets/icons/GetOnAppleStore.png';
import './verificationDialog.css';

export const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

export default function VerificationDialog({
  open,
  handleClose,
  showQr,
  forLogin,
  handleSubmitOtp,
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const loader = useSelector((state) => state.showLoader);
  const secret_url = useSelector((state) => state.secretUrlData);
  const dispatch = useDispatch();

  const handleCopy = () => {
    navigator.clipboard.writeText(secret_url?.data);
    dispatch(showInfoSnackbar('Copied to clipboard!'));
  };

  const doSubmitOtp = async () => {
    const reqBody = {
      mfa: secret_url?.data?.hasOwnProperty('details') ? 'False' : 'True',
      otp: value,
    };

    if (showQr) {
      dispatch(submitOtp(reqBody));
      if (!loader.show) {
        setValue('');
        setTimeout(() => {
          handleClose();
        }, 1000);
      }
    } else {
      handleSubmitOtp(value);
      close();
    }
  };

  const close = () => {
    setValue('');
    setError(null);
    handleClose();
  };
  return (
    <div>
      <Dialog
        maxWidth="sm"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="m-3">
          <IconButton
            style={{ float: 'right' }}
            onClick={close}
          >
            <Close style={{ color: '#ef6c65' }} />
          </IconButton>
          <DialogTitle style={{ textAlign: 'center' }}>
            {showQr ? (
              <strong>Please scan the below QR code to get the OTP.</strong>
            ) : (
              <strong>Enter 6-digit passcode here.</strong>
            )}
          </DialogTitle>
          {showQr && !secret_url?.data?.hasOwnProperty('details') ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <QRCode
                value={secret_url?.data}
                logoHeight="20"
                logoWidth="20"
                logoImage="../../assets/icons/jointflows-icon.png"
              />
              <Tooltip
                title="Copy QR Code Secret Link"
                placement="top"
              >
                <div
                  onClick={handleCopy}
                  className="mt-2"
                >
                  <FileCopyOutlined style={{ height: 30, width: 30 }} />
                </div>
              </Tooltip>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#ef6c65' }}>{secret_url?.data?.details}</strong>
            </div>
          )}
          <div className="verificationCodeContainer">
            <ReactInputVerificationCode
              value={value}
              placeholder={null}
              length={6}
              onChange={(newValue) => {
                setValue(newValue);
                if (newValue !== '') {
                  setError(null);
                }
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
            }}
          >
            <button
              onClick={doSubmitOtp}
              disabled={value.length < 6}
              style={{
                backgroundColor: value.length < 6 ? '#aeaeae' : '#627daf',
                marginTop: 20,
                color: '#ffffff',
                borderRadius: 24,
                border: 'none',
                outline: 'none',
                width: 312,
                height: 48,
              }}
            >
              {showQr && !secret_url?.data?.hasOwnProperty('details')
                ? 'Verify'
                : secret_url?.data?.hasOwnProperty('details')
                  ? 'Disable'
                  : 'Validate'}
            </button>
          </div>
          {error && (
            <Alert
              elevation={1}
              severity="error"
              variant="filled"
              style={{ marginTop: 16 }}
            >
              {error}
            </Alert>
          )}
          {showQr && (
            <div className="text-centre m-4">
              <strong>
                Note: Google or Microsoft Authenticator App is required to generate the OTP.
              </strong>
            </div>
          )}
          {!forLogin && (
            <div className="d-flex mt-5">
              <div
                style={{
                  flex: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Tooltip
                  title="Google Authenticator App"
                  placement="top"
                >
                  <img
                    src={GoogleAuthIcon}
                    style={{ height: 60, width: 60 }}
                  />
                </Tooltip>
                <div className="d-flex mt-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_GB&gl=US"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={GetOnGoogle}
                      style={{ height: 30, width: 100, margin: 5 }}
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={GetOnApple}
                      style={{ height: 30, width: 100, margin: 5 }}
                    />
                  </a>
                </div>
              </div>
              <Divider
                orientation="vertical"
                flexItem
              />
              <div
                style={{
                  flex: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <Tooltip
                  title="Microsoft Authenticator App"
                  placement="top"
                >
                  <img
                    src={MsftAuthIcon}
                    style={{ height: 60, width: 60 }}
                  />
                </Tooltip>
                <div className="d-flex mt-3">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=en_GB&gl=US"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={GetOnGoogle}
                      style={{ height: 30, width: 100, margin: 5 }}
                    />
                  </a>
                  <a
                    href="https://apps.apple.com/us/app/microsoft-authenticator/id983156458"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={GetOnApple}
                      style={{ height: 30, width: 100, margin: 5 }}
                    />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
