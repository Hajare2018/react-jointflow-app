import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayDialog, show } from '../Redux/Actions/loader';
import { CircularProgress } from '@mui/material';
import { createTenant, getUuidData } from '../Redux/Actions/create-tenant';
import HttpClient from '../Api/HttpClient';
import { showErrorSnackbar } from '../Redux/Actions/snackbar';
import ProgressModal from '../components/ProgressModal';
import newTabIcon from '../assets/icons/OpenNewTabIconBlue.png';
import config from '../config';

function InstancePage() {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const uuidData = useSelector((state) => state.uuidData);
  const [form, setForm] = useState({
    businessName: '',
    subDomain: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const showModal = useSelector((state) => state.dialog);

  useEffect(() => {}, [form, isChecked]);

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    setForm({
      businessName: uuidData?.data?.name,
      subDomain: uuidData?.data?.schema_name,
    });
  }, [uuidData]);

  useEffect(() => {
    if (typeof uuidData?.data !== 'object') {
      setIsChecked(!isChecked);
    }
    if (typeof uuidData?.data === 'object') {
      setIsChecked(!isChecked);
    }
  }, []);

  useEffect(() => {
    dispatch(getUuidData({ uuid: HttpClient.uuid }));
  }, []);

  const handleForm = (event) => {
    if (event.target.name === 'subDomain') {
      setForm({
        ...form,
        [event.target.name]: event.target.value
          .replace(/[^\w]/gi, '')
          .replaceAll(' ', '')
          .toLowerCase(),
      });
    }
    if (event.target.name === 'businessName') {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      name: form.businessName,
      schema_name: form.subDomain,
      uuid: HttpClient.uuid,
    };
    if (
      form.businessName === '' ||
      form.subDomain === '' ||
      typeof form.businessName === 'undefined' ||
      typeof form.subDomain === 'undefined'
    ) {
      dispatch(showErrorSnackbar('Please fill both Text Fields!'));
    } else {
      if (
        typeof uuidData?.data?.name === 'string' &&
        typeof uuidData?.data?.schema_name === 'string'
      ) {
        window.open(`/superuser/:${HttpClient.uuid}`, '_self');
      } else {
        dispatch(show(true));
        dispatch(createTenant({ data: requestData }));
        if (!loader.show) {
          setForm({
            businessName: '',
            subDomain: '',
          });
        }
      }
    }
  };
  const closeModal = () => {
    dispatch(displayDialog(false));
  };
  return (
    <>
      <section className="form">
        <form>
          <p className="login-logo">
            <img src={config.REACT_APP_JF_LOGO} />
          </p>
          <div>
            <label htmlFor="">Enter your business name</label>
            <div className="inputwprap">
              <input
                type="text"
                name="businessName"
                disabled={typeof uuidData?.data?.name === 'string'}
                value={form.businessName}
                onChange={handleForm}
              />
              <hr />
            </div>
          </div>
          <div>
            <label htmlFor="">Create your sub-domain</label>
            <div className="inputwprap">
              <input
                type="text"
                name="subDomain"
                disabled={typeof uuidData?.data?.schema_name === 'string'}
                value={form.subDomain}
                maxLength="15"
                onChange={handleForm}
              />
              <span>.appjointflows.com/</span>
            </div>
          </div>
          {Object.keys(uuidData?.data).length == 0 && (
            <div className="d-flex">
              <div className="input-checkbox mt-4">
                <input
                  type="checkbox"
                  onChange={handleCheck}
                  checked={isChecked}
                  name="terms"
                />
                <span></span>I have read and agree to Jointflows Terms and Conditions.
              </div>
              <a
                style={{ marginTop: 13, marginLeft: 5 }}
                href={
                  'https://jf-prod-public.s3.eu-west-1.amazonaws.com/terms_and_conditions/Jointflows+T%26Cs+01-04-2022+v0.2.htm'
                }
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={newTabIcon}
                  style={{ height: 15, width: 15 }}
                />
              </a>
            </div>
          )}
          <button
            type="button"
            disabled={!isChecked}
            onClick={handleSubmit}
            className={loader.show ? 'btn-white' : !isChecked ? 'btn-grey' : 'btn-blue'}
          >
            {loader.show ? <CircularProgress /> : 'NEXT'}
          </button>
        </form>
      </section>
      <ProgressModal
        open={showModal?.show}
        handleClose={closeModal}
      />
    </>
  );
}

export default React.memo(InstancePage);
