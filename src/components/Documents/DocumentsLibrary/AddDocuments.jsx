import { Button, CircularProgress, Dialog, DialogActions } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { postDocumentData, updateDocument } from '../../../Redux/Actions/document-upload';
import { show } from '../../../Redux/Actions/loader';
import { requestDocumentsType } from '../../../Redux/Actions/documents-type';
import { showErrorSnackbar } from '../../../Redux/Actions/snackbar';
import { useUserContext } from '../../../context/UserContext';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 10000000;

function AddDocuments({ open, handleClose, data, categories }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { user: parsedData } = useUserContext();
  const [form, setForm] = useState({
    fileName: data ? data?.name : '',
    documentType: data ? data?.document_type : '',
    version: data ? data?.version : '',
    category: data ? data?.category : '',
  });
  const [file, setFile] = useState(null);

  const taskTypeData = useSelector((state) => state.documentsType);
  const docType = taskTypeData.data.length > 0 ? taskTypeData.data : [];
  const activeTypes = useMemo(() => docType?.filter((item) => item.active === true), [docType]);
  const documentsType = useMemo(
    () =>
      activeTypes?.filter((item) => item.applies_to === 'Documents' || item.applies_to === 'Both'),
    [activeTypes],
  );

  useEffect(() => {}, [form.fileName, form.documentType, form.version, file]);

  useEffect(() => {
    dispatch(requestDocumentsType());
  }, []);

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleFile = (event) => {
    if (event.target.files[0].size > DEFAULT_MAX_FILE_SIZE_IN_BYTES) {
      dispatch(showErrorSnackbar('Maximum file Size allowed is 10Mb'));
    } else {
      setFile(event.target.files[0]);
    }
  };

  const handleClear = () => {
    setForm({ form: {} });
    setFile(null);
    handleClose();
  };

  useEffect(() => {
    async function fetchData() {
      await fetch(data?.file).then((r) => {
        r.blob().then((blob) => {
          const imgName = data?.file?.split('/');
          const contentType = r.headers.get('content-type');
          let file = new File([blob], imgName && imgName[4], { contentType });
          setForm({
            ...form,
            fileName: data ? data?.name : '',
            documentType: data ? data?.document_type : '',
            version: data ? data?.version : '',
            category: data ? data?.category : '',
          });
          file && setFile(file);
        });
      });
    }
    fetchData();
  }, [data]);

  const loader = useSelector((state) => state.showLoader);

  const handleDocuments = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', form?.fileName);
    formData.append(
      'document_type',
      form?.documentType == undefined ? documentsType?.[0]?.id : form?.documentType,
    );
    formData.append('created_at', new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
    formData.append('change_percent', 1);
    formData.append('size', file?.size);
    formData.append('version', 1);
    formData.append('created_by', parsedData?.id);
    formData.append('category', form.category);
    formData.append('is_template', true);
    formData.append('archived', false);
    dispatch(show(true));
    dispatch(
      postDocumentData({
        data: formData,
        fetchDocList: false,
        allDocs: true,
        liteView: false,
        archived: false,
        isTemplate: true,
      }),
    );
    if (!loader.show) {
      handleClear();
    }
  };

  const handleUpdateDocument = () => {
    const formData = new FormData();
    formData.append('name', form?.fileName);
    formData.append('document_type', form.documentType);
    formData.append(
      'created_at',
      data?.created_at ? data?.created_at : new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
    );
    formData.append('category', form.category);
    formData.append('change_percent', 1);
    formData.append('size', file?.size);
    formData.append('version', 1);
    formData.append('created_by', parsedData.id);
    formData.append('is_template', data?.is_template ? 'True' : 'False');
    formData.append('source_template', data?.library_id);
    formData.append('archived', data?.archived ? 'True' : 'False');
    dispatch(show(true));
    dispatch(
      updateDocument({
        id: data?.library_id,
        data: formData,
        archived: false,
        refresh: true,
      }),
    );
    if (!loader.show) {
      handleClear();
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>{data.edit_template ? 'Edit Document' : 'Add Document'}</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="d-flex-column p-15">
        {data?.add_template && (
          <div className="mb-3">
            <label className="form-label">Upload File</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="file"
                accept=".doc,.docx,.xls,.pdf,.xlxs,.xlsx,.json,.ics"
                onChange={handleFile}
                className="text-input"
              />
            </div>
            {file?.name !== 'undefined' && <h4>{file && file?.name}</h4>}
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">File Name</label>
          <input
            type="text"
            className="text-input"
            value={form.fileName}
            name="fileName"
            onChange={handleForm}
          />
        </div>
        <div className="selectbox">
          <label className="form-label">Document Type</label>
          <select
            className="text-input"
            style={{ color: '#222222' }}
            name="documentType"
            value={form.documentType}
            onChange={handleForm}
            required
          >
            <option value="0">Select</option>
            {documentsType?.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.custom_label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Category</label>
          <input
            type="text"
            autoComplete="off"
            placeholder={'Select a Category'}
            list="data"
            className="text-input"
            value={form.category}
            name="category"
            onChange={handleForm}
          />
          <datalist id="data">
            {(categories || [])?.map((item, key) => (
              <option
                key={key}
                value={item?.category}
              />
            ))}
          </datalist>
        </div>
      </div>
      <DialogActions>
        <Button
          onClick={handleClose}
          style={{ color: '#627daf', outline: 'none', fontSize: '1.3rem' }}
        >
          Cancel
        </Button>
        {data.edit_template ? (
          <Button
            onClick={handleUpdateDocument}
            variant="contained"
            style={{ backgroundColor: '#627daf', color: '#ffffff' }}
          >
            {loader.show ? <CircularProgress className="white-color" /> : 'UPDATE'}
          </Button>
        ) : (
          <Button
            onClick={handleDocuments}
            variant="contained"
            style={{ backgroundColor: '#627daf', color: '#ffffff' }}
          >
            {loader.show ? <CircularProgress className="white-color" /> : 'ADD'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(AddDocuments);
