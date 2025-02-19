import { IconButton, Tooltip } from '@mui/material';
import { FeedbackOutlined, Security, VpnKeyOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { FaIndustry, FaRegEdit, FaUser, FaUserShield } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import SettingsTab from '../components/SettingsTab';
import { getCompanies } from '../Redux/Actions/companies';
import HierarchyActiveIcon from '../assets/icons/Hierarchy62White.png';
import HierarchyIcon from '../assets/icons/Hierarchy62Blue.png';
import { show } from '../Redux/Actions/loader';
import { getAccessGroups } from '../Redux/Actions/user-access';
import { getAllUsers, requestTenantAttributes } from '../Redux/Actions/user-info';
import HttpClient from '../Api/HttpClient';
import { useUserContext } from '../context/UserContext';

function Settings() {
  const dispatch = useDispatch();
  const [display, setDisplay] = useState('company');
  const [tabIndex, setTabIndex] = useState(0);
  const { user, permissions } = useUserContext();

  const handleTabIndex = (e) => {
    setTabIndex(e);
  };

  useEffect(() => {
    if (tabIndex === 4) {
      setDisplay('company');
    } else if (tabIndex === 3) {
      setDisplay('full_users');
    } else if (tabIndex === 5) {
      setDisplay('tenants');
    }
  }, [tabIndex]);

  useEffect(() => {
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Settings Page',
      },
      account: { id: HttpClient.tenant() },
    });
  }, []);

  const toggleDisplay = (view) => {
    dispatch(show(true));
    setDisplay(view);
    if (view === 'users') {
      dispatch(getCompanies());
    }
    if (view === 'company') {
      dispatch(getAllUsers({ onlyStaff: false }));
    }
    if (view === 'tenants') {
      dispatch(requestTenantAttributes());
    }
    if (view === 'access_groups') {
      dispatch(getAccessGroups());
    }
  };

  const allPermissions = permissions?.group?.map((access) => access.permission);
  const viewAdvancedTab = allPermissions?.filter(
    (access) => access?.codename === 'view_advanced_settings_tab',
  );
  const viewFaqTab = allPermissions?.filter((access) => access?.codename === 'view_faq_management');

  const displayToggle = (
    <div
      style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 16px' }}
      className="mt-3 mb-3"
    >
      {tabIndex === 4 ? (
        <div className="d-flex">
          <div
            className="d-flex justify-centre left-btn"
            style={{
              backgroundColor: display === 'company' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'Show Companies'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('company')}>
                <FaIndustry
                  style={{
                    color: display === 'company' ? '#ffffff' : '#627daf',
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="d-flex justify-centre right-btn"
            style={{
              backgroundColor: display === 'users' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'Show Buyers'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('users')}>
                <FaUser
                  style={{
                    color: display === 'users' ? '#ffffff' : '#627daf',
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : null}
      {tabIndex === 3 ? (
        <div className="d-flex">
          <div
            className="d-flex justify-centre left-btn"
            style={{
              backgroundColor: display === 'full_users' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'Show All Users'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('full_users')}>
                <FaUserShield
                  style={{
                    color: display === 'full_users' ? '#ffffff' : '#627daf',
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              height: 40,
              width: 40,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: display === 'hierarchy_view' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'Show Users Hierarchy'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('hierarchy_view')}>
                <img
                  src={display === 'hierarchy_view' ? HierarchyActiveIcon : HierarchyIcon}
                  style={{ height: 30, width: 30 }}
                />
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="d-flex justify-centre right-btn"
            style={{
              backgroundColor: display === 'access_groups' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'Show Access Groups'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('access_groups')}>
                <Security
                  style={{
                    color: display === 'access_groups' ? '#ffffff' : '#627daf',
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : null}
      {tabIndex === 5 && viewAdvancedTab?.length > 0 && viewFaqTab?.length > 0 ? (
        <div className="d-flex">
          <div
            className="d-flex justify-centre left-btn"
            style={{
              backgroundColor: display === 'tenants' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'Instance Attributes'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('tenants')}>
                <VpnKeyOutlined
                  style={{
                    color: display === 'tenants' ? '#ffffff' : '#627daf',
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
          <div
            style={{
              height: 40,
              width: 40,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: display === 'content_view' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'Content View'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('content_view')}>
                {display === 'content_view' ? (
                  <FaRegEdit className="white-color" />
                ) : (
                  <FaRegEdit className="app-color" />
                )}
              </IconButton>
            </Tooltip>
          </div>
          <div
            className="d-flex justify-centre right-btn"
            style={{
              backgroundColor: display === 'faqs' ? '#6385b7' : '#dadde9',
            }}
          >
            <Tooltip
              title={'FAQ Entries'}
              placement="top"
              arrow
            >
              <IconButton onClick={() => toggleDisplay('faqs')}>
                <FeedbackOutlined
                  style={{
                    color: display === 'faqs' ? '#ffffff' : '#627daf',
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <main
      id="page"
      className="panel-view"
    >
      <div
        className="overview"
        style={{
          position: 'sticky',
          top: 160,
          zIndex: 4,
        }}
      >
        <SettingsTab
          tab={handleTabIndex}
          view={display}
          displayToggle={displayToggle}
        />
      </div>
    </main>
  );
}

export default React.memo(Settings);
