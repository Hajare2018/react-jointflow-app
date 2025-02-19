import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { category, types } from '../types';
import { Button, Checkbox, DialogActions, Tooltip } from '@mui/material';
import { Check, InfoRounded } from '@mui/icons-material';
import { GithubPicker } from 'react-color';
import { colorsArray } from '../../Utils';
import { putDocumentsType, sendDocumentsType } from '../../../Redux/Actions/documents-type';
import { showErrorSnackbar } from '../../../Redux/Actions/snackbar';
import AppRadioGroup from '../../AppRadioGroup';
import { showTextCount } from '../../ProjectForm/TaskInfo';
import { reload } from '../../../Redux/Actions/reload-data';
import { useTenantContext } from '../../../context/TenantContext';
import { useUserContext } from '../../../context/UserContext';

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

function TaskTypeInfo({ forAdd, closeModal }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    custom_label: '',
    normalised_type: 0,
    category: 0,
    task_assign: 0,
    department: '',
    applies_to: 'Documents',
    task_weight: 10,
    duration: 1,
    rush_duration: 0,
  });
  const [isLegal, setIsLegal] = useState(false);
  const [showCharCount, setShowCharCount] = useState(false);
  const [tab, setTab] = useState(0);
  const [isClientVisible, setIsClientVisible] = useState(false);
  const [pickedColor, setPickedColor] = useState('#ffffff');
  const allUsers = useSelector((state) => state.allUsersData);
  const keep_data = useSelector((state) => state.keepThis);
  const sellers =
    allUsers?.data?.length > 0 ? allUsers?.data?.filter((item) => item.is_active === true) : [];
  const documentType = useSelector((state) => state.documentsTypeData);
  const documentTypeData = documentType?.data?.length > 0 ? documentType?.data?.[0] : [];

  const { departments_list } = useTenantContext();
  const { user } = useUserContext();
  const isAdmin = user.user_access_group?.some((role) => role.name === 'Admin');

  const handleFilters = (id) => {
    setTab(id);
  };

  useEffect(() => {
    dispatch(
      reload({
        active: true,
        normalised_label: form.normalised_type,
        custom_label: form.custom_label,
        applies_to: 'Both',
        color: pickedColor,
        is_legal: isLegal,
        weight: form.task_weight === '' ? 0 : form.task_weight,
        category: form.category,
        internal_assignee:
          form?.task_assign == 0 || form?.task_assign == 'owner' ? null : form?.task_assign,
        template_owner_assigned:
          form?.task_assign == 'owner' ? 'True' : form?.task_assign == 0 ? 'False' : 'False',
        client_visible: isClientVisible,
        department: form.department,
        duartion: form.duration,
        rush_duration: form.rush_duration,
        side: tab === 0 ? 'internal' : tab === 1 ? 'shared' : tab === 2 ? 'external' : '',
      }),
    );
  }, [form]);

  useEffect(() => {
    if (forAdd && !keep_data?.show) {
      setForm({
        custom_label: '',
        normalised_type: 0,
        category: 0,
        task_assign: 0,
        applies_to: 'Documents',
        task_weight: 10,
        department: '',
        duration: 1,
        rush_duration: 0,
      });
      setIsClientVisible(false);
      setIsLegal(false);
      setPickedColor('#ffffff');
      setTab(0);
    } else if (!forAdd || keep_data?.show) {
      setForm({
        custom_label: documentTypeData?.custom_label,
        normalised_type: documentTypeData?.normalised_label,
        category: documentTypeData?.category,
        task_assign:
          documentTypeData?.internal_assignee_details == null &&
          documentTypeData?.template_owner_assigned
            ? 'owner'
            : documentTypeData?.internal_assignee_details == null
              ? ''
              : documentTypeData?.internal_assignee_details?.id,
        applies_to: documentTypeData?.applies_to,
        task_weight: documentTypeData?.weight > 10 ? 10 : documentTypeData?.weight,
        department: documentTypeData?.department,
        duration: documentTypeData?.duration,
        rush_duration: documentTypeData?.rush_duration,
      });
      setIsClientVisible(documentTypeData?.client_visible);
      setIsLegal(documentTypeData?.is_legal);
      setPickedColor(documentTypeData?.color);
      setTab(
        documentTypeData?.side == 'internal'
          ? 0
          : documentTypeData?.side == 'shared'
            ? 1
            : documentTypeData?.side == 'external'
              ? 2
              : 0,
      );
    }
  }, [documentType]);

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    if (event.target.name === 'custom_label' && event.target.value !== '') {
      setShowCharCount(true);
    } else {
      setShowCharCount(false);
    }
  };
  const handleClientVisibility = (event) => {
    setIsClientVisible(event.target.checked);
  };
  const handleLegal = (event) => {
    setIsLegal(event.target.checked);
  };
  const handlePickedColor = (color) => {
    setPickedColor(color.hex);
  };
  const handleClear = () => {
    setForm({
      custom_label: '',
      normalised_type: 0,
      category: 0,
      task_assign: 0,
      applies_to: 'Both',
      task_weight: 10,
      duartion: 1,
    });
    setIsClientVisible(false);
    setIsLegal(false);
    setPickedColor('#ffffff');
    setTab(0);
    closeModal();
  };

  const handleSaveTaskType = () => {
    // dispatch(show(true));
    if (pickedColor === '') {
      dispatch(showErrorSnackbar('Please Pick a color for this type!'));
    } else if (forAdd && !keep_data?.show) {
      dispatch(
        sendDocumentsType({
          active: true,
          normalised_label: form.normalised_type,
          custom_label: form.custom_label,
          applies_to: 'Both',
          color: pickedColor,
          is_legal: isLegal,
          weight: form.task_weight === '' ? 0 : form.task_weight,
          category: form.category,
          internal_assignee:
            form?.task_assign == 0 || form?.task_assign == 'owner' ? null : form?.task_assign,
          template_owner_assigned:
            form?.task_assign == 'owner' ? 'True' : form?.task_assign == 0 ? 'False' : 'False',
          client_visible: isClientVisible,
          department: form.department,
          duration: form.duration,
          rush_duration: form.rush_duration,
          side: tab === 0 ? 'internal' : tab === 1 ? 'shared' : tab === 2 ? 'external' : '',
        }),
      );
    } else if (!forAdd || keep_data?.show) {
      dispatch(
        putDocumentsType({
          id: documentTypeData?.id,
          active: documentTypeData?.active,
          normalised_label: form.normalised_type,
          custom_label: form.custom_label,
          color: pickedColor,
          is_legal: form.isLegal,
          weight: form.task_weight === '' ? 0 : form.task_weight,
          category: form.category,
          internal_assignee:
            form?.task_assign == 0 || form?.task_assign == 'owner' ? null : form?.task_assign,
          template_owner_assigned:
            form?.task_assign == 'owner' ? 'True' : form?.task_assign == 0 ? 'False' : 'False',
          client_visible: isClientVisible,
          department: form.department,
          duration: form.duration,
          rush_duration: form.rush_duration,
          side: tab === 0 ? 'internal' : tab === 1 ? 'shared' : tab === 2 ? 'external' : '',
        }),
      );
    }
  };
  return (
    <div>
      <div className="editTypeModel d-flex-cloumn">
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
        <div className="d-flex justify-space-between">
          <div className="width-45">
            <label
              style={{
                color: form.custom_label === '' ? 'red' : '#999',
              }}
              className="form-label"
            >
              Custom Label
            </label>
            <input
              type="text"
              className="text-input"
              style={{
                color: '#222',
                borderColor: form.custom_label === '' ? 'red' : '#999',
              }}
              name="custom_label"
              maxLength={50}
              value={form.custom_label}
              onChange={handleForm}
            />
            {showTextCount(form.custom_label, showCharCount, 50)}
          </div>
          <div className={`selectbox width-45 ${showCharCount && 'mb-5'}`}>
            <label
              style={{
                color: form.normalised_type === 0 ? 'red' : '#999',
              }}
              className="form-label"
            >
              Normalised Type
            </label>
            <select
              className="text-input"
              style={{
                color: '#222',
                borderColor: form.normalised_type === 0 ? 'red' : '#999',
              }}
              name="normalised_type"
              value={form.normalised_type}
              onChange={handleForm}
            >
              <option value={'0'}>Select</option>
              {types.map((type) => (
                <option
                  key={type.name}
                  value={type.name}
                >
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex justify-space-between">
          <div className="selectbox width-45">
            <label
              style={{
                color: form.category === 0 ? 'red' : '#999',
              }}
              className="form-label"
            >
              Category
            </label>
            <select
              className="text-input"
              style={{
                color: '#222',
                borderColor: form.category === 0 ? 'red' : '#999',
              }}
              name="category"
              value={form.category}
              onChange={handleForm}
            >
              <option value={'0'}>Select</option>
              {category.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="width-45">
            <label className="form-label">Task Weight: {form.task_weight}</label>
            <input
              type="range"
              id="slider"
              style={{ padding: 0 }}
              min="0"
              max="10"
              step="1"
              value={form.task_weight > 10 ? 10 : form.task_weight}
              name="task_weight"
              onChange={handleForm}
            />
          </div>
        </div>
        <div className="d-flex justify-space-between">
          <div className="selectbox width-45">
            <label className="form-label">Default Task Assignment</label>
            <select
              className="text-input"
              style={{ color: '#222', borderColor: '#999' }}
              name="task_assign"
              value={form.task_assign}
              onChange={handleForm}
            >
              <option value={0}>Select</option>
              <option value={'owner'}>{`<Project Owner>`}</option>
              {(sellers || [])?.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.first_name + ' ' + user.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="selectbox width-45">
            <label className="form-label">Department</label>
            <select
              className="text-input"
              style={{ color: '#222', borderColor: '#999' }}
              name="department"
              value={form.department}
              onChange={handleForm}
            >
              <option value={''}>Select</option>
              {departments_list?.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex justify-space-between">
          <div className="width-45">
            <label className="form-label">Duration</label>
            <input
              type="number"
              className="text-input"
              style={{
                color: '#222',
                borderColor: '#999',
              }}
              name="duration"
              value={form.duration}
              onChange={handleForm}
            />
          </div>
          <div className="width-45">
            <label className="form-label">
              Rush Duration
              <Tooltip
                title="How long this task could talk should it be given the highest priority."
                placement="right"
                arrow
              >
                <InfoRounded className="ml-1" />
              </Tooltip>
            </label>
            <input
              type="number"
              className="text-input"
              style={{
                color: '#222',
                borderColor: '#999',
              }}
              name="rush_duration"
              value={form.rush_duration}
              onChange={handleForm}
            />
          </div>
        </div>
        <div className="d-flex justify-space-between">
          <div className="d-flex width-45">
            <div className="flex selectbox mr-5">
              <label className="form-label">Legal Type</label>
              <Checkbox
                checked={isLegal}
                onChange={handleLegal}
              />
            </div>
            <div className="flex selectbox">
              <label className="form-label">Client Visible</label>
              <Checkbox
                checked={isClientVisible}
                onChange={handleClientVisibility}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <div
          style={{
            backgroundColor: pickedColor ? pickedColor : '#ffffff',
            height: 30,
            width: 30,
            borderRadius: 5,
            textAlign: 'center',
          }}
        >
          <Check style={{ color: '#ffffff', height: 30, width: 30 }} />
        </div>
        <div className="mt-3">
          <GithubPicker
            color={pickedColor ? pickedColor : '#ffffff'}
            width={'100%'}
            triangle={'hide'}
            colors={colorsArray}
            onChangeComplete={handlePickedColor}
            onChange={handlePickedColor}
          />
        </div>
      </div>
      <DialogActions>
        <Button
          onClick={handleClear}
          style={{ color: '#627daf' }}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: '#627daf', color: '#ffffff' }}
          variant="contained"
          onClick={handleSaveTaskType}
        >
          {forAdd && !keep_data?.show ? 'Save' : 'Update'}
        </Button>
      </DialogActions>
    </div>
  );
}

export default React.memo(TaskTypeInfo);
