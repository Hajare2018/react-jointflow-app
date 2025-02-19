import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  FormControlLabel,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles, withStyles } from '@mui/styles';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../Redux/Actions/loader';
import { editUser, newUser } from '../../Redux/Actions/user-info';
import NewCompanyDialog from '../NewCompanyDialog';
import AutoComplete from '../AutoComplete';
import { saveAccessGroup } from '../../Redux/Actions/user-access';
import AddAccessGroup from './AddAccessGroup';
import { Add, Edit, MailOutline, PhoneAndroidOutlined } from '@mui/icons-material';
import ImgDialog from '../Profile/ImgDialog';
import { editDealPolice } from '../../Redux/Actions/deal-police';
import { companyRole, usersRole } from './role';
import { capitalizeWords, removeDuplicates } from '../Utils';
import { useTenantContext } from '../../context/TenantContext';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

const StyledBadge = withStyles(() => ({
  badge: {
    right: 10,
    top: 70,
    '@media (max-width: 1023px)': {
      top: 70,
    },
    padding: '0 4px',
    height: 30,
    width: 30,
    borderRadius: '50%',
    fontSize: 14,
    backgroundColor: '#627daf',
  },
}))(Badge);

function AddNewUser({ open, handleClose, forEdit, forCompany, addContact, forDealPolice }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    role: addContact || forCompany ? 'champion' : 'sales',
    reports_to: null,
    user_type: 'light',
    linkedIn_url: '',
    phone_number: '',
    avatar: '',
    target: 0,
  });
  const [imgBlob, setImgBlob] = useState(null);
  const [imgToAdd, setImgToAdd] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showImgDialog, setShowImgDialog] = useState(false);
  const [accessGroup, setAccessGroup] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const loader = useSelector((state) => state?.showLoader);
  const dialog = useSelector((state) => state?.dialog);
  const lightUsers = useSelector((state) => state.allLightUsersData);
  const lightUserData = lightUsers?.data?.length > 0 ? lightUsers?.data : [];
  const allUsersData = useSelector((state) => state.allUsersData);
  const allUsers = allUsersData.data.length > 0 ? allUsersData.data : [];
  const activeUsers = allUsers?.sort((a, b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
      return -1;
    }
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  const sortedLightUsers = lightUserData?.sort((a, b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
      return -1;
    }
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  const filteredLightUsers = sortedLightUsers?.filter((user) => user.id !== forEdit?.id);
  const { departments_list } = useTenantContext();
  const finalArr = departments_list;
  const companyArr = companyRole.concat(finalArr);
  const companyRoleArr = removeDuplicates(companyArr);
  companyRoleArr.sort();
  const usersArr = usersRole.concat(finalArr);
  const usersRoleArr = removeDuplicates(usersArr);
  const projectData = useSelector((state) => state.singleProjectData);
  usersRoleArr.sort();
  const handleImgDialog = () => {
    setShowImgDialog(true);
  };
  const handleCloseImgDialog = () => {
    setShowImgDialog(false);
  };

  const handleConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleCheck = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {}, [
    form?.first_name,
    form?.last_name,
    form?.email,
    form?.role,
    form?.company,
    form?.user_type,
    form?.linkedIn_url,
    form?.phone_number,
    form?.avatar,
    accessGroup,
    form?.target,
    imgBlob,
    isChecked,
  ]);

  useEffect(() => {
    if (forEdit?.add) {
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        company: '',
        role: addContact || forCompany ? 'champion' : 'sales',
        reports_to: null,
        user_type: 'light',
        linkedIn_url: '',
        phone_number: '',
        avatar: '',
        target: 0,
      });
      setImgBlob(null);
      setIsChecked(false);
    } else {
      setForm({
        first_name: forEdit?.first_name,
        last_name: forEdit?.last_name,
        email: forEdit?.email,
        company: forEdit?.company_name,
        role: forEdit?.role,
        user_type: forEdit?.user_type,
        linkedIn_url: forEdit?.linkedin_url,
        phone_number: forEdit?.phone_number,
        reports_to: forEdit?.reports_to == undefined ? null : forEdit?.reports_to,
        target: forEdit?.target == undefined || forEdit?.target == null ? 0 : forEdit?.target,
      });
      setImgBlob(forEdit?.avatar);
      setIsChecked(forEdit?.email_opted_in);
    }
  }, [forEdit]);

  const handleClear = () => {
    setImgBlob(null);
    setIsChecked(false);
    setForm({
      first_name: '',
      last_name: '',
      email: '',
      company: '',
      role: addContact || forCompany ? 'champion' : 'sales',
      reports_to: null,
      user_type: 'light',
      linkedIn_url: '',
      phone_number: '',
      avatar: '',
      target: 0,
    });
    setAccessGroup([]);
    handleClose();
  };

  const addNewUser = () => {
    if (form?.first_name === '' || form?.last_name === '' || form?.email === '') {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert('All fields are required!');
      return;
    } else if (
      form?.first_name == undefined ||
      form?.last_name == undefined ||
      form?.email == undefined
    ) {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert('All fields are required!');
      return;
    } else {
      dispatch(show(true));
      const formData = new FormData();
      if (forCompany) {
        imgBlob !== null && imgBlob !== undefined && formData.append('avatar', imgBlob);
        formData.append('first_name', form?.first_name);
        formData.append('last_name', form?.last_name);
        formData.append('is_active', 'True');
        formData.append('is_staff', forCompany ? 'False' : 'True');
        formData.append('role', form?.role == undefined ? 'champion' : form?.role);
        formData.append('user_type', 'light');
        formData.append(
          'buyer_company',
          forEdit?.id || projectData?.data?.[0]?.buyer_company_details.id,
        );
        formData.append('email', form?.email);
        typeof form?.linkedIn_url === 'string' &&
          formData.append('linkedin_url', validateURL(form?.linkedIn_url));
        form?.phone_number?.length >= 10 && formData.append('phone_number', form?.phone_number);
        formData.append('password', 1234);
        formData.append(
          'reports_to',
          form?.reports_to == 0 || form?.reports_to == undefined || form.parentCompany == null
            ? ''
            : form?.reports_to,
        );
        formData.append('date_joined', new Date()?.toJSON()?.slice(0, 10).replace(/-/g, '-'));
        dispatch(
          newUser({
            data: formData,
            company_id: forEdit?.id || projectData?.data?.[0]?.buyer_company_details.id,
            usersByCompany: true,
          }),
        );
        if (!loader?.show) {
          handleClear();
        }
        // } else {
        //     handleConfirmation()
        // }
      } else {
        imgToAdd !== null && imgToAdd !== undefined && formData.append('avatar', imgToAdd);
        formData.append('first_name', form?.first_name);
        formData.append('last_name', form?.last_name);
        formData.append('is_active', 'True');
        formData.append('is_staff', 'True');
        formData.append('role', typeof form?.role === 'undefined' ? 'sales' : form?.role);
        formData.append('user_type', 'full');
        formData.append('email', form?.email);
        typeof form?.linkedIn_url === 'string' &&
          formData.append('linkedin_url', validateURL(form?.linkedIn_url));
        form?.phone_number?.length >= 10 && formData.append('phone_number', form?.phone_number);
        formData.append('email_opted_in', !!isChecked);
        formData.append(
          'reports_to',
          form?.reports_to == 0 || form?.reports_to == undefined || form?.reports_to == null
            ? ''
            : form?.reports_to,
        );
        formData.append('target_value', 0);
        formData.append('password', 1234);
        formData.append('date_joined', new Date()?.toJSON()?.slice(0, 10).replace(/-/g, '-'));
        dispatch(newUser({ data: formData, onlyStaff: true }));
        if (!loader?.show) {
          handleClear();
        }
      }
    }
  };

  const updateUser = () => {
    if (form?.first_name === '' || form?.last_name === '' || form?.email === '') {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert('All fields are required!');
    } else if (
      form?.first_name === 'undefined' ||
      form?.last_name === 'undefined' ||
      form?.email === 'undefined'
    ) {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert('All fields are required!');
    } else {
      if (forCompany || addContact) {
        dispatch(show(true));
        const formData = new FormData();
        formData.append('first_name', form?.first_name);
        formData.append('last_name', form?.last_name);
        formData.append('is_active', forEdit?.is_active);
        formData.append('is_staff', forEdit?.is_staff);
        formData.append('role', form?.role);
        formData.append('user_type', forEdit?.user_type);
        formData.append('email', form?.email);
        typeof form?.linkedIn_url === 'string' &&
          formData.append('linkedin_url', validateURL(form?.linkedIn_url));
        form?.phone_number?.length >= 10 && formData.append('phone_number', form?.phone_number);
        form?.reports_to !== undefined &&
          formData.append(
            'reports_to',
            form?.reports_to == 0 || form?.reports_to == null || form?.reports_to == undefined
              ? ''
              : form?.reports_to,
          );
        imgBlob !== null && typeof imgBlob !== 'string' && formData.append('avatar', imgBlob);
        // formData.append('date_joined', forEdit.data_joined && forEdit.data_joined);
        dispatch(
          editUser({
            id: forEdit.id,
            data: formData,
            onlyStaff: false,
          }),
        );
        if (!loader.show) {
          handleClear();
        }
      } else {
        dispatch(show(true));
        const formData = new FormData();
        formData.append('first_name', form?.first_name);
        formData.append('last_name', form?.last_name);
        formData.append('is_active', forEdit?.is_active);
        formData.append('is_staff', forEdit?.is_staff);
        formData.append('role', form?.role);
        formData.append('user_type', forEdit?.user_type);
        formData.append('email', form?.email);
        formData.append('email_opted_in', isChecked);
        typeof form?.linkedIn_url === 'string' &&
          formData.append('linkedin_url', validateURL(form?.linkedIn_url));
        form?.phone_number?.length >= 10 && formData.append('phone_number', form?.phone_number);
        form?.reports_to !== undefined &&
          formData.append(
            'reports_to',
            form?.reports_to == 0 || form?.reports_to == null || form?.reports_to == undefined
              ? ''
              : form?.reports_to,
          );
        formData.append('target_value', form?.target == undefined ? 0 : form?.target);
        // imgBlob !== null && formData.append('avatar', imgBlob)
        // formData.append('date_joined', forEdit.data_joined && forEdit.data_joined);
        dispatch(
          editUser({
            id: forEdit?.id,
            data: formData,
            onlyStaff: true,
          }),
        );
        if (forDealPolice) {
          const policeForm = new FormData();
          policeForm.append('mobile_number', form.phone_number);
          dispatch(
            editDealPolice({
              deal_police_id: forEdit?.deal_police_id,
              data: policeForm,
              card_id: forEdit?.card_id,
            }),
          );
        }
        if (accessGroup?.length > 0) {
          dispatch(saveAccessGroup(accessGroup));
        }
        if (!loader.show) {
          handleClear();
        }
      }
    }
  };

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleImg = (event) => {
    setImgBlob(event.target.files[0]);
  };

  const handleShowImg = (e) => {
    setImgBlob(e.img);
    setImgToAdd(e.file);
  };

  const handleSelectedAccess = (e) => {
    if (e?.length > 0) {
      e.forEach((element) => {
        setAccessGroup([...accessGroup, { user: forEdit?.id, group: element?.id }]);
      });
    }
  };
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
      >
        <AppBar className={classes.appBar}>
          <Toolbar className="justify-space-between">
            <strong>
              {forEdit?.disabled
                ? 'Edit Contact'
                : forEdit?.data_joined
                  ? 'Edit User'
                  : forCompany
                    ? 'Add New Contact'
                    : 'Add Colleague'}
            </strong>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClear}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="mb-3 p-3">
          {forCompany || addContact ? (
            <div>
              <label className="form-label">Upload Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                className="text-input"
                name="avatar"
                onChange={handleImg}
              />
            </div>
          ) : (
            <div className="d-flex justify-centre">
              <StyledBadge
                badgeContent={
                  <IconButton onClick={handleImgDialog}>
                    {forEdit?.data_joined ? (
                      <Edit style={{ fontSize: 15, color: '#ffffff' }} />
                    ) : (
                      <Add style={{ fontSize: 15, color: '#ffffff' }} />
                    )}
                  </IconButton>
                }
                color="primary"
              >
                <div>
                  <Avatar
                    src={imgBlob}
                    style={{ height: 80, width: 80 }}
                  />
                </div>
              </StyledBadge>
            </div>
          )}
        </div>
        <div className="addNewUserWrap d-flex p-3">
          <div>
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="text-input"
              defaultValue={forEdit?.first_name ? forEdit?.first_name : form?.first_name}
              value={form?.first_name}
              name="first_name"
              onChange={handleForm}
            />
          </div>
          <div>
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="text-input"
              defaultValue={forEdit?.last_name ? forEdit?.last_name : form?.last_name}
              value={form?.last_name}
              name="last_name"
              onChange={handleForm}
            />
          </div>
        </div>
        <div className="addNewUserWrap d-flex p-3">
          <div>
            <label className="form-label">
              <MailOutline /> Email
            </label>
            <input
              type="text"
              className="text-input"
              defaultValue={forEdit?.email ? forEdit?.email : form?.email}
              value={form?.email}
              name="email"
              onChange={handleForm}
            />
          </div>
          <div className="selectbox">
            <label className="form-label">Role</label>
            {addContact || forCompany ? (
              <select
                className="text-input"
                defaultValue={forEdit?.role}
                name="role"
                style={{ color: '#222' }}
                onChange={handleForm}
              >
                <option value="select">Select</option>
                {companyRoleArr?.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role == '' || role == undefined ? '' : capitalizeWords(role)}
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="text-input"
                defaultValue={forEdit?.role}
                name="role"
                style={{ color: '#222' }}
                onChange={handleForm}
              >
                <option value="select">Select</option>
                {usersRoleArr?.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {role == '' || role == undefined ? '' : capitalizeWords(role)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="addNewUserWrap d-flex p-3">
          <div>
            <label className="form-label">
              <PhoneAndroidOutlined /> Phone Number
            </label>
            <input
              type="tel"
              maxLength={12}
              className="text-input"
              defaultValue={
                forEdit?.phone_number === 'undefined'
                  ? ''
                  : forEdit?.phone_number
                    ? forEdit?.phone_number
                    : form?.phone_number
              }
              value={form?.phone_number}
              name="phone_number"
              onChange={handleForm}
            />
          </div>
          <div>
            <label className="form-label">LinkedIn Url</label>
            <input
              type="text"
              className="text-input"
              defaultValue={
                forEdit?.linkedin_url === 'undefined'
                  ? ''
                  : forEdit?.linkedin_url
                    ? forEdit?.linkedin_url
                    : form?.linkedIn_url
              }
              value={form?.linkedIn_url}
              name="linkedIn_url"
              onChange={handleForm}
            />
          </div>
        </div>
        <div className="addNewUserWrap d-flex p-3">
          <div className="selectbox">
            <label className="form-label">Reports to</label>
            <select
              className="text-input"
              defaultValue={forEdit?.reports_to}
              name="reports_to"
              style={{ color: '#222' }}
              onChange={handleForm}
            >
              <option value={0}>Select</option>
              {(forCompany ? filteredLightUsers : activeUsers)?.map((user) => (
                <option
                  key={user.id}
                  value={user?.id}
                >
                  {user?.first_name + ' ' + user?.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            {!forCompany && !addContact && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={handleCheck}
                  />
                }
                label={<strong>Receive Daily Digest Email</strong>}
              />
            )}
          </div>
        </div>
        {forEdit?.data_joined && !forCompany && !addContact ? (
          <div className="addNewUserWrap d-flex p-3">
            <div>
              <label className="form-label">Access</label>
              <AutoComplete
                selected={handleSelectedAccess}
                user_access={(forEdit?.access_group || [])?.map((access) => access)}
              />
            </div>
            <div>
              <label className="form-label">Sales Target</label>
              <input
                type="number"
                className="text-input"
                defaultValue={forEdit?.target ? forEdit?.target : form?.target}
                value={form?.target}
                name="target"
                onChange={handleForm}
              />
            </div>
          </div>
        ) : (
          ''
        )}
        <DialogActions>
          <Button
            onClick={handleClear}
            style={{ color: '#627daf', outline: 'none', fontSize: '1.3rem' }}
          >
            Cancel
          </Button>
          <>
            {forEdit?.data_joined ? (
              <Button
                variant="contained"
                onClick={updateUser}
                style={{
                  backgroundColor: '#627daf',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '1.3rem',
                }}
              >
                {loader.show ? (
                  <CircularProgress
                    size={20}
                    style={{ color: '#ffffff' }}
                  />
                ) : (
                  'UPDATE'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={addNewUser}
                style={{
                  backgroundColor: '#627daf',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '1.3rem',
                }}
              >
                {loader.show ? (
                  <CircularProgress
                    size={20}
                    style={{ color: '#ffffff' }}
                  />
                ) : (
                  'ADD'
                )}
              </Button>
            )}
          </>
        </DialogActions>
      </Dialog>
      <NewCompanyDialog
        open={showConfirmation}
        handleClose={handleConfirmation}
        company={form?.company}
      />
      <AddAccessGroup open={dialog?.show} />
      <ImgDialog
        open={showImgDialog}
        image={imgBlob}
        forEdit={forEdit?.edit}
        showImg={handleShowImg}
        profileData={forEdit || []}
        handleClose={handleCloseImgDialog}
      />
    </>
  );
  function validateURL(link) {
    return link?.indexOf('http://') == 0 || link?.indexOf('https://') == 0
      ? link
      : link === ''
        ? ''
        : 'http://' + link;
  }
}

export default React.memo(AddNewUser);
