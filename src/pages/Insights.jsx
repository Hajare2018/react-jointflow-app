import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@mui/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import ChartComponent from '../components/ChartComponent/ChartComponent';
import { useDispatch, useSelector } from 'react-redux';
import requestDocumentsData from '../Redux/Actions/documents-data';
import { FaFileAlt, FaPoundSign, FaFlag } from 'react-icons/fa';
import FormControlLabel from '@mui/material/FormControlLabel';
import '../components/ProjectForm/TaskInfo.css';
import Dashboard from './Dashboard';
import { Avatar, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import newTab from '../assets/icons/OpenNewTabIconBlue.png';
import Loader from '../components/Loader';
import { show } from '../Redux/Actions/loader';
import { createImageFromInitials, currencyFormatter } from '../components/Utils';
import { completed } from '../Redux/Actions/completed-value';
import { Link } from 'react-router-dom';
import ProjectFormModal from '../components/ProjectFormModal';
import { useTenantContext } from '../context/TenantContext';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    bottom: 70,
    right: 20,
  },
  fab: {
    backgroundColor: '#627daf',
    margin: 0,
    top: 'auto',
    right: 80,
    bottom: 50,
    left: 'auto',
    position: 'fixed',
    '&:hover': {
      backgroundColor: '#4bdcba',
    },
    '@media(max-width: 767px)': {
      right: 10,
      bottom: 10,
    },
  },
}));

export default function Documents() {
  const [selectedValue, setSelectedValue] = React.useState('a');
  const [switchedValue, setSwitchedValue] = useState(true);
  const [selectedType, setSelectedType] = useState('Task Type');
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
  const [endDate, setEndDate] = useState(new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [modalData, setModalData] = useState('');
  const [localeData, setLocaleData] = useState(null);
  const { tenant_locale } = useTenantContext();

  useEffect(() => {
    try {
      if (typeof tenant_locale !== 'undefined') {
        setLocaleData(JSON.parse(tenant_locale));
      }
    } catch (_error) {
      // TODO handle error
    }
  }, [tenant_locale]);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleOpen = useCallback(
    (e) => {
      if (e.id) {
        setId(e.id);
        dispatch(completed(e.id));
        setTimeout(() => {
          setOpen(true);
        }, 2000);
      }
    },
    [id],
  );

  const handleOpenProjectForm = (e) => {
    setModalData(e);
    setOpenProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setOpenProjectForm(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSwitch = () => {
    setSwitchedValue(!switchedValue);
  };

  const handleTaskType = (event) => {
    setSelectedType(event.target.value);
  };

  const handleStartDate = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDate = (event) => {
    setEndDate(event.target.value);
  };

  const documentsData = useSelector((state) => state.docummentsData);
  const allData = (documentsData?.data?.length > 0 && documentsData?.data) || [];
  const allDocumentsData = allData?.filter(
    (item) => item.is_template === false && item.closed === false,
  );
  const allTasks = [];
  let totalProjectValue = [];
  let red_flags = [];
  allDocumentsData.forEach((element) => {
    totalProjectValue.push(element.project_value);
    red_flags.push(element.nb_red_flags);
  });
  const totalValue = totalProjectValue.reduce((a, b) => a + b, 0);
  const total_red_flags = red_flags.reduce((a, b) => a + b, 0);
  allDocumentsData.forEach((element) => element.cards.forEach((element) => allTasks.push(element)));

  const showLoader = useSelector((state) => state.showLoader);

  useEffect(() => {}, [selectedValue, startDate, endDate, switchedValue, selectedType]);

  useEffect(() => {
    dispatch(show(true));
    dispatch(requestDocumentsData({ filterByTemplate: false }));
  }, []);

  const filteredTasks = allDocumentsData.filter((item) => item.name === selectedType);
  let withTasksValue = [];
  let withTasksRedFlags = [];
  const withTasksData = allDocumentsData.filter((item) => item.cards.length > 0);
  withTasksData.forEach((element) => {
    withTasksValue.push(element.project_value);
    withTasksRedFlags.push(element.nb_red_flags);
  });
  const totalWithTasksVal = withTasksValue.reduce((a, b) => a + b, 0);
  const totalWithTasksRedFlag = withTasksRedFlags.reduce((a, b) => a + b, 0);

  return (
    <>
      {(showLoader.show && <Loader />) || (
        <main
          id="page"
          className="panel-view"
        >
          <div
            className="overview insightPage"
            style={{
              position: 'sticky',
              top: 20,
              backgroundColor: '#f9fbfd',
              zIndex: 4,
            }}
          >
            <div className="project-header">
              <h1 className="overview__heading">Insights</h1>
              {selectedValue === 'e' && (
                <FormControl
                  className={classes.formControl}
                  variant="standard"
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    style={{ fontSize: '1.8rem' }}
                  >
                    Task Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedType}
                    onChange={handleTaskType}
                    style={{ fontSize: 18, fontWeight: '500', marginTop: 20 }}
                  >
                    {allDocumentsData.map((item) => (
                      // TODO FIXME
                      // eslint-disable-next-line react/jsx-key
                      <MenuItem
                        style={{ fontSize: 18 }}
                        value={item.name}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
            <div className="analytics-card-container tour-insight-cards">
              <div className="analytics-card analytics-card__one">
                <div className="analytics-card__content">
                  <p>Total Projects</p>
                  <h1>{(!switchedValue && allDocumentsData.length) || withTasksData.length}</h1>
                </div>
                <div className="analytics-card__icon">
                  <FaFileAlt
                    size={32}
                    color={'#3edab7'}
                  />
                </div>
              </div>
              <div className="analytics-card analytics-card__two">
                <div className="analytics-card__content">
                  <p>Total Project Value</p>
                  <h1>
                    {(!switchedValue &&
                      currencyFormatter(localeData?.locale, totalValue, localeData?.currency)) ||
                      currencyFormatter(
                        localeData?.locale,
                        totalWithTasksVal,
                        localeData?.currency,
                      )}
                  </h1>
                </div>
                <div className="analytics-card__icon">
                  <strong>
                    {(localeData === null && <FaPoundSign size={40} />) || localeData?.symbol}
                  </strong>
                </div>
              </div>
              <div className="analytics-card analytics-card__three">
                <div className="analytics-card__content">
                  <p>Total Red flags</p>
                  <h1>{(!switchedValue && total_red_flags) || totalWithTasksRedFlag}</h1>
                </div>
                <div className="analytics-card__icon">
                  <FaFlag
                    size={32}
                    color={'#fc8c8a'}
                  />
                </div>
              </div>
            </div>
            <div
              className="tour-project-header"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <FormControl className={classes.formControl}>
                <InputLabel
                  id="demo-simple-select-label"
                  style={{ fontSize: '1.8rem' }}
                >
                  Timescale
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedValue}
                  onChange={handleChange}
                  style={{ fontSize: 18, fontWeight: '500', marginTop: 20 }}
                >
                  <MenuItem
                    style={{ fontSize: 18 }}
                    value={'a'}
                  >
                    Full Project
                  </MenuItem>
                  <MenuItem
                    style={{ fontSize: 18 }}
                    value={'b'}
                  >
                    30 Days
                  </MenuItem>
                  <MenuItem
                    style={{ fontSize: 18 }}
                    value={'d'}
                  >
                    Custom
                  </MenuItem>
                  <MenuItem
                    style={{ fontSize: 18 }}
                    value={'e'}
                  >
                    Individual Project
                  </MenuItem>
                </Select>
              </FormControl>
              {selectedValue === 'd' ? (
                <div style={{ display: 'flex' }}>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      onChange={handleStartDate}
                      value={startDate}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      onChange={handleEndDate}
                      value={endDate}
                    />
                  </div>
                </div>
              ) : (
                ''
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={switchedValue}
                    onChange={handleSwitch}
                    name="checkedA"
                  />
                }
                label={<span>{(!switchedValue && 'Hide') || 'Show'} Projects with No Tasks</span>}
              />
            </div>
          </div>
          {selectedValue !== 'e' &&
            allDocumentsData.map((user) =>
              switchedValue ? (
                user.cards.length > 0 && (
                  <div className="flex bg-white pt-7 tour-project-details">
                    <div
                      style={{
                        width: '100%',
                        maxWidth: 300,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        className="flex flex-col justify-start items-center mx-10"
                        style={{ margin: 0 }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Avatar
                            src={
                              user?.buyer_company_details?.company_image ||
                              createImageFromInitials(200, user?.name, '#627daf')
                            }
                            style={{ marginRight: 10 }}
                          />
                          <Link
                            to={`/board/?id=${user.id}&navbars=True&actions=True`}
                            target="_blank"
                          >
                            <img
                              src={newTab}
                              style={{ height: 15, width: 15 }}
                            />
                          </Link>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <h3
                            style={{
                              fontSize: 16,
                              fontWeight: '700',
                              color: '#627daf',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleOpen({ id: user.id })}
                          >
                            {user.name}
                          </h3>
                        </div>
                        <h2 className="mt-3 text-2xl">
                          {(user?.project_value === null &&
                            currencyFormatter(localeData?.locale, 0, localeData?.currency)) ||
                            currencyFormatter(
                              localeData?.locale,
                              user?.project_value,
                              localeData?.currency,
                            )}
                        </h2>
                      </div>
                    </div>
                    <div
                      className="tour-gantt-charts"
                      style={{ width: '100%', maxWidth: '100%' }}
                    >
                      <ChartComponent
                        tasks={user.cards}
                        view={selectedValue}
                        customStartDate={startDate}
                        customEndDate={endDate}
                      />
                    </div>
                  </div>
                )
              ) : (
                // TODO FIXME
                // eslint-disable-next-line react/jsx-key
                <div className="flex bg-white pt-7">
                  <div
                    className="tour-project-details"
                    style={{
                      width: '100%',
                      maxWidth: 300,
                      textAlign: 'center',
                    }}
                  >
                    <div
                      className="flex flex-col justify-start items-center mx-10"
                      style={{ margin: 0 }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Avatar
                          src={
                            user?.buyer_company_details?.company_image ||
                            createImageFromInitials(200, user?.name, '#627daf')
                          }
                          className="w-16"
                        />
                        <Link
                          to={`/board/?id=${user.id}&navbars=True&actions=True`}
                          target="_blank"
                        >
                          <img
                            src={newTab}
                            style={{ height: 15, width: 15 }}
                          />
                        </Link>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h3
                          style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#627daf',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleOpen({ id: user.id })}
                        >
                          {user.name}
                        </h3>
                      </div>
                      <h2 className="mt-3 text-2xl">
                        {(user?.project_value === null &&
                          currencyFormatter(localeData?.locale, 0, localeData?.currency)) ||
                          currencyFormatter(
                            localeData?.locale,
                            user?.project_value,
                            localeData?.currency,
                          )}
                      </h2>
                    </div>
                  </div>
                  <div style={{ width: '100%', maxWidth: '100%' }}>
                    {(user.cards.length > 0 && (
                      <ChartComponent
                        tasks={user.cards}
                        view={selectedValue}
                        customStartDate={startDate}
                        customEndDate={endDate}
                      />
                    )) || (
                      <h4 style={{ fontSize: 25, color: 'red' }}>
                        No Tasks in current time period!
                      </h4>
                    )}
                  </div>
                </div>
              ),
            )}
          {selectedValue === 'e' &&
            filteredTasks &&
            filteredTasks.map((user) => (
              <div
                className="flex bg-white pt-7"
                key={user.id}
              >
                <div
                  className="tour-project-details"
                  style={{ width: '100%', maxWidth: 300, textAlign: 'center' }}
                >
                  <div
                    className="flex flex-col justify-start items-center mx-10"
                    style={{ margin: 0 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        src={
                          user?.buyer_company_details?.company_image ||
                          createImageFromInitials(200, user?.name, '#627daf')
                        }
                      />
                      <Link
                        to={`/board/?id=${user.id}&navbars=True&actions=True`}
                        target="_blank"
                      >
                        <img
                          src={newTab}
                          style={{ height: 15, width: 15 }}
                        />
                      </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: '700',
                          color: '#627daf',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleOpen({ id: user.id })}
                      >
                        {user.name}
                      </h3>
                    </div>
                    <h2 className="mt-3 text-2xl">
                      {(user?.project_value === null &&
                        currencyFormatter(localeData?.locale, 0, localeData?.currency)) ||
                        currencyFormatter(
                          localeData?.locale,
                          user?.project_value,
                          localeData?.currency,
                        )}
                    </h2>
                  </div>
                </div>
                <div
                  className="tour-gantt-charts"
                  style={{ width: '100%', maxWidth: '100%' }}
                >
                  {(user.cards.length > 0 && (
                    <ChartComponent
                      tasks={user.cards}
                      view={selectedValue}
                    />
                  )) || (
                    <h4 style={{ fontSize: 25, color: 'red' }}>No Tasks in current time period!</h4>
                  )}
                </div>
              </div>
            ))}
        </main>
      )}
      <Tooltip
        className="tour-project-new"
        title={'Create New Project'}
        placement="left"
        arrow
      >
        <Fab
          className={classes.fab}
          onClick={() => handleOpenProjectForm({ add: true })}
          aria-label="add"
        >
          <AddIcon style={{ width: 30, height: 30, color: '#ffffff' }} />
        </Fab>
      </Tooltip>
      <Dashboard
        open={open}
        id={id}
        handleClose={handleClose}
      />
      <ProjectFormModal
        open={openProjectForm}
        data={modalData}
        handleClose={handleCloseProjectForm}
      />
    </>
  );
}
