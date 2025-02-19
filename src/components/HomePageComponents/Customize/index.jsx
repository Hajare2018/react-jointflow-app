import { Dialog } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doSelectUser, setMonthlyData, setQuarterData, show } from '../../../Redux/Actions/loader';
import { showWarningSnackbar } from '../../../Redux/Actions/snackbar';
import { loadForecast } from '../../../Redux/Actions/user-access';
import {
  getCurrentQuarter,
  getDateFormat,
  getLastQuarter,
  getMonthDates,
  getNextQuarter,
  lastQuarterCount,
  nextQuarterCount,
} from '../../Utils';
import { getSingleUser } from '../../../Redux/Actions/user-info';
import { useTenantContext } from '../../../context/TenantContext';

function Customize({ open, handleClose, view }) {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState({
    start_date: '',
    end_date: '',
    year: '',
    quarter: '',
  });
  const [selectedMonth, setSelectedMonth] = useState({
    start_date: '',
    end_date: '',
    year: '',
    month: '',
  });
  const [selectedType, setSelectedType] = useState(null);
  const usersData = useSelector((state) => state.allLightUsersData);
  const users = usersData?.data?.length > 0 ? usersData?.data : [];
  const { year_end_month, project_type_list: projectTypeList } = useTenantContext();
  users.sort((a, b) => {
    if (a.first_name < b.first_name) {
      return -1;
    }
    if (a.first_name > b.first_name) {
      return 1;
    }
    return 0;
  });

  const handleUserSelection = (event) => {
    setSelectedUser(event.target.value);
  };

  useEffect(() => {}, [selectedQuarter, selectedUser]);

  const thisQuarter = year_end_month !== undefined ? getCurrentQuarter(year_end_month) : '';
  const thisQuarterStartDate = getDateFormat(thisQuarter?.start_date);
  const thisQuarterEndDate = getDateFormat(thisQuarter?.end_date);
  const nextQuarter = getNextQuarter(thisQuarter?.end_date);
  const nextQuarterStartDate = getDateFormat(nextQuarter?.start_date);
  const nextQuarterEndDate = getDateFormat(nextQuarter?.end_date);
  const lastQuarter = getLastQuarter(thisQuarter?.start_date);
  const lastQuarterStartDate = getDateFormat(lastQuarter?.start_date);
  const lastQuarterEndDate = getDateFormat(lastQuarter?.end_date);

  const handleQuarterSelection = (event) => {
    if (event.target.value == 'this-quarter') {
      setSelectedQuarter({
        start_date: thisQuarterStartDate,
        end_date: thisQuarterEndDate,
        year: thisQuarter?.year,
        quarter: thisQuarter?.quarter,
      });
    } else if (event.target.value == 'next-quarter') {
      setSelectedQuarter({
        start_date: nextQuarterStartDate,
        end_date: nextQuarterEndDate,
        year: nextQuarter?.year,
        quarter: nextQuarterCount(thisQuarter?.quarter),
      });
    } else if (event.target.value == 'last-quarter') {
      setSelectedQuarter({
        start_date: lastQuarterStartDate,
        end_date: lastQuarterEndDate,
        year: lastQuarter?.year,
        quarter: lastQuarterCount(thisQuarter?.quarter),
      });
    }
  };

  const handleMonthSelection = (event) => {
    if (event.target.value == 'this-month') {
      const dates = getMonthDates(0);
      setSelectedMonth({
        start_date: getDateFormat(dates.start_date),
        end_date: getDateFormat(dates.end_date),
        year: dates.end_date.getFullYear(),
        month: dates.end_date.getMonth(),
      });
    } else if (event.target.value == 'last-month') {
      const dates = getMonthDates(-1);
      setSelectedMonth({
        start_date: getDateFormat(dates.start_date),
        end_date: getDateFormat(dates.end_date),
        year: dates.end_date.getFullYear(),
        month: dates.end_date.getMonth(),
      });
    } else if (event.target.value == 'next-month') {
      const dates = getMonthDates(1);
      setSelectedMonth({
        start_date: getDateFormat(dates.start_date),
        end_date: getDateFormat(dates.end_date),
        year: dates.end_date.getFullYear(),
        month: dates.end_date.getMonth(),
      });
    }
  };

  const handleSelectedType = (event) => {
    setSelectedType(event.target.value);
  };

  const handleClear = () => {
    setSelectedUser(null);
    setSelectedQuarter({
      start_date: '',
      end_date: '',
      year: '',
      quarter: '',
    });
    setSelectedMonth({
      start_date: '',
      end_date: '',
      year: '',
      month: '',
    });
    setSelectedType(null);
    handleClose();
  };

  const handleCustomize = () => {
    const filteredUser = users?.filter((user) => user.id == selectedUser);
    if (view === 'monthly_view') {
      if (selectedMonth?.start_date === '' && selectedMonth?.end_date === '') {
        dispatch(showWarningSnackbar('Please Select a Month!'));
      } else if (selectedUser == null && selectedType == null) {
        dispatch(showWarningSnackbar('Please select a User and/or a Project Type!'));
      } else {
        dispatch(show(true));
        if (selectedUser !== null) {
          dispatch(doSelectUser(true));
          dispatch(getSingleUser({ id: selectedUser }));
        } else {
          dispatch(doSelectUser(false));
          dispatch(getSingleUser({ id: 0 }));
        }
        dispatch(
          loadForecast({
            id: selectedUser,
            start_date: selectedMonth?.start_date,
            end_date: selectedMonth?.end_date,
            project_type: selectedType,
          }),
        );
        dispatch(
          setMonthlyData({
            year: selectedMonth.year,
            user: filteredUser?.[0]?.avatar,
            month: selectedMonth.month,
            endDate: selectedMonth?.end_date,
          }),
        );
        handleClear();
      }
    } else {
      if (selectedQuarter?.start_date === '' && selectedQuarter?.end_date === '') {
        dispatch(showWarningSnackbar('Please Select a Quarter!'));
      } else if (selectedUser == null && selectedType == null) {
        dispatch(showWarningSnackbar('Please select a User and/or a Project Type!'));
      } else {
        dispatch(show(true));
        if (selectedUser !== null) {
          dispatch(doSelectUser(true));
          dispatch(getSingleUser({ id: selectedUser }));
        } else {
          dispatch(doSelectUser(false));
          dispatch(getSingleUser({ id: 0 }));
        }
        dispatch(
          loadForecast({
            id: selectedUser,
            start_date: selectedQuarter?.start_date,
            end_date: selectedQuarter?.end_date,
            project_type: selectedType,
          }),
        );
        dispatch(
          setQuarterData({
            year: selectedQuarter?.year,
            user: filteredUser?.[0]?.avatar,
            quarter: selectedQuarter?.quarter,
          }),
        );
        handleClear();
      }
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth={'sm'}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <div className="d-flex-column p-4">
        <strong>Customize Dashboard</strong>
        <div className="selectbox">
          <label className="form-label">Select User</label>
          <select
            className="text-input"
            name="user"
            onChange={handleUserSelection}
          >
            <option value={0}>Select</option>
            {users?.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.first_name + ' ' + user.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className="selectbox">
          {view === 'monthly_view' ? (
            <>
              <label className="form-label">Select Month</label>
              <select
                className="text-input"
                name="month"
                onChange={handleMonthSelection}
              >
                <option value={0}>Select</option>
                <option value={'this-month'}>This Month</option>
                <option value={'last-month'}>Last Month</option>
                <option value={'next-month'}>Next Month</option>
                {/* <option value={'custom'}>Custom Date</option> */}
              </select>
            </>
          ) : (
            <>
              <label className="form-label">Select Quarter</label>
              <select
                className="text-input"
                name="quarter"
                onChange={handleQuarterSelection}
              >
                <option value={0}>Select</option>
                <option value={'this-quarter'}>This Quarter</option>
                <option value={'last-quarter'}>Last Quarter</option>
                <option value={'next-quarter'}>Next Quarter</option>
                {/* <option value={'custom'}>Custom Date</option> */}
              </select>
            </>
          )}
        </div>
        {(projectTypeList || []).length > 0 && (
          <div>
            <label className="form-label">Project Type</label>
            <select
              className="text-input task-type mr-3"
              style={{ color: '#000000' }}
              value={selectedType}
              onChange={handleSelectedType}
            >
              <option>Select</option>
              {(projectTypeList || [])?.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={handleCustomize}
          style={{ boxShadow: 'none' }}
        >
          <CheckCircleOutline style={{ color: 'green', width: 50, height: 50 }} />
        </button>
      </div>
    </Dialog>
  );
}

export default React.memo(Customize);
