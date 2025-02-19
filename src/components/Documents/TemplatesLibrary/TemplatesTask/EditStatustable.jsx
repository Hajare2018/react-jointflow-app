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
import { Close } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrmStages } from '../../../../Redux/Actions/crm-data';
import { updatePlaybookStatus } from '../../../../Redux/Actions/create-project';
import { show } from '../../../../Redux/Actions/loader';
import { useTenantContext } from '../../../../context/TenantContext';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#ffffff',
  },
}));

function EditStatusTable({ open, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [syncToCRM, setSyncToCRM] = useState(false);
  const [form, setForm] = useState({
    label: '',
    system_status: 0,
  });
  const [CRMStage, setCRMStage] = useState({
    crm_stage: '',
    crm_stage_label: '',
  });
  const status = useSelector((state) => state.singleStatusData);
  const statusData = status?.data?.length > 0 ? status?.data?.[0] : [];
  const loader = useSelector((state) => state.showLoader);
  const systemStatus = useSelector((state) => state.anotherStatusesData);
  const systemStatusData = systemStatus?.data?.length > 0 ? systemStatus?.data : [];
  const crm_stages = useSelector((state) => state.crmStatusData);
  const stageData = crm_stages?.data?.stages?.length > 0 ? crm_stages?.data?.stages : [];
  const { crm_system, hubspot_pipeline_id } = useTenantContext();

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCRMStage = (event) => {
    const filteredStage = stageData?.filter((stage) => stage.id == event.target.value);
    setCRMStage({
      crm_stage_label: filteredStage?.[0]?.name,
      crm_stage: event.target.value,
    });
  };

  const handleSyncToCRM = () => {
    setSyncToCRM(!syncToCRM);
  };

  useEffect(() => {
    setForm({
      label: statusData?.custom_label,
      system_status: statusData?.status,
    });
    setCRMStage({
      crm_stage: statusData?.crm_stage_id,
      crm_stage_label: statusData?.crm_stage_label,
    });
    setSyncToCRM(statusData?.sync_to_crm);
  }, [status]);

  useEffect(() => {
    if (crm_system !== undefined && hubspot_pipeline_id !== undefined) {
      dispatch(
        fetchCrmStages({
          crm_name: crm_system,
          pipeline_id: hubspot_pipeline_id === null ? 'default' : hubspot_pipeline_id,
        }),
      );
    }
  }, [hubspot_pipeline_id]);

  useEffect(() => {}, [form, CRMStage]);

  const saveStatus = () => {
    dispatch(show(true));
    const reqBody = {
      custom_label: form.label,
      status: form.system_status,
      crm_stage_ID: CRMStage.crm_stage,
      crm_stage_label: CRMStage.crm_stage_label,
      sync_to_crm: syncToCRM,
    };
    dispatch(
      updatePlaybookStatus({
        id: statusData?.id,
        data: reqBody,
        board: statusData?.board,
      }),
    );
    if (!loader.show) {
      handleClear();
    }
  };

  const handleClear = () => {
    setForm({
      label: '',
      system_status: 0,
    });
    setCRMStage({
      crm_stage: '',
      crm_stage_label: '',
    });
    setSyncToCRM(false);
    handleClose();
  };
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={handleClose}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong style={{ color: '#627daf' }}>Edit Status</strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <Close style={{ fontSize: 30, color: '#627daf' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="p-4">
        <div className="addNewUserWrapad d-flex-row justify-space-around">
          <div style={{ flex: 5, marginRight: 20 }}>
            <label className="form-label">Label</label>
            <input
              type="text"
              className={'comment-form-control'}
              name="label"
              value={form.label}
              onChange={handleForm}
              maxLength={'35'}
            />
          </div>
          <div style={{ flex: 5 }}>
            <label className="form-label">System Status</label>
            <select
              className={'text-input'}
              placeholder="Please Select"
              name="system_status"
              style={{ color: '#222222' }}
              value={form.system_status}
              onChange={handleForm}
            >
              <option
                value="Status"
                disabled={form.system_status !== null}
              >
                Select A Status
              </option>
              {systemStatusData.map((status) => (
                <option
                  key={status.id}
                  value={status.id}
                >
                  {status.custom_label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="addNewUserWrapad d-flex-row justify-space-around">
          <div style={{ flex: 5, marginRight: 20 }}>
            <FormControlLabel
              label={<strong>Sync to CRM</strong>}
              control={
                <Checkbox
                  checked={syncToCRM}
                  onChange={handleSyncToCRM}
                />
              }
            />
          </div>
          {syncToCRM && (
            <div style={{ flex: 5 }}>
              <label className="form-label">CRM Stage</label>
              <select
                className="text-input"
                style={{ color: '#000000' }}
                name="crm_stage"
                value={CRMStage.crm_stage}
                onChange={handleCRMStage}
              >
                <option
                  value="Stage"
                  disabled={CRMStage.crm_stage !== null}
                >
                  Select A Stage
                </option>
                {stageData?.map((stage) => (
                  <option
                    key={stage.id}
                    value={stage.id}
                  >
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <DialogActions>
        <Button
          variant="contained"
          onClick={saveStatus}
          style={{
            backgroundColor: '#6385b7',
            color: '#ffffff',
            fontSize: 16,
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(EditStatusTable);
