import { Avatar, Button, CircularProgress, Dialog, DialogActions } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { show } from '../../Redux/Actions/loader';
import { postCompany, putCompany } from '../../Redux/Actions/companies';
import industries from './IndustryList';
import { createImageFromInitials } from '../Utils';
import { completed } from '../../Redux/Actions/completed-value';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function AddNewCompany({ open, handleClose, data }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    companyName: '',
    industryType: '',
    websiteUrl: '',
    parentCompany: 0,
    companyIcon: null,
  });

  const loader = useSelector((state) => state.showLoader);
  const companiesData = useSelector((state) => state?.companiesData);
  const company_list = companiesData?.data?.length > 0 ? companiesData?.data : [];

  useEffect(() => {}, [
    form.companyName,
    form.industryType,
    form.websiteUrl,
    form.companyIcon,
    form.parentCompany,
  ]);

  useEffect(() => {
    setForm({
      companyName: data?.company_name,
      industryType: data?.industry,
      websiteUrl: data?.website_url,
      parentCompany: data?.parent_company,
    });
  }, [data]);

  const saveCompany = () => {
    dispatch(show(true));
    let formData = new FormData();
    formData.append('name', form.companyName);
    formData.append('created_at', new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
    formData.append('seller_company', 1);
    form.websiteUrl !== undefined && formData.append('website_url', form.websiteUrl);
    form.industryType !== undefined && formData.append('industry', form.industryType);
    formData.append('active', 'True');
    formData.append('archived', 'False');
    (form.parentCompany !== null || form.parentCompany !== undefined || form.parentCompany !== 0) &&
      formData.append('parent_company', form.parentCompany);
    form?.companyIcon !== undefined && formData.append('company_image', form?.companyIcon);
    dispatch(postCompany({ data: formData }));
    if (data?.company_name) {
      dispatch(completed(true));
    }
    if (!loader.show) {
      setForm({});
      handleClose();
    }
  };

  const updateCompany = () => {
    dispatch(show(true));
    let formData = new FormData();
    formData.append('name', form.companyName);
    formData.append('created_at', new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
    formData.append('seller_company', 1);
    form.websiteUrl !== undefined && formData.append('website_url', form.websiteUrl);
    form.industryType !== undefined && formData.append('industry', form.industryType);
    formData.append('active', 'True');
    formData.append('archived', 'False');
    (form.parentCompany !== null || form.parentCompany !== undefined || form.parentCompany !== 0) &&
      formData.append('parent_company', form.parentCompany);
    form?.companyIcon !== undefined && formData.append('company_image', form?.companyIcon);
    dispatch(putCompany({ id: data?.id, data: formData }));
    if (!loader.show) {
      handleClear();
    }
  };

  const handleClear = () => {
    setForm({ form: {} });
    handleClose();
  };

  const handleForm = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.name === 'companyIcon' ? event.target.files[0] : event.target.value,
    });
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <div className="d-flex">
            {data?.icon && (
              <Avatar
                className={data?.icon && 'img-lazy-avatar mr-10'}
                src={
                  data?.icon
                    ? data?.icon
                    : createImageFromInitials(200, data?.company_name, '#627daf')
                }
              />
            )}
            <Typography style={{ fontWeight: 'bold' }}>
              {data?.company_name ? data?.company_name : 'Add New Company'}
            </Typography>
          </div>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClear}
            aria-label="close"
          >
            <CloseIcon style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="d-flex-column p-15">
        <div className="mb-3">
          <label className="form-label">Company Icon</label>
          <input
            type="file"
            accept="image/*"
            className="text-input"
            name="companyIcon"
            onChange={handleForm}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="text-input"
            defaultValue={data?.company_name ? data?.company_name : form.companyName}
            value={form.companyName}
            name="companyName"
            onChange={handleForm}
          />
        </div>
        <div className="selectbox">
          <label className="form-label">Industry</label>
          <input
            type="text"
            placeholder="Select an Industry"
            list="industry"
            className="text-input"
            value={form.industryType}
            name="industryType"
            onChange={handleForm}
          />
          <datalist id="industry">
            {industries.map((item, key) => (
              <option
                key={key}
                value={item.name}
              >
                {item.name}
              </option>
            ))}
          </datalist>
        </div>
        <div className="mb-3">
          <label className="form-label">Website URL</label>
          <input
            type="text"
            className="text-input"
            defaultValue={data?.website_url ? data?.website_url : form.websiteUrl}
            value={form.websiteUrl}
            name="websiteUrl"
            onChange={handleForm}
          />
        </div>
        <div className="selectbox">
          <label className="form-label">Select a Parent Company</label>
          <select
            className="form-select"
            value={form.parentCompany}
            name="parentCompany"
            onChange={handleForm}
          >
            <option>Select</option>
            {company_list?.map((company) => (
              <option
                key={company.id}
                value={company.id}
              >
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DialogActions>
        <Button
          onClick={handleClose}
          style={{ color: '#627daf', outline: 'none', fontSize: '1.3rem' }}
        >
          Cancel
        </Button>
        {data?.edit ? (
          <Button
            onClick={updateCompany}
            variant="contained"
            style={{
              backgroundColor: '#627daf',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1.3rem',
            }}
          >
            {loader.show ? (
              <CircularProgress
                size={15}
                style={{ color: '#ffffff' }}
              />
            ) : (
              'UPDATE'
            )}
          </Button>
        ) : (
          <Button
            onClick={saveCompany}
            variant="contained"
            style={{
              backgroundColor: '#627daf',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1.3rem',
            }}
          >
            {loader.show ? (
              <CircularProgress
                size={15}
                style={{ color: '#ffffff' }}
              />
            ) : (
              'ADD'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(AddNewCompany);
