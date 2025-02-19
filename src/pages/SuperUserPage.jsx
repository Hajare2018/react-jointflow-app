import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../Redux/Actions/loader';
import { CircularProgress } from '@mui/material';
import { createSuperUser } from '../Redux/Actions/create-tenant';
import config from '../config';

function SuperUserPage({ forAdmin, schema, close }) {
  const [form, setForm] = useState({
    email: '',
  });
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const pathname = window.location.href;

  useEffect(() => {}, [form.email]);

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let uuid = '';
    if (pathname.includes('localhost')) {
      uuid = pathname.split(':')[3];
    } else {
      uuid = pathname.split(':')[2];
    }
    const requestData = {
      uuid: uuid,
      email_address: form.email,
      password: 'test1234',
    };
    const adminReqBody = {
      tenant_schema: schema,
      email_address: form.email,
      password: 'test1234',
    };
    dispatch(show(true));
    dispatch(
      createSuperUser({
        data: forAdmin ? adminReqBody : requestData,
        admin: forAdmin,
      }),
    );
    if (!loader.show) {
      setForm({ email: '' });
      if (forAdmin) {
        close();
      }
    }
  };
  return (
    <>
      <section
        id="page"
        className={!forAdmin ? 'form' : 'p-20'}
      >
        <form>
          {!forAdmin && (
            <p className="login-logo">
              <img src={config.REACT_APP_JF_LOGO} />
            </p>
          )}
          <div>
            <label htmlFor="">Please enter your admin user&apos;s address:</label>
            <div className="inputwprap">
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleForm}
              />
              <hr />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className={loader.show ? 'btn-white' : 'btn-blue'}
          >
            {loader.show ? <CircularProgress /> : forAdmin ? 'CREATE' : 'FINISH'}
          </button>
        </form>
      </section>
    </>
  );
}

export default React.memo(SuperUserPage);
