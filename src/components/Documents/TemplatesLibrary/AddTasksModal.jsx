import { Button, Checkbox, DialogActions, FormControlLabel } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { displayDialog, keepData, show } from '../../../Redux/Actions/loader';
import postTaskData from '../../../Redux/Actions/task-info';
import editTaskData from '../../../Redux/Actions/update-task-info';
import { showErrorSnackbar } from '../../../Redux/Actions/snackbar';
import AppRadioGroup from '../../AppRadioGroup';
import { Check } from '@mui/icons-material';
import OptionsModal from './OptionsModal';
import requestSingleProject from '../../../Redux/Actions/single-project';
import { useUserContext } from '../../../context/UserContext';
import AppButton from '../../ProjectForm/Components/AppButton';

const toggles = [
  {
    id: 0,
    name: 'Internal',
    icon: <Check className="w-4 text-blue" />,
    active: <Check className="w-4 text-white" />,
    color: '#33e0b3',
    class: 'internal',
    display: true,
  },
  {
    id: 1,
    name: 'Shared',
    icon: <Check className="w-4 text-blue" />,
    active: <Check className="w-4 text-white" />,
    color: '#33e0b3',
    class: 'shared',
    display: true,
  },
  {
    id: 2,
    name: 'External',
    icon: <Check className="w-4 text-blue" />,
    active: <Check className="w-4 text-white" />,
    color: '#33e0b3',
    class: 'external',
    display: true,
  },
];

function AddTaskModal({ handleClose, forAdd }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    task_name: '',
    task_type: 0,
    offset: 0,
    duration: 0,
    weight: 0,
    description: '',
    seller: 0,
    timing: 'Offset',
    reference: null,
  });
  const [isChecked, setIsCheked] = useState(true);
  const [tab, setTab] = useState(0);
  const [notify, setNotify] = useState(false);
  const [taskTypeName, setTaskTypeName] = useState(null);
  const singleTask = useSelector((state) => state.singleCardData);
  const board = useSelector((state) => state.singleProjectData);
  const keep_data = useSelector((state) => state.keepThis);
  const showPrompt = useSelector((state) => state.dialog);
  const prompt = useSelector((state) => state.promptContextData);
  const prompt_data = prompt?.data;
  const cards = board?.data?.[0]?.cards;
  cards?.sort((a, b) => a.offset - b.offset);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data?.[0] : [];
  const filteredCard = cards?.filter((card) => card.id !== singleTaskData?.id);

  const handleChecked = () => {
    setIsCheked(!isChecked);
  };

  const handleNotify = () => {
    setNotify(!notify);
  };

  const { user } = useUserContext();
  const isAdmin = user.user_access_group?.some((role) => role.name === 'Admin');

  useEffect(() => {}, [
    form.task_name,
    form.task_type,
    form.offset,
    form.duration,
    form.description,
    form.seller,
    form.weight,
    form.timing,
    form.reference,
    form.notify,
  ]);

  useEffect(() => {
    if (!forAdd?.length && !keep_data.show) {
      setForm({
        task_name: '',
        task_type: 0,
        offset: 0,
        duration: 0,
        weight: 0,
        description: '',
        seller: 0,
        timing: 'Offset',
        reference: null,
      });
      setTab(0);
      setIsCheked(false);
      setNotify(false);
    } else if (keep_data.show) {
      setForm({
        task_name: singleTaskData?.title ? singleTaskData?.title : form.task_name,
        task_type: singleTaskData?.task_type_details?.id
          ? singleTaskData?.task_type_details?.id
          : form.task_type,
        offset: singleTaskData?.offset,
        duration: singleTaskData?.duration,
        weight: singleTaskData?.weight,
        description: singleTaskData?.description ? singleTaskData?.description : form.description,
        seller:
          singleTaskData?.internal_assignee_details == null &&
          singleTaskData?.template_owner_assigned
            ? 0
            : singleTaskData?.internal_assignee_details == null
              ? ''
              : singleTaskData?.internal_assignee_details?.id,
        timing: singleTaskData?.task_timing,
        reference: singleTaskData?.timing_ref_task === null ? 0 : singleTaskData?.timing_ref_task,
      });
      setIsCheked(singleTaskData?.client_visible);
      setNotify(singleTaskData?.notify_on_creation);
      setTab(
        singleTaskData?.side === 'internal'
          ? 0
          : singleTaskData?.side === 'shared'
            ? 1
            : singleTaskData?.side === 'external'
              ? 2
              : 0,
      );
    }
  }, [
    singleTask,
    // keep_data
  ]);

  const handleFilters = (id) => {
    setTab(id);
  };

  const taskTypeData = useSelector((state) => state.documentsType);
  const allUsers = useSelector((state) => state.allUsersData);
  const taskType = taskTypeData.data.length > 0 ? taskTypeData.data : [];
  const activeTypes = useMemo(() => taskType?.filter((item) => item.active === true), [taskType]);
  const appliesToTypes = useMemo(
    () => activeTypes?.filter((item) => item.applies_to === 'Tasks' || item.applies_to === 'Both'),
    [activeTypes],
  );

  appliesToTypes?.sort((a, b) => {
    if (a.custom_label.toLowerCase() < b.custom_label.toLowerCase()) {
      return -1;
    }
    if (a.custom_label.toLowerCase() > b.custom_label.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  const sellers = useMemo(
    () => allUsers?.data?.length > 0 && allUsers?.data?.filter((item) => item.is_active === true),
    [allUsers],
  );
  const handleClear = () => {
    dispatch(requestSingleProject({ id: board?.data?.[0]?.id }));
    setForm({
      task_name: '',
      task_type: 0,
      offset: 0,
      duration: 0,
      description: '',
      seller: 0,
      weight: 0,
      timing: 'Offset',
      reference: null,
    });
    setNotify(false);
    setIsCheked(false);
    handleClose();
  };

  const handleSaveTask = (type, weight, visible, side, type_duration, notify, assignee) => {
    const duration = parseInt(new Date().getDate()) + parseInt(form.duration);
    const end_date = new Date(new Date().setDate(duration - 1));
    dispatch(show(true));
    dispatch(
      postTaskData({
        title: form?.task_name,
        start_date: new Date()?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
        end_date:
          form.offset == 0 || form.duration == 0
            ? new Date()?.toJSON()?.slice(0, 10)?.replace(/-/g, '-')
            : new Date(end_date)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
        board: board?.data?.[0]?.id,
        owner: user?.id,
        description: form?.description,
        offset: form?.offset,
        duration: type_duration,
        weight: weight,
        task_timing: form?.timing,
        timing_ref_task: form?.reference === 0 ? null : form?.reference,
        is_completed: 'False',
        task_type: type,
        client_visible: visible,
        notify_on_creation: notify,
        internal_assignee: assignee,
        template_owner_assigned:
          form?.seller == 0 ? 'True' : form?.seller == 'Select' ? 'False' : 'False',
        external_assignee: null,
        side: side == 0 ? 'internal' : side == 1 ? 'shared' : side == 2 ? 'external' : '',
        reload: false,
        task_info: false,
        check_prompt: true,
        populateFromType: true,
      }),
    );
    dispatch(keepData(true));
  };

  const handleUpdate = (type, weight, visible, side, duration, notify, assignee) => {
    dispatch(show(true));
    if (
      form.task_name === '' ||
      form.description === '' ||
      (form.timing === 'Offset' && form.offset === '') ||
      form.duration === '' ||
      ((form.timing === 'Sequential' || form.timing === 'Synchronous') && form.reference === null)
    ) {
      dispatch(showErrorSnackbar('All fields are required!'));
      dispatch(keepData(true));
    } else {
      dispatch(
        editTaskData({
          id: singleTaskData?.id,
          title: form?.task_name,
          start_date: singleTaskData?.start_date,
          end_date: singleTaskData?.end_date,
          description: form?.description,
          offset: form?.offset,
          duration: duration,
          weight: weight,
          board: singleTaskData?.board,
          owner: user?.id,
          // color: taskColor?.[0].color,
          is_completed: singleTaskData?.is_completed,
          task_type: type,
          task_timing: form?.timing,
          client_visible: visible,
          notify_on_creation: notify,
          timing_ref_task: form?.reference === 0 ? null : form?.reference,
          internal_assignee: assignee,
          template_owner_assigned:
            form?.seller == 0 ? 'True' : form?.seller == 'Select' ? 'False' : 'False',
          side: side == 0 ? 'internal' : side == 1 ? 'shared' : side == 2 ? 'external' : '',
          external_assignee: null,
          reload: false,
          task_info: false,
          forTemplates: true,
          check_prompt: true,
        }),
      );
      if (!keep_data?.show) {
        handleClose();
      }
    }
  };

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (event.target.name === 'task_type') {
      const filtered = appliesToTypes?.filter((item) => item.id == event.target.value);
      setTaskTypeName(filtered?.[0]?.custom_label);
      dispatch(displayDialog(true));
    }
  };

  const handle = (e) => {
    if (e.yes) {
      dispatch(displayDialog(false));
      const filtered = appliesToTypes?.filter((item) => item.id == form.task_type);
      setForm({
        ...form,
        weight: filtered?.[0]?.weight > 10 ? 10 : filtered?.[0]?.weight,
        duration: filtered?.[0]?.duration,
        seller: filtered?.[0]?.internal_assignee_details?.id,
      });
      setIsCheked(filtered?.[0]?.client_visible);
      setTab(
        filtered?.[0]?.side === 'internal'
          ? 0
          : filtered?.[0]?.side === 'shared'
            ? 1
            : filtered?.[0]?.side === 'external'
              ? 2
              : 0,
      );
      if (singleTask?.data?.length > 0 && keep_data?.show) {
        handleUpdate(
          form.task_type,
          filtered?.[0]?.weight > 10 ? 10 : filtered?.[0]?.weight,
          filtered?.[0]?.client_visible,
          filtered?.[0]?.side === 'internal'
            ? 0
            : filtered?.[0]?.side === 'shared'
              ? 1
              : filtered?.[0]?.side === 'external'
                ? 2
                : 0,
          filtered?.[0]?.duration,
          notify,
          filtered?.[0]?.internal_assignee_details?.id,
        );
      } else {
        handleSaveTask(
          form.task_type,
          filtered?.[0]?.weight > 10 ? 10 : filtered?.[0]?.weight,
          filtered?.[0]?.client_visible,
          filtered?.[0]?.side === 'internal'
            ? 0
            : filtered?.[0]?.side === 'shared'
              ? 1
              : filtered?.[0]?.side === 'external'
                ? 2
                : 0,
          filtered?.[0]?.duration,
          notify,
          filtered?.[0]?.internal_assignee_details?.id,
        );
      }
    }
  };

  return (
    <div>
      <div className="d-flex-column p-15">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <AppRadioGroup
            filters={toggles}
            getFilters={handleFilters}
            tabId={tab}
            startIcon
            isAdmin={isAdmin}
          />
        </div>
        <div className="addNewUserWrapad d-flex-row justify-space-around">
          <div style={{ flex: 4 }}>
            <label className="form-label">Task Name</label>
            <input
              type="text"
              className={form.task_name === '' ? 'error-form-control' : 'text-input'}
              name="task_name"
              value={form.task_name}
              onChange={handleForm}
              maxLength="50"
            />
          </div>
          <div style={{ flex: 1 }} />
          <div
            className="selectbox"
            style={{ flex: 4 }}
          >
            <label className="form-label">Task Type</label>
            <select
              className={form.task_type === 0 ? 'error-form-control' : 'text-input'}
              placeholder="Please Select"
              name="task_type"
              style={{ color: '#222222' }}
              value={form.task_type}
              onChange={handleForm}
            >
              <option value="0">Select</option>
              {!singleTaskData?.task_type_details?.active && (
                <option
                  value={singleTaskData?.task_type_details?.id}
                  disabled
                >
                  {singleTaskData?.task_type_details?.custom_label}(archived)
                </option>
              )}
              {appliesToTypes.map((val) => (
                <option
                  key={val.id}
                  value={val.id}
                >
                  {val.custom_label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="addNewUserWrapad d-flex-row justify-space-around">
          <div className="selectbox flex-4">
            <label className="form-label">Task Timing</label>
            <select
              className={'text-input'}
              value={form.timing}
              onChange={handleForm}
              name="timing"
            >
              <option value={'Offset'}>Offset</option>
              <option value={'Sequential'}>After</option>
              <option value={'Strictly_Sequential'}>Strictly After</option>
              <option value={'Synchronous'}>At the same time as</option>
            </select>
          </div>
          <div className="flex-1" />
          <div className="flex-4 selectbox">
            {(form.timing === 'Sequential' || form.timing === 'Synchronous') && (
              <div>
                <label className="form-label">Reference</label>
                <select
                  className={
                    form.reference === null || form.reference === 0
                      ? 'error-form-control'
                      : 'text-input'
                  }
                  value={form.reference}
                  onChange={handleForm}
                  name="reference"
                >
                  <option value={0}>Select</option>
                  {(keep_data?.show ? filteredCard : cards)?.map((card) => (
                    <option
                      key={card.id}
                      value={card.id}
                    >
                      {card.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="addNewUserWrapad d-flex-row justify-space-around">
          <div style={{ flex: 4 }}>
            {form.timing === 'Offset' && (
              <div>
                <label className="form-label">Days offset from Project start</label>
                <input
                  type="number"
                  className={
                    form.offset === ''
                      ? 'error-form-control text-placeholder'
                      : 'text-input text-placeholder'
                  }
                  name="offset"
                  value={form.offset}
                  onChange={handleForm}
                />
              </div>
            )}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 4 }}>
            <label className="form-label">Task Duration in days</label>
            <input
              type="number"
              className={
                form.duration === ''
                  ? 'error-form-control text-placeholder'
                  : 'text-input text-placeholder'
              }
              placeholder="0"
              name="duration"
              value={form.duration}
              onChange={handleForm}
            />
          </div>
        </div>
        <div className="addNewUserWrapad dir-row justify-space-around">
          <div
            className="addNewUserWrapad"
            style={{ flex: 4 }}
          >
            <label className="form-label">Task Weight: {form.weight}</label>
            <input
              type="range"
              id="slider"
              style={{ padding: 0 }}
              min="0"
              max="10"
              step="1"
              value={form.weight}
              name="weight"
              onChange={handleForm}
            />
          </div>
          <div style={{ flex: 1 }} />
          <div
            className="selectbox"
            style={{ flex: 4 }}
          >
            {keep_data?.show && (
              <>
                <label className="form-label">Assign this task to</label>
                <select
                  className={'text-input'}
                  placeholder="Please Select"
                  name="seller"
                  style={{ color: '#222222' }}
                  value={form.seller}
                  onChange={handleForm}
                >
                  <option value={null}>Select</option>
                  <option value={0}>{`<Project Owner>`}</option>
                  {(sellers || [])?.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.first_name + ' ' + user.last_name}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
        <div className="addNewUserWrapad dir-row justify-space-around">
          <div style={{ flex: 4 }}>
            <label className="form-label">Description</label>
            <textarea
              type="text"
              className={
                form.description === ''
                  ? 'error-form-control text-placeholder'
                  : 'text-input-area text-placeholder'
              }
              name="description"
              rows={5}
              value={form.description}
              onChange={handleForm}
            />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 4 }}>
            <FormControlLabel
              label={<strong>Client visible</strong>}
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={handleChecked}
                />
              }
            />
            <FormControlLabel
              label={<strong>Notify on Creation</strong>}
              control={
                <Checkbox
                  checked={notify}
                  onChange={handleNotify}
                />
              }
            />
          </div>
        </div>
      </div>
      <DialogActions>
        <Button
          style={{ color: '#6385b7', fontSize: 16 }}
          onClick={handleClear}
          color="primary"
        >
          Cancel
        </Button>
        {singleTask?.data?.length > 0 && keep_data?.show ? (
          <AppButton
            contained
            buttonText={'Update & Keep Open'}
            onClick={() =>
              handleUpdate(
                form.task_type,
                form.weight,
                isChecked,
                tab,
                form.duration,
                notify,
                form.seller,
              )
            }
          />
        ) : (
          <AppButton
            contained
            buttonText={'Save & Keep Open'}
            onClick={() =>
              handleSaveTask(form.task_type, form.weight, isChecked, tab, form.duration, notify)
            }
          />
        )}
      </DialogActions>
      <OptionsModal
        open={showPrompt?.show}
        optionData={prompt_data}
        cardData={singleTaskData}
        task_type_name={taskTypeName}
        task_type={form.task_type}
        handleYes={handle}
      />
    </div>
  );
}

export default React.memo(AddTaskModal);
