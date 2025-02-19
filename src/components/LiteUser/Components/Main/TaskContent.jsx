import React, { useEffect, useState } from 'react';
import Alert from '../../icons/alert';
import Phone from '../../icons/phone';
import User from '../../../../assets/icons/user.png';
import { Avatar, Chip, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createImageFromInitials,
  getBoardStatus,
  getDevice,
  getDuration,
  timeAgo,
} from '../../../Utils';
import { Check, CloseOutlined, Edit } from '@mui/icons-material';
import { editLiteUser } from '../../../../Redux/Actions/user-info';
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
import editTaskData from '../../../../Redux/Actions/update-task-info';
import { useUserContext } from '../../../../context/UserContext';

function EditPhone({ data, id, handleShow }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const [phone, setPhone] = useState(null);
  const handlePhoneNumber = (event) => {
    setPhone(event.target.value);
  };
  useEffect(() => {
    setPhone(
      data?.phone_number === null || data?.phone_number === 'undefined' ? '' : data?.phone_number,
    );
  }, [data]);
  const handleUpdatePhone = () => {
    const formData = new FormData();
    formData.append('phone_number', phone);
    dispatch(editLiteUser({ data: formData, card_id: id }));
    if (!loader.show) {
      handleShow();
    }
  };
  return (
    <div
      style={{
        border: '2px solid #627daf',
        borderRadius: '0.5rem',
      }}
      className="phone_input"
    >
      <input
        className="ml-1"
        type="text"
        value={phone}
        onChange={handlePhoneNumber}
        maxLength={12}
        autoFocus
      />
      <button
        onClick={handleUpdatePhone}
        style={{
          height: 38,
          width: 38,
          backgroundColor: '#627daf',
          color: '#ffffff',
        }}
      >
        <Check className="h-7 w-7 text-white" />
      </button>
      <button
        onClick={handleShow}
        className="h-7 w-7"
      >
        <CloseOutlined className="h-7 w-7 light-orange" />
      </button>
    </div>
  );
}

function TaskContent() {
  const dispatch = useDispatch();
  const { user } = useUserContext();
  const fullUrl = new URL(window.location.href);
  let search_params = fullUrl.searchParams;
  const board__id = search_params.get('board');
  const tasks = useSelector((state) => state.singleCardData);
  const taskData = tasks?.data?.length > 0 ? tasks?.data?.[0] : [];
  const [edit, setEdit] = useState(false);
  // TODO FIXME showDatePicker and showTooltip are never used, should be removed
  // eslint-disable-next-line no-unused-vars
  const [showDatePicker, setShowDatePicker] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showTooltip, setShowTooltip] = useState(false);
  const [date, setDate] = useState(
    taskData?.is_completed
      ? moment(taskData?.actual_completion_date).toDate()
      : moment(taskData?.end_date).toDate(),
  );
  const isMobile = getDevice();
  const assignee =
    taskData?.side === 'internal'
      ? taskData?.internal_assignee_details
      : taskData?.external_assignee_details;

  const handleChangeDate = (date) => {
    setDate(new Date(date));
    let d = new Date(date);
    let new_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    handleUpdateDate(new_date);
  };

  const handleUpdateDate = (date) => {
    dispatch(
      editTaskData({
        id: taskData?.id,
        board: board__id,
        end_date: date,
        liteView: true,
      }),
    );
    setShowDatePicker(false);
  };
  return (
    <div className={`grid gap-2 grid-cols-${isMobile ? 1 : 2} mb-5`}>
      <div>
        <p className="opacity-80 text-lg mb-2">Task</p>
        <b className="text-lg">{taskData?.title}</b>
      </div>
      <div>
        <p className="opacity-80 text-lg flex gap-2 mb-2">
          {!taskData?.is_completed && 'Target'} Completion Date
          {!taskData?.is_completed && getDuration(new Date(taskData?.end_date), new Date()) < 0 && (
            <Alert className="w-4 text-danger" />
          )}
        </p>
        <div className="d-flex-column">
          <ReactDatePicker
            className={'form-date-picker'}
            style={{
              cursor: user?.id === assignee?.id ? 'pointer' : '',
              width: 50,
            }}
            dateFormat="dd/MM/yyyy"
            locale="en-GB"
            required
            selected={date}
            onChange={(date) => {
              handleChangeDate(moment(date).toDate());
            }}
            selectsEnd
            disabled={user?.id !== assignee?.id}
            onFocus={() => setShowTooltip(true)}
            onBlur={() => setShowTooltip(false)}
            onInputClick={() => setShowTooltip(false)}
          />
          <i>
            {taskData?.is_completed
              ? `${timeAgo(new Date(taskData?.actual_completion_date))}`
              : getDuration(new Date(taskData?.end_date), new Date()) < 0
                ? `${Math.abs(
                    getDuration(new Date(taskData?.end_date), new Date()),
                  )} days behind target!`
                : 'in ' + Math.abs(getDuration(new Date(taskData?.end_date), new Date())) + ' days'}
          </i>
        </div>
      </div>
      <div>
        <p className="opacity-80 text-lg mb-2">Status</p>
        <Chip
          size="small"
          label={getBoardStatus(taskData?.is_completed, taskData?.start_date).text}
          variant="default"
          style={{
            color: getBoardStatus(taskData?.is_completed, taskData?.start_date).color,
            backgroundColor: getBoardStatus(taskData?.is_completed, taskData?.start_date)
              .background,
            fontWeight: '700',
          }}
        />
      </div>
      <div>
        <p className="opacity-80 text-lg flex gap-2 mb-2">Objective</p>
        <p dangerouslySetInnerHTML={{ __html: taskData?.description }} />
      </div>
      <div>
        <p className="opacity-80 text-lg flex gap-2 mb-2">Assignee</p>
        <div className="flex items-center">
          <img
            src={
              assignee == null
                ? User
                : assignee?.avatar == null
                  ? createImageFromInitials(
                      200,
                      assignee?.first_name + ' ' + assignee?.last_name,
                      '#627daf',
                    )
                  : assignee?.avatar
            }
            className="rounded-full w-14 h-14 object-cover"
            alt=""
          />
          <div className="flex flex-col ml-5 mr-5">
            <b className="text-lg opacity-90 font-bold-20">
              {assignee == null ? 'Unassigned' : assignee?.first_name + ' ' + assignee?.last_name}
            </b>
            <p className="opacity-80 text-md">{assignee?.role}</p>
          </div>
          {edit ? (
            <EditPhone
              data={assignee}
              id={taskData?.id}
              handleShow={() => setEdit(false)}
            />
          ) : (
            <span className="relative m-2">
              {(assignee?.phone_number == null ||
                assignee?.phone_number == 'Unknown' ||
                assignee?.phone_number == undefined) && (
                <Alert className="w-4 absolute z-50 right-0 text-danger" />
              )}
              <Tooltip
                title={
                  assignee?.phone_number == null || assignee?.phone_number == 'undefined'
                    ? 'Unknown'
                    : assignee?.phone_number
                }
              >
                <button className="btn-icon active opacity-50">
                  <Avatar className="w-12 h-12">
                    {isMobile &&
                    (assignee?.phone_number !== null ||
                      assignee?.phone_number !== 'Unknown' ||
                      assignee?.phone_number !== 'undefined') ? (
                      <a
                        href={'tel:' + assignee?.phone_number}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Phone
                          className="w-8 h-8"
                          alt=""
                        />
                      </a>
                    ) : (
                      <Phone
                        className="w-8 h-8"
                        alt=""
                      />
                    )}
                  </Avatar>
                </button>
              </Tooltip>
              {user.id === assignee?.id && (
                <div
                  style={{
                    backgroundColor: '#627daf',
                    borderRadius: '50%',
                    height: 22,
                    width: 22,
                    right: -5,
                  }}
                  className="absolute z-50 bottom-0"
                >
                  <button onClick={() => setEdit(true)}>
                    <Edit className="w-6 text-white p-1" />
                  </button>
                </div>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(TaskContent);
