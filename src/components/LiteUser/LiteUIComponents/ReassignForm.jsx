import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HttpClient from '../../../Api/HttpClient';
import { keepData, show } from '../../../Redux/Actions/loader';
import getSingleTask from '../../../Redux/Actions/single-task';
import { showSuccessSnackbar } from '../../../Redux/Actions/snackbar';
import { getDevice, handleError } from '../../Utils';
import { requestProjectLiteView } from '../../../Redux/Actions/dashboard-data';
import config from '../../../config';

export default function ReassignForm({ task, message }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const loader = useSelector((state) => state.showLoader);
  const liteData = useSelector((state) => state.dashboardLiteData);
  let project = liteData?.data?.length > 0 ? liteData?.data?.[0] : [];

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  useEffect(() => {}, [form.first_name, form.last_name, form.email]);
  const user_token = HttpClient.api_token();
  const user_tenant = HttpClient.tenant();
  const pathname = new URL(window.location.href);
  const board = new URLSearchParams(pathname.search).get('board');

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      Authorization: `Bearer ` + user_token,
      'X-DTS-SCHEMA': user_tenant,
    },
  };

  const formHeader = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: '*/*',
      Authorization: `Bearer ` + user_token,
      'X-DTS-SCHEMA': user_tenant,
    },
  };

  const handleReassignment = async (user_id) => {
    const requestBody = {
      id: task?.id,
      external_assignee: user_id,
    };
    return await axios
      .put(config.REACT_APP_BASE_URL + `cards/${task?.id}/`, requestBody, headers)
      .then((response) => {
        if (response) {
          dispatch(show(true));
          dispatch(requestProjectLiteView({ board: board }));
          dispatch(showSuccessSnackbar(response.data.details));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
  };

  const doReassign = async () => {
    let formData = new FormData();
    // formData.append('avatar', );
    formData.append('first_name', form.first_name);
    formData.append('last_name', form.last_name);
    formData.append('is_active', 'True');
    formData.append('is_staff', 'False');
    formData.append('role', 'buyer');
    formData.append('user_type', 'light');
    formData.append('buyer_company', project?.buyer_company_details_light?.id);
    formData.append('email', form.email);
    formData.append('linkedin_url', '');
    formData.append('phone_number', '');
    formData.append('password', 1234);
    formData.append('date_joined', new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
    await axios
      .post(config.REACT_APP_BASE_URL + `user/`, formData, formHeader)
      .then((response) => {
        if (response) {
          handleReassignment(response?.data?.user_id);
          if (message !== '') {
            sendMessage(response?.data?.user_id);
          }
          setForm({
            first_name: '',
            last_name: '',
            email: '',
            message: '',
          });
        }
      })
      .catch((error) => {
        if ('existing_user_id' in error?.response?.data) {
          handleReassignment(error?.response?.data?.existing_user_id);
          if (message !== '') {
            sendMessage(error?.response?.data?.existing_user_id);
          }
        } else {
          handleError(error, dispatch);
        }
      });
  };

  const sendMessage = async (owner_id) => {
    dispatch(keepData(false));
    const commentRequest = {
      card: task?.id,
      owner: owner_id,
      comment: message,
      client_facing: 'True',
      created_at: new Date().toISOString(),
    };
    return await axios
      .post(config.REACT_APP_BASE_URL + `comment/`, commentRequest, headers)
      .then((response) => {
        if (response) {
          getSingleTask({
            card_id: parseInt(task?.id),
            task_info: false,
          });
          setForm({
            first_name: '',
            last_name: '',
            email: '',
            message: '',
          });
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
  };
  const isMobile = getDevice();
  return (
    <div className="d-flex-column">
      <div className="form-group">
        <strong>First Name</strong>
        <input
          placeholder="John"
          value={form.first_name}
          disabled={task?.is_completed}
          style={{ backgroundColor: task?.is_completed && '#f7f8fb' }}
          name="first_name"
          onChange={handleForm}
          className="text-input first-name"
        />
      </div>
      <div className="form-group mt-2">
        <strong>Last Name</strong>
        <input
          placeholder="Doe"
          value={form.last_name}
          disabled={task?.is_completed}
          style={{ backgroundColor: task?.is_completed && '#f7f8fb' }}
          name="last_name"
          onChange={handleForm}
          className="text-input last-name"
        />
      </div>
      <div className="form-group mt-2">
        <strong>Email</strong>
        <input
          placeholder="email@example.com"
          value={form.email}
          disabled={task?.is_completed}
          style={{ backgroundColor: task?.is_completed && '#f7f8fb' }}
          name="email"
          onChange={handleForm}
          className="text-input email-field"
        />
      </div>
      <br />
      <div className="d-flex justify-space-between">
        <div>
          {task?.is_completed && (
            <strong className={`${isMobile && 'w-56'}`}>
              This task is approved but you can re-open it by clicking on the &quot;Re-open&quot;
              button in Approval tab.
            </strong>
          )}
        </div>
        <div className="text-right">
          <Button
            type="button"
            variant="contained"
            disabled={
              task?.is_completed ||
              message === '' ||
              form.first_name === '' ||
              form.last_name === '' ||
              form.email === ''
            }
            style={{
              backgroundColor:
                task?.is_completed ||
                message === '' ||
                form.first_name === '' ||
                form.last_name === '' ||
                form.email === ''
                  ? '#aeaeae'
                  : '#627daf',
              color: '#ffffff',
              textTransform: 'none',
            }}
            onClick={doReassign}
            id="assign"
            className="reassign-btn"
          >
            {loader.show ? (
              <CircularProgress
                size={15}
                color="#ffffff"
              />
            ) : (
              'Re-assign'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
