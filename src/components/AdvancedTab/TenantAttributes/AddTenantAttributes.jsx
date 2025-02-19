import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  FormControlLabel,
  IconButton,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { CloseOutlined, LaunchOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorSnackbar } from '../../../Redux/Actions/snackbar';
import { editTenantAttributes, writeTenantAttributes } from '../../../Redux/Actions/user-info';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
  marginLeft: theme.spacing(2),
  flex: 1,
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
  '& > *': {
    root: {
      margin: theme.spacing(0),
      fontWeight: '600',
      color: '#999',
    },
  },
  '& .MuiAutocomplete-input': {
    fontSize: 16,
  },
}));

function AddTenantAttributes({ open, handleClose, forAdd }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const keep = useSelector((state) => state.keepThis);
  const attributes = useSelector((state) => state.tenantData);
  const attributesData = attributes?.data?.length > 0 ? attributes?.data?.[0] : [];
  const [sampleFile, setSampleFile] = useState(null);
  const [switchedValue, setSwitchedValue] = useState(false);
  const [boolValue, setBoolValue] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '',
    int: '',
    date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
    file: '',
    text: '',
    json: '',
  });

  const handleForm = (event) => {
    if (event.target.name === 'file') {
      setForm({ ...form, [event.target.name]: event.target.files[0] });
      setSampleFile(event.target.files[0]);
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const handleAddTenantAttrs = () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('type', form.type);
    formData.append('value_text', form.type === 'Text' ? form.text : '');
    formData.append('value_int', form.type === 'Integer' ? form.int : '');
    formData.append(
      'value_datetime',
      form.type === 'Datetime' ? new Date(form.date).toISOString() : '',
    );
    formData.append('value_bool', form.type === 'Bool' ? boolValue : false);
    formData.append('value_file', form.type === 'File' ? form.file : '');
    form.type === 'Json' && formData.append('value_json', form.type === 'Json' ? form.json : '');
    formData.append('hide', switchedValue);
    formData.append('archive', forAdd ? false : attributesData?.archive);
    if (form.name === '' || form.type === '') {
      dispatch(showErrorSnackbar('All fields are reqiured!'));
    } else {
      // dispatch(show(true))
      if (forAdd) {
        dispatch(writeTenantAttributes({ data: formData }));
        if (!keep.show) {
          handleClear();
        }
      } else {
        dispatch(
          editTenantAttributes({
            data: formData,
            attribute_name: attributesData?.name,
          }),
        );
        if (!keep.show) {
          handleClear();
        }
      }
    }
  };

  const handleClear = () => {
    setForm({
      name: '',
      type: '',
      int: '',
      date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
      file: '',
      text: '',
      json: '',
    });
    handleClose();
  };

  useEffect(() => {
    if (forAdd) {
      setForm({
        name: '',
        type: '',
        int: '',
        date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
        file: '',
        text: '',
        json: '',
      });
      setSampleFile(null);
      setSwitchedValue(false);
      setBoolValue(false);
    } else {
      setForm({
        name: attributesData?.name,
        type: attributesData?.type,
        int: attributesData?.value_int,
        date: new Date(attributesData?.value_datetime)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
        text: attributesData?.value_text,
        json: JSON.stringify(attributesData?.value_json),
      });
      setSampleFile(attributesData?.value_file);
      setSwitchedValue(attributesData?.hide);
      setBoolValue(attributesData?.value_bool);
    }
  }, [attributes, forAdd]);

  useEffect(() => {}, [form]);

  const handleCheck = () => {
    setSwitchedValue(!switchedValue);
    if (!switchedValue) {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert(
        'Please note that the entry will be available to the system but won’t be displayed in this list.',
      );
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={handleClear}
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>{forAdd ? 'Add System Settings' : `Edit ${attributesData?.name}`}</strong>
          <IconButton
            onClick={handleClear}
            edge="start"
            color="inherit"
            aria-label="close"
          >
            <CloseOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="d-flex-column p-15">
        <div className="d-flex mb-3">
          <div className="flex-5 mr-2">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className={form.name === '' ? 'error-form-control' : 'text-input'}
              value={form.name}
              onChange={handleForm}
            />
          </div>
          <div className="flex-5">
            <label className="form-label">Type</label>
            <select
              className="text-input"
              name="type"
              style={{
                color: '#222',
                borderColor: form.type === '' ? 'red' : '#aeaeae',
              }}
              value={form.type}
              onChange={handleForm}
            >
              <option value={'Select'}>Select</option>
              <option value={'Bool'}>Bool</option>
              <option value={'Datetime'}>DateTime</option>
              <option value={'File'}>File</option>
              <option value={'Integer'}>Integer</option>
              <option value={'Json'}>JSON</option>
              <option value={'Text'}>Text</option>
            </select>
          </div>
        </div>
        <div className="d-flex">
          <div className="d-flex flex-5">
            <FormControlLabel
              control={
                <Checkbox
                  checked={switchedValue}
                  onChange={handleCheck}
                />
              }
              label={<strong style={{ color: '#000000' }}>Hide</strong>}
            />
          </div>
          <div className="flex-5">
            {form.type === 'Datetime' ? (
              <>
                <label className="form-label">DateTime</label>
                <input
                  type="date"
                  className="text-input"
                  name="date"
                  min={new Date().toJSON().slice(0, 10).replace(/-/g, '-')}
                  defaultValue={form.date}
                  value={form.date}
                  onChange={handleForm}
                />
              </>
            ) : form.type === 'File' ? (
              <>
                <label className="form-label">File</label>
                <input
                  type="file"
                  accept="*"
                  name="file"
                  className="text-input"
                  // value={form.file}
                  onChange={handleForm}
                />
                {typeof sampleFile === 'object' ? (
                  <strong className="mt-3">{sampleFile?.name}</strong>
                ) : (
                  <div className="d-flex mt-3">
                    <strong>
                      Previously uploaded:
                      <a
                        href={sampleFile}
                        style={{ color: '#6385b7' }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {' '}
                        File Preview
                      </a>
                    </strong>
                  </div>
                )}
              </>
            ) : form.type === 'Integer' ? (
              <>
                <label className="form-label">Integer</label>
                <input
                  type="number"
                  name="int"
                  className="text-input"
                  value={form.int}
                  onChange={handleForm}
                />
              </>
            ) : form.type === 'Text' ? (
              <>
                <label className="form-label">Text</label>
                <textarea
                  type="text"
                  name="text"
                  rows={3}
                  className="text-input"
                  value={form.text}
                  onChange={handleForm}
                />
              </>
            ) : form.type === 'Bool' ? (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={boolValue}
                      onChange={() => setBoolValue(!boolValue)}
                    />
                  }
                  label={
                    <span style={{ color: '#333333' }}>
                      Boolean({boolValue ? 'True' : 'False'})
                    </span>
                  }
                />
              </>
            ) : form.type === 'Json' ? (
              <>
                <label className="form-label">JSON data</label>
                <textarea
                  type="text"
                  name="json"
                  rows={10}
                  style={{ border: '2px solid #aeaeae', width: '100%' }}
                  value={form.json}
                  onChange={handleForm}
                />
                <strong>
                  <a
                    href="https://jsonlint.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    JSON Validator
                    <LaunchOutlined className="h-4 w-4" />
                  </a>
                </strong>
              </>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <DialogActions>
        <Button
          variant="outlined"
          style={{ color: '#6385b7', fontSize: 16 }}
          onClick={handleClear}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#6385b7',
            color: '#ffffff',
            fontSize: 16,
          }}
          onClick={handleAddTenantAttrs}
        >
          {forAdd ? 'Add' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(AddTenantAttributes);
