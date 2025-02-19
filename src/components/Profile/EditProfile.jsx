import {
  Avatar,
  Badge,
  Grid,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { Edit, FileCopyOutlined } from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editUser, getUser, saveSlackId } from '../../Redux/Actions/user-info';
import ImgDialog from './ImgDialog';
import NewTab from '../../assets/icons/OpenNewTabIconBlue.png';
import slackIcon from '../../assets/icons/slack_icon.png';
import { show } from '../../Redux/Actions/loader';
import { showInfoSnackbar } from '../../Redux/Actions/snackbar';
import { useUserContext } from '../../context/UserContext';

const StyledBadge = withStyles(() => ({
  badge: {
    right: 35,
    top: 170,
    '@media (max-width: 1023px)': {
      top: 122,
    },
    padding: '0 3px',
    height: 40,
    width: 40,
    borderRadius: '50%',
    fontSize: 14,
    backgroundColor: '#627daf',
  },
}))(Badge);

function EditProfile() {
  const { user } = useUserContext();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    dispatch(getUser({ fetchPermissions: false, isLightUser: false }));
  }, []);

  const [profile, setProfile] = useState({
    name: user.first_name,
    surName: user.last_name,
    email: user.email,
    phone: user.phone_number,
    company: user.buyer_company_details?.name,
    slack_id: user.slack_id,
    jobTitle: '',
    role: user.role,
    profileLink: user.linkedin_url,
    id: user.id,
    view: user.homepage_view,
    bcc_address: user.bcc_address,
  });

  const [errors, setErrors] = useState({
    name: false,
    surName: false,
    email: false,
    phone: false,
    company: false,
    userType: false,
    role: false,
  });

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event?.target?.value });
  };

  const handleCheck = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {}, [profile]);

  const handleUpdate = () => {
    if (profile.name === '') {
      setErrors({
        name: true,
      });
    }
    if (profile.surName === '') {
      setErrors({
        surName: true,
      });
    }
    if (profile.email === '') {
      setErrors({
        email: true,
      });
    }
    if (
      profile.name === '' ||
      profile.surName === '' ||
      profile.email === '' ||
      profile.role === ''
    ) {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert('All fields are required!');
    } else {
      const formData = new FormData();
      formData.append('first_name', profile?.name);
      formData.append('last_name', profile?.surName);
      formData.append('is_active', 'True');
      formData.append('is_staff', 'True');
      formData.append('role', profile?.role);
      formData.append('phone_number', profile?.phone);
      formData.append('email', profile?.email);
      formData.append('linkedin_url', profile?.profileLink);
      formData.append('homepage_view', profile?.view);
      formData.append('email_opted_in', isChecked);
      formData.append('bcc_address', profile?.bcc_address);
      dispatch(show(true));
      dispatch(editUser({ id: user.id, data: formData, onlyUser: true }));
    }
  };
  const lastLoggedIn = new Date(user.last_login);
  const date = lastLoggedIn.getDate();
  const month = lastLoggedIn.getMonth() + 1;
  const year = lastLoggedIn.getFullYear();

  const handleImgDialog = useCallback(() => {
    setOpen(true);
  }, [open]);

  useEffect(() => {}, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.profileLink);
    dispatch(showInfoSnackbar('Copied to clipboard!'));
  };

  const doSaveSlackId = () => {
    dispatch(show(true));
    const reqBody = {};
    dispatch(saveSlackId({ data: reqBody }));
  };

  return (
    <React.Fragment>
      <div
        style={{
          padding: '30px 5px',
        }}
      >
        <Grid
          container
          spacing={2}
          direction="row"
        >
          <Grid
            item
            direction="column"
            xs={12}
            sm={12}
            md={4}
          >
            <div className="text-center">
              <StyledBadge
                badgeContent={
                  <IconButton onClick={handleImgDialog}>
                    <Edit
                      style={{ color: '#ffffff' }}
                      className="edit-icon"
                    />
                  </IconButton>
                }
                color="primary"
              >
                <div>
                  <Avatar
                    src={user.avatar}
                    className="profileImg"
                  />
                </div>
              </StyledBadge>
              <h3
                className="mt-2"
                style={{ color: '#000000' }}
              >
                {user.first_name} {user.last_name}
              </h3>
              <h4 style={{ fontSize: 18 }}>{user.role}</h4>
              <h4
                className="logintim"
                style={{ fontSize: 18 }}
              >
                <strong style={{ color: '#222222' }}>Last Login:</strong>{' '}
                {year + '-' + month + '-' + date}
              </h4>
            </div>
          </Grid>
          <Grid
            item
            direction="column"
            xs={12}
            sm={12}
            md={8}
          >
            <form
              className="edit-form"
              id="registrationForm"
            >
              <Grid
                container
                spacing={2}
                direction="row"
              >
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Name*</h4>
                  <input
                    required
                    type="text"
                    className="text-input user-name"
                    name="name"
                    onChange={handleChange}
                    value={profile?.name}
                    placeholder="Your Name"
                  />
                  {errors.name && <h4 style={{ color: 'red' }}>Name is Required!</h4>}
                </Grid>
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Surname*</h4>
                  <input
                    required
                    type="text"
                    className="text-input sur-name"
                    name="surName"
                    onChange={handleChange}
                    value={profile?.surName}
                    placeholder="Your Surname"
                  />
                  {errors.surName && <h4 style={{ color: 'red' }}>Surname is Required!</h4>}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
              >
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Email Address*</h4>
                  <input
                    required
                    type="email"
                    className="text-input email-address"
                    name="email"
                    value={profile?.email}
                    onChange={handleChange}
                    placeholder="Email ID"
                  />
                  {errors.email && <h4 style={{ color: 'red' }}>Email is Required!</h4>}
                </Grid>
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Phone Number*</h4>
                  <input
                    required
                    type="number"
                    className="text-input phone-number"
                    name="phone"
                    value={profile?.phone}
                    maxLength={10}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                  {errors.phone && <h4 style={{ color: 'red' }}>Phone Number is Required!</h4>}
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
              >
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Role*</h4>
                  <input
                    type="text"
                    disabled
                    style={{ backgroundColor: '#F3F3F3' }}
                    className="text-input role-input"
                    name="role"
                    onChange={handleChange}
                    value={profile?.role}
                    placeholder="Enter Job Role"
                  />
                  {errors.role && <h4 style={{ color: 'red' }}>Role is Required!</h4>}
                </Grid>
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Slack ID</h4>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="text-input slack-input"
                      name="slack_id"
                      onChange={handleChange}
                      value={profile?.slack_id}
                      placeholder="Your Slack ID"
                    />
                    <Tooltip
                      title={'Add Slack ID'}
                      placement="top"
                    >
                      <button
                        className="btn-copy slack-btn"
                        onClick={doSaveSlackId}
                        type="button"
                      >
                        <img
                          src={slackIcon}
                          style={{ height: 22, width: 22 }}
                        />
                      </button>
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
              >
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Homepage View</h4>
                  <select
                    className="text-input"
                    value={profile.view}
                    name="view"
                    onChange={handleChange}
                  >
                    <option value={'default'}>Default</option>
                    <option value={'sales_forecast'}>Forecast</option>
                    <option value={'sales_exec'}>Launchpad</option>
                    <option value={'monthly_view'}>Monthly View</option>
                  </select>
                </Grid>
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <h4>Linkedin Profile</h4>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="text-input linkedin-input"
                      name="profileLink"
                      onChange={handleChange}
                      value={profile?.profileLink}
                      placeholder="LinkedIn Profile URL"
                    />
                    <Tooltip
                      title={'Copy link to clipboard'}
                      placement="top"
                    >
                      <button
                        className="btn-copy linkedin-copy"
                        onClick={handleCopy}
                        type="button"
                      >
                        <FileCopyOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip
                      title={'Open into New tab'}
                      placement="top"
                    >
                      <a
                        href={user.linkedin_url}
                        className="btn-copy new-tab-btn"
                        target="_blank"
                        type="button"
                        rel="noreferrer"
                      >
                        <img
                          src={NewTab}
                          style={{ height: 18, width: 18 }}
                        />
                      </a>
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
              >
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <Tooltip
                    title="This will BCC your CRM on Messages sent via the platform."
                    placement="left"
                  >
                    <h4>CRM BCC Address</h4>
                  </Tooltip>
                  <input
                    type="text"
                    maxLength={100}
                    className="text-input role-input"
                    name="bcc_address"
                    onChange={handleChange}
                    value={profile?.bcc_address}
                    placeholder="Enter BCC Address"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={2}
                direction="row"
              >
                <Grid
                  item
                  direction="column"
                  xs={12}
                  sm={6}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={handleCheck}
                      />
                    }
                    label={<strong>Receive Daily Digest Email</strong>}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </div>
      <hr className="mt-5" />
      <div
        style={{
          padding: '15px 20px',
        }}
      >
        <Grid
          container
          spacing={2}
          direction="row"
        >
          <Grid
            item
            direction="column"
            xs={12}
          >
            <div className="text-right">
              <button
                className="btn btn-lg btn-blue1"
                onClick={handleUpdate}
                type="submit"
              >
                Save Changes
              </button>
            </div>
          </Grid>
        </Grid>
      </div>
      <ImgDialog
        showImg={() => {}}
        forEdit={true}
        open={open}
        image={user.avatar}
        profileData={profile}
        handleClose={handleClose}
      />
    </React.Fragment>
  );
}

export default React.memo(EditProfile);
