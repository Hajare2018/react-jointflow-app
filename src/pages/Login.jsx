import React, { useState } from 'react';
import { Alert, CircularProgress } from '@mui/material';
import EmailDialog from '../components/EmailDialog';
import VerificationDialog from '../components/Profile/VerificationDialog';
import Jointflows from '../component-lib/icons/jointflows';
import { useUserContext } from '../context/UserContext';
import { Field, Label, Fieldset, FieldGroup } from '../component-lib/catalyst/fieldset';
import { Input } from '../component-lib/catalyst/input';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const { loginUser, verifyOtp } = useUserContext();

  const closeOtpDialog = () => {
    setShowOTPDialog(false);
  };

  const handleUsername = (event) => {
    setError(null);
    setUsername(event.target.value.toLowerCase());
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handlePassword = (event) => {
    setError(null);
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await loginUser(username, password);
    if (result.status === 'invalid-email-password') {
      setError('Invalid username or password');
    } else if (result.status === 'error') {
      setError('Unknown error during login');
    } else if (result.status === 'require-otp') {
      setOtpToken(result.token);
      setShowOTPDialog(true);
    }
    setSubmitting(false);
  };

  const handleSubmitOtp = async (otp) => {
    const result = await verifyOtp(otp, otpToken);

    if (result.status === 'invalid-otp') {
      setError('Invalid OTP');
    } else if (result.status === 'error') {
      setError('Unknown error during verification');
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mb-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm p-4 bg-white px-6 py-12 sm:rounded-lg sm:px-12">
          <div className="flex justify-center mb-10">
            <Jointflows
              width={300}
              height={60}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <Fieldset>
              <FieldGroup>
                <Field>
                  <Label>Username</Label>
                  <Input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleUsername}
                  />
                </Field>
                <Field>
                  <Label>
                    <div className="flex items-center justify-between">
                      Password
                      <div className="text-sm">
                        <a
                          onClick={handleOpen}
                          className="font-semibold text-rose-600 hover:text-rose-500 cursor-pointer"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePassword}
                    className="user_password"
                  />
                </Field>
              </FieldGroup>
            </Fieldset>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                {submitting ? (
                  <CircularProgress style={{ width: 22, height: 22, color: 'inherit' }} />
                ) : (
                  'Sign in'
                )}
              </button>
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
            </div>
          </form>
        </div>
      </div>
      <EmailDialog
        open={open}
        autoFilled={username}
        handleClose={handleOpen}
        forPassword
      />
      <VerificationDialog
        open={showOTPDialog}
        handleClose={closeOtpDialog}
        handleSubmitOtp={handleSubmitOtp}
        forLogin
      />
    </>
  );
}

export default React.memo(Login);
