import React from 'react';
import { Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useStyles from './styles';
import Menu from './Menu';
import { ExitToAppSharp, LiveHelpOutlined, Settings } from '@mui/icons-material';
import Tour from './Tour';
import NotificationPopover from './NotificationPopover';
import config from '../config';
import { useUserContext } from '../context/UserContext';
import { useTenantContext } from '../context/TenantContext';

function Header({ handleDrawerToggle }) {
  const { user, permissions, logoutUser } = useUserContext();
  const classes = useStyles();
  const { activate_notifications } = useTenantContext();
  const isSettings = permissions?.group?.filter(
    (access) => access?.permission.codename === 'view_settings_menu',
  );
  const path = window.location.pathname;

  const doNavigate = (to, val) => {
    window.open(to, val);
  };

  return (
    <>
      <header className="header">
        <div
          style={{ color: '#627daf', cursor: 'pointer' }}
          onClick={() => handleDrawerToggle()}
          className={classes.menuButton}
        >
          <MenuIcon />
        </div>
        <img
          src={config.REACT_APP_JF_LOGO}
          alt="jointflows logo"
          className="logo"
          loading="lazy"
        />
        <div className="user-nav">
          <a
            href="https://jointflows.ladesk.com/"
            className="user-nav__icon-box"
            target="_blank"
            rel="noreferrer"
          >
            <Tooltip title="Help & Support">
              <span>
                <LiveHelpOutlined style={{ color: '#95a0b8', height: 40, width: 40 }} />
              </span>
            </Tooltip>
          </a>
          {activate_notifications && <NotificationPopover />}
          <div className="user-nav__icon-box tour-link">
            <span>
              <Tour style={{ color: '#95a0b8' }} />
            </span>
          </div>
          {isSettings?.length > 0 ? (
            <div
              className="tour-settings"
              onClick={() => doNavigate('/settings', '_self')}
              style={{
                cursor: 'pointer',
                backgroundColor: path === '/settings' ? '#627daf' : '#ffffff',
                height: path === '/settings' ? 50 : '',
                width: path === '/settings' ? 50 : '',
                borderRadius: path === '/settings' ? '50%' : '',
              }}
            >
              <Tooltip
                title={'Settings'}
                placement={'bottom'}
              >
                <Settings
                  style={{
                    color: path === '/settings' ? '#ffffff' : '#627daf',
                    fontWeight: '700',
                    height: 35,
                    width: 35,
                  }}
                />
              </Tooltip>
            </div>
          ) : (
            ''
          )}
          <div
            className="user-nav__user"
            style={{
              border: path === '/profile' ? '4px solid #627daf' : '',
              height: path === '/profile' ? 65 : '',
              width: path === '/profile' ? 65 : '',
              borderRadius: path === '/profile' ? '50%' : '',
            }}
          >
            <Menu
              user_name={
                user.first_name?.length > 12
                  ? user.first_name?.substring(0, 12 - 3) + '...'
                  : user.first_name
              }
              profile_pic={user.avatar}
              role={user.role?.length > 12 ? user.role?.substring(0, 12 - 3) + '...' : user.role}
            />
          </div>
          <div
            className="tour-logout"
            onClick={() => logoutUser()}
            style={{ cursor: 'pointer' }}
          >
            <Tooltip
              title={'Logout'}
              placement={'bottom'}
            >
              <ExitToAppSharp
                style={{
                  color: '#627daf',
                  fontWeight: '700',
                  height: 30,
                  width: 30,
                }}
              />
            </Tooltip>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
