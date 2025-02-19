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
import { CloseOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewFaq, updateFaq } from '../../../Redux/Actions/feedback';
import { showErrorSnackbar } from '../../../Redux/Actions/snackbar';

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

function AddFaqs({ forAdd, open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [hide, setHide] = useState(false);
  const [important, setImportant] = useState(false);
  const [form, setForm] = useState({
    name: '',
    link: '',
    content: '',
    display_order: null,
  });
  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const keep = useSelector((state) => state.keepThis);
  const faqData = useSelector((state) => state.singleFaqData);
  const faq = faqData?.data?.length > 0 ? faqData?.data : [];
  useEffect(() => {}, [form, hide, important]);
  useEffect(() => {
    if (forAdd) {
      setForm({
        name: '',
        link: '',
        content: '',
        display_order: '',
      });
      setHide(false);
      setImportant(false);
    } else {
      setForm({
        name: faq?.[0]?.name,
        link: faq?.[0]?.link_url,
        content: faq?.[0]?.text_content,
        display_order: faq?.[0]?.display_order,
      });
      setHide(faq?.[0]?.hide);
      setImportant(faq?.[0]?.important);
    }
  }, [faqData, forAdd]);
  const handleClear = () => {
    setForm({
      name: '',
      link: '',
      content: '',
      display_order: '',
    });
    setHide(false);
    setImportant(false);
    handleClose();
  };
  const handleSaveFaq = () => {
    const reqBody = {
      name: form.name,
      text_content: form.content,
      link_url: form.link,
      display_order: form.display_order,
      important: important,
      hide: hide,
      archive: false,
    };
    if (form.name === '' || form.content === '') {
      dispatch(showErrorSnackbar('All fields are reqiured!'));
    } else {
      if (forAdd) {
        dispatch(addNewFaq({ data: reqBody }));
        if (!keep.show) {
          handleClear();
        }
      } else {
        dispatch(updateFaq({ data: reqBody, id: faq?.[0]?.id }));
        if (!keep.show) {
          handleClear();
        }
      }
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
          <strong>{forAdd ? 'Add FAQs' : `Edit`}</strong>
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
        <div className="d-flex">
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
            <label className="form-label">Link Url</label>
            <input
              type="text"
              name="link"
              className={form.link === '' ? 'error-form-control' : 'text-input'}
              value={form.link}
              onChange={handleForm}
            />
          </div>
        </div>
        <div>
          <label className="form-label">Text Content</label>
          <textarea
            name="content"
            className={form.content === '' ? 'error-form-control' : 'text-input'}
            value={form.content}
            onChange={handleForm}
          />
        </div>
        <div className="d-flex">
          <div className="flex-4">
            <label className="form-label">Display Order</label>
            <input
              type="text"
              name="display_order"
              className={form.display_order === null ? 'error-form-control' : 'text-input'}
              value={form.display_order}
              onChange={handleForm}
            />
          </div>
          <div className="flex-3 m-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={hide}
                  onChange={() => setHide(!hide)}
                />
              }
              label={<strong style={{ color: '#000000' }}>Hide</strong>}
            />
          </div>
          <div className="flex-3">
            <FormControlLabel
              control={
                <Checkbox
                  checked={important}
                  onChange={() => setImportant(!important)}
                />
              }
              label={<strong style={{ color: '#000000' }}>Important</strong>}
            />
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
          style={{ backgroundColor: '#6385b7', color: '#ffffff', fontSize: 16 }}
          onClick={handleSaveFaq}
        >
          {forAdd ? 'Add' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(AddFaqs);
