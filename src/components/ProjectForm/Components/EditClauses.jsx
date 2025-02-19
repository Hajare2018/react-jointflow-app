import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  IconButton,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateClause } from '../../../Redux/Actions/document-upload';
import { showErrorSnackbar } from '../../../Redux/Actions/snackbar';
import Loader from '../../Loader';
import { useUserContext } from '../../../context/UserContext';

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

function EditClauses({ open, handleClose, document_id, filters }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const clause = useSelector((state) => state.singleClausesData);
  const loader = useSelector((state) => state.showLoader);
  const clauseData = clause?.data?.length > 0 ? clause?.data : [];
  const { permissions } = useUserContext();
  const allPermissions = permissions?.group?.map((access) => access.permission);
  const accessClauseApproval = allPermissions?.filter(
    (access) => access?.codename === 'approve_contract_clauses',
  );
  const [rollup, setRollup] = useState(false);
  const [hide, setHide] = useState(false);
  const [stareClause, setStareClause] = useState(false);
  const [approved, setApproved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    text: '',
    comment: '',
  });

  const handleForm = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleClear = () => {
    setForm({
      name: '',
      text: '',
      comment: '',
    });
    setHide(false);
    setRollup(false);
    setStareClause(false);
    setApproved(false);
    handleClose();
  };
  const { user } = useUserContext();

  const handleUpdateClause = () => {
    if (approved && (form.comment === '' || form.comment === undefined)) {
      dispatch(showErrorSnackbar("Approval comment is required if you've approved this clause!"));
    } else {
      const reqBody = {
        clause_name: form.name,
        clause_text: form.text,
        roll_up: rollup,
        hide: hide,
        stare_clause: stareClause,
        approved_status: approved,
        approved_comment: form.comment,
        approved_by: user?.id,
      };
      dispatch(
        updateClause({
          clause_id: clauseData?.[0]?.id,
          data: reqBody,
          doc_id: document_id,
          hidden: filters === 3,
          modified: filters === 1,
          stareClauses: filters === 2,
        }),
      );
      if (!loader.show) {
        handleClear();
      }
    }
  };

  useEffect(() => {
    const plainText = clauseData?.[0]?.clause_text?.replace(/(<([^>]+)>)/gi, '');
    if (clauseData?.[0]?.roll_up) {
      setForm({
        name: '',
        text: clauseData?.[0]?.clause_name + ' ' + plainText,
        comment: clauseData?.[0]?.approved_comment,
      });
    } else {
      setForm({
        name: clauseData?.[0]?.clause_name,
        text: plainText,
        comment: clauseData?.[0]?.approved_comment,
      });
    }
    setHide(clauseData?.[0]?.hide);
    setRollup(clauseData?.[0]?.roll_up);
    setStareClause(clauseData?.[0]?.stare_clause);
    setApproved(clauseData?.[0]?.approved_status);
  }, [clause]);

  useEffect(() => {}, [form, hide, rollup, stareClause]);
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      aria-labelledby="form-dialog-title"
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Edit Clause</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClear}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      {loader?.show ? (
        <div style={{ height: 400 }}>
          <Loader />
        </div>
      ) : (
        <>
          <div className="d-flex-column p-15">
            <div className="flex-5">
              <label className="form-label">Clause Name</label>
              <input
                type="text"
                name="name"
                // placeholder={form?.name === "" ? "Loading..." : ""}
                disabled
                className={'text-input'}
                style={{ color: '#aeaeae' }}
                value={form.name}
                maxLength={100}
                onChange={handleForm}
              />
            </div>
            <div className="flex-5">
              <label className="form-label">Clause Text</label>
              <textarea
                type="text"
                name="text"
                // placeholder={form?.text === "" ? "Loading..." : ""}
                disabled
                rows={5}
                style={{ color: '#999' }}
                className={'text-input-area'}
                value={form?.text}
                onChange={handleForm}
              />
            </div>
            <div className="d-flex-column">
              <div className="d-flex">
                <div className="flex-2">
                  <Checkbox
                    checked={rollup == undefined ? false : rollup}
                    onChange={(event) => {
                      setRollup(event.target.checked);
                      if (event.target.checked) {
                        setForm({
                          name: '',
                          text: form.name + ' ' + form.text,
                          comment: form.comment,
                        });
                      } else {
                        setForm({
                          name: form.name,
                          text: form.text,
                          comment: form.comment,
                        });
                      }
                    }}
                  />
                  <Tooltip title="This paragraph is part of the previous clause">
                    <label className="form-label">Rollup</label>
                  </Tooltip>
                </div>
                <div className="flex-2">
                  <Checkbox
                    checked={hide == undefined ? false : hide}
                    onChange={(event) => setHide(event.target.checked)}
                  />
                  <Tooltip title="Hide this clause">
                    <label className="form-label">Hide</label>
                  </Tooltip>
                </div>
                <div className="flex-3">
                  <Checkbox
                    checked={stareClause == undefined ? false : stareClause}
                    onChange={(event) => setStareClause(event.target.checked)}
                  />
                  <Tooltip title="Mark as important">
                    <label className="form-label">Stare Clause</label>
                  </Tooltip>
                </div>
                {accessClauseApproval?.length > 0 && (
                  <div className="flex-3">
                    <Checkbox
                      checked={approved == undefined ? false : approved}
                      onChange={(event) => setApproved(event.target.checked)}
                    />
                    <Tooltip title="Approve this clause">
                      <label className="form-label">Approve</label>
                    </Tooltip>
                  </div>
                )}
              </div>
              {approved && accessClauseApproval?.length > 0 && (
                <div>
                  <label className="form-label">Approval Comment</label>
                  <textarea
                    type="text"
                    name="comment"
                    rows={5}
                    className={form.comment === '' ? 'text-input-area-error' : 'text-input-area'}
                    value={form.comment}
                    onChange={handleForm}
                  />
                </div>
              )}
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
              onClick={handleUpdateClause}
            >
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default React.memo(EditClauses);
