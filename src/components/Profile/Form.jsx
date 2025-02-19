import { Checkbox, Dialog, FormControlLabel, IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editUser, requestUserEmailTest } from '../../Redux/Actions/user-info';
import { Transition } from './VerificationDialog';
import { useUserContext } from '../../context/UserContext';

function Form({ open, handleClose, logo }) {
  const loader = useSelector((state) => state.showLoader);
  const dispatch = useDispatch();
  const { user } = useUserContext();
  const [form, setForm] = useState({
    smtp_username: '',
    smtp_password: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const handleClear = () => {
    setForm({
      smtp_username: user?.smtp_username,
      smtp_password: '',
    });
    handleClose(logo);
  };
  const handleForm = (event) => {
    event.preventDefault();
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    setForm({
      smtp_username: user?.smtp_username,
    });
  }, []);

  const formData = new FormData();
  formData.append('smtp_username', isChecked ? form.smtp_username : '');
  formData.append('smtp_password', isChecked ? form.smtp_password : '');
  formData.append('send_me_as', isChecked);
  const handleSubmit = () => {
    dispatch(editUser({ id: user?.id, data: formData, onlyUser: true }));
    if (!loader.show) {
      handleClear();
    }
  };

  const handleCheck = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleTest = () => {
    dispatch(requestUserEmailTest({ id: user?.id, data: formData }));
  };

  useEffect(() => {}, [form]);
  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      open={open}
      maxWidth="sm"
    >
      <div>
        <IconButton
          style={{ float: 'right' }}
          onClick={handleClear}
        >
          <Clear style={{ fontSize: 30, color: '#999' }} />
        </IconButton>
      </div>
      <section className="p-10">
        <form>
          <p className="login-logo">
            <img src={logo} />
          </p>
          <div style={{ marginTop: 20 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={handleCheck}
                />
              }
              label={<strong>Send notifications through my account</strong>}
            />
            <label>Username</label>
            <div className="inputwprap">
              <input
                type="text"
                name="smtp_username"
                value={form.smtp_username}
                onChange={handleForm}
                disabled={isChecked ? false : true}
              />
              <hr />
            </div>
          </div>
          <div>
            <label>Password</label>
            <div className="inputwprap">
              <input
                type="password"
                name="smtp_password"
                value={form.smtp_password}
                onChange={handleForm}
                disabled={isChecked ? false : true}
              />
              <hr />
            </div>
          </div>
          <div className="d-flex justify-space-between mt-3">
            <button
              type="button"
              onClick={handleSubmit}
              className={loader.show ? 'btn-white' : 'btn-blue'}
            >
              SAVE
            </button>
            <div style={{ width: 40 }} />
            <button
              type="button"
              onClick={handleTest}
              className={loader.show ? 'btn-white' : 'btn-blue'}
            >
              TEST
            </button>
          </div>
        </form>
      </section>
    </Dialog>
  );
}

export default React.memo(Form);
