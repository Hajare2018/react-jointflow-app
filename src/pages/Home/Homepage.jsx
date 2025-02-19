import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Banner from '../../components/Banner';
import { doSelectUser, setMonthlyData, setQuarterData, show } from '../../Redux/Actions/loader';
import { getAllUsers } from '../../Redux/Actions/user-info';
import HomeWidgets from '../../components/HomePageComponents/index';
import { Fab, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Add } from '@mui/icons-material';
import Customize from '../../components/HomePageComponents/Customize';
import { loadForecast } from '../../Redux/Actions/user-access';
import {
  getCurrentQuarter,
  getDateFormat,
  getDevice,
  getMonthDates,
  getMonthString,
  getPlurals,
} from '../../components/Utils';
import Countdown from 'react-countdown';
import HttpClient from '../../Api/HttpClient';
import { Link, useNavigate } from 'react-router-dom';
import { FaHubspot, FaSalesforce } from 'react-icons/fa';
import { requestNotifications } from '../../Redux/Actions/login';
import MsCrmLogo from '../../assets/icons/image.png';
import ProjectFormModal from '../../components/ProjectFormModal';
import { useUserContext } from '../../context/UserContext';
import { useTenantContext } from '../../context/TenantContext';
import ChipSelector from './Chip';

const useStyles = makeStyles(() => ({
  fab: {
    backgroundColor: 'rgba(98,125, 175, 1.7)',
    margin: 0,
    top: 'auto',
    right: 35,
    bottom: 50,
    left: 'auto',
    zIndex: 9,
    position: 'fixed',
    '&:hover': {
      backgroundColor: '#3edab7',
    },
    '@media(max-width: 767px)': {
      right: 10,
      bottom: 10,
    },
  },
  fab_crm: {
    backgroundColor: '#ffffff',
    margin: 0,
    top: 'auto',
    right: 35,
    bottom: 110,
    zIndex: 9,
    left: 'auto',
    position: 'fixed',
    fontSize: '1.5rem',
    '&:hover': {
      backgroundColor: '#4a5b67',
    },
    '@media(max-width: 767px)': {
      right: 10,
      bottom: 68,
    },
  },
}));

function HomePage() {
  const classes = useStyles();

  const { user } = useUserContext();
  const { crm_integrated, crm_system, year_end_month } = useTenantContext();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [customize, setCustomize] = useState(false);
  const selectedQuarterData = useSelector((state) => state.quarterData);
  const selectedMonthData = useSelector((state) => state.monthlyData);
  const thisMonthData = getMonthDates(0);
  const quarter = year_end_month !== undefined ? getCurrentQuarter(year_end_month) : '';
  const startDate = getDateFormat(quarter?.start_date);
  const endDate = getDateFormat(quarter?.end_date);

  useEffect(() => {
    dispatch(show(true));
    dispatch(doSelectUser(user));
    window.pendo.initialize({
      visitor: {
        id: user.id,
        email: user.email,
        full_name: user.first_name + ' ' + user.last_name,
        role: user.role,
        page: 'Homepage',
      },
      account: { id: HttpClient.tenant() },
    });
    dispatch(requestNotifications());
  }, []);

  useEffect(() => {
    if (user.first_name === null && user.last_name === null) {
      window.location.href = '/profile';
    }
    const banner = localStorage.getItem('show_banner');
    if (user.log_in_prompt_message !== null) {
      if (banner === 'true') {
        setShowBanner(true);
      } else {
        setShowBanner(false);
      }
    } else {
      setShowBanner(false);
      localStorage.setItem('show_banner', false);
    }
  }, [user]);

  useEffect(() => {
    if (user.homepage_view === 'monthly_view') {
      if (Object.keys(thisMonthData).length > 0 && user.id !== undefined) {
        dispatch(
          loadForecast({
            id: user.id,
            start_date: getDateFormat(thisMonthData.start_date),
            end_date: getDateFormat(thisMonthData.end_date),
          }),
        );
        dispatch(
          setMonthlyData({
            year: new Date().getFullYear(),
            user: user.avatar,
            month: new Date().getMonth(),
            endDate: getDateFormat(thisMonthData.end_date),
          }),
        );
      } else {
        return;
      }
    } else {
      if (Object.keys(quarter).length > 0 && user.id !== undefined) {
        dispatch(
          loadForecast({
            id: user.id,
            start_date: startDate,
            end_date: endDate,
          }),
        );
        dispatch(
          setQuarterData({
            year: quarter?.year,
            user: user.avatar,
            quarter: quarter?.quarter,
          }),
        );
      } else {
        return;
      }
    }
  }, [user]);

  useEffect(() => {}, [showBanner]);

  const handleOpenProjectForm = (e) => {
    setModalData(e);
    setOpenProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setOpenProjectForm(false);
  };

  const handleCustomization = () => {
    dispatch(getAllUsers({ onlyStaff_with_sales_target: true }));
    setCustomize(true);
  };

  const closeCustomization = () => {
    setCustomize(false);
  };

  const handleClose = () => {
    localStorage.setItem('show_banner', false);
    setShowBanner(false);
  };

  const isMobile = getDevice();

  return (
    <>
      <main
        id="page"
        className="panel-view"
      >
        <div className="overview home-header">
          <div className="project-header-home mb-1">
            <div className="app-color width-33">
              <p className="font-custom">
                <Countdown
                  date={
                    user.homepage_view === 'monthly_view'
                      ? getDateFormat(selectedMonthData?.data?.endDate)
                      : endDate
                  }
                  renderer={(props) =>
                    isNaN(props?.days) ? (
                      'Loading...'
                    ) : props?.days > 0 ? (
                      <>
                        <strong className="mr-1 font-custom">
                          {user.homepage_view === 'monthly_view'
                            ? 'This Month ends in'
                            : 'Q' + quarter?.quarter + ' ends in'}
                        </strong>
                        <span>
                          {getPlurals(props?.days, 'Day') +
                            ' ' +
                            getPlurals(props?.hours, 'hour') +
                            ' ' +
                            getPlurals(props?.minutes, 'min') +
                            ' ' +
                            getPlurals(props?.seconds, 'sec')}
                        </span>
                      </>
                    ) : (
                      <strong className="mr-1 light-orange">
                        {user.homepage_view === 'monthly_view'
                          ? new Date(selectedMonthData?.data?.endDate) < new Date()
                            ? 'This month has ended!'
                            : 'This month is ending today!'
                          : 'Q' + quarter?.quarter + ' is ending today!'}
                      </strong>
                    )
                  }
                />
              </p>
            </div>
            <ChipSelector
              onClick={handleCustomization}
              isMobile={isMobile}
              label={
                user.homepage_view === 'monthly_view'
                  ? `${getMonthString(selectedMonthData?.data?.month + 1)}/
                          ${selectedMonthData?.data?.year}`
                  : `Q${selectedQuarterData?.data?.quarter}/${selectedQuarterData?.data?.year}`
              }
              user={
                user.homepage_view === 'monthly_view'
                  ? selectedMonthData?.data?.user
                  : selectedQuarterData?.data?.user
              }
            />
          </div>
        </div>
        <HomeWidgets view={user.homepage_view} />
        <Banner
          message={user.log_in_prompt_message}
          severity="warning"
          open={showBanner}
          handleClose={handleClose}
          vertical="top"
          horizontal="center"
        />
        <Customize
          open={customize}
          handleClose={closeCustomization}
          view={user.homepage_view}
        />
      </main>
      {crm_integrated ? (
        <Tooltip
          className="tour-crm-table"
          title={`Pull from ${crm_system}`}
          placement="left"
          arrow
        >
          <Fab
            className={classes.fab_crm}
            size={isMobile ? 'small' : 'medium'}
            aria-label="crm"
            onClick={() => {
              navigate('/crm_deals');
            }}
          >
            <Link
              to="/crm_deals"
              target={'_self'}
            >
              {crm_system === 'hubspot' ? (
                <FaHubspot style={{ color: '#fa7820' }} />
              ) : crm_system === 'salesforce' ? (
                <FaSalesforce style={{ color: '#1798c1' }} />
              ) : crm_system === 'mscrm' ? (
                <img
                  src={MsCrmLogo}
                  className="h-7 w-7"
                />
              ) : null}
            </Link>
          </Fab>
        </Tooltip>
      ) : null}
      <Tooltip
        className="tour-project-add"
        title={'Create New Project'}
        placement="left"
        arrow
      >
        <Fab
          className={classes.fab}
          size={isMobile ? 'small' : 'medium'}
          onClick={() => handleOpenProjectForm({ add: true })}
          aria-label="add"
        >
          <Add style={{ width: 25, height: 25, color: '#ffffff' }} />
        </Fab>
      </Tooltip>
      <ProjectFormModal
        open={openProjectForm}
        data={modalData}
        handleClose={handleCloseProjectForm}
      />
    </>
  );
}
export default React.memo(HomePage);
