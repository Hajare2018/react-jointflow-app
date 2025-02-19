import { Grid, IconButton, Badge, CircularProgress, Tooltip } from '@mui/material';
import {
  Check,
  CheckCircleOutline,
  InsertLinkOutlined,
  SearchOutlined,
  Telegram,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import attachFile from '../../assets/icons/Attached.png';
import assigneePic from '../../assets/icons/assignees.png';
import AppButton from './Components/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import postTaskData from '../../Redux/Actions/task-info';
import editTaskData from '../../Redux/Actions/update-task-info';
import ConfirmDialog from './Components/ConfirmDialog';
import { handleTabsChange } from '../../Redux/Actions/tab-values';
import Assignees from './Assignees';
import { getDuration, truncateString } from '../Utils';
import { show, showPrompt } from '../../Redux/Actions/loader';
import Loader from '../Loader';
import postNudgeData from '../../Redux/Actions/nudge-mail';
import AssigneesAvatar from './AssigneesAvatar';
import { getAllUsers, requestMaapLink } from '../../Redux/Actions/user-info';
import ReactDatePicker from 'react-datepicker';
import DealPoliceStuffs from './Components/DealPoliceStuffs';
import { showErrorSnackbar } from '../../Redux/Actions/snackbar';
import AppRadioGroup from '../AppRadioGroup';
import { requestSingleType } from '../../Redux/Actions/documents-type';
import MaapLinkModal from './MaapLinkModal';
import { FaUserSlash } from 'react-icons/fa';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import { convertFromHTML, convertToHTML } from '../RichTextEditor/converters';
import { EditorState } from 'draft-js';
import TaskTypeSearch from './TaskTypeSearch';

import 'react-datepicker/dist/react-datepicker.css';
import './TaskInfo.css';
import { useUserContext } from '../../context/UserContext';
import { useTenantContext } from '../../context/TenantContext';

function addBusinessDays(date, days) {
  const newDate = new Date(date.getTime());

  while (days > 0) {
    newDate.setDate(newDate.getDate() + 1);

    if (newDate.getDay() !== 0 && newDate.getDay() !== 6) {
      days -= 1;
    }
  }

  return newDate;
}

export const showTextCount = (taskName, show, char) => {
  return (
    show && (
      <p style={{ color: '#999999', float: 'right' }}>
        {taskName?.length}/{char} characters
      </p>
    )
  );
};

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

function TaskInfo({ formData, toClose, forAdd, isClone }) {
  const dispatch = useDispatch();
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState(0);
  const [taskTypeSearch, setTaskTypeSearch] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const extendedDate = new Date(startDate)?.setDate(new Date(startDate)?.getDate() + 7);
  const [endDate, setEndDate] = useState(new Date(extendedDate));
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [assigneeType, setAssigneeType] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [history, setHistory] = useState(false);
  const [dealPolice, setDealPolice] = useState(false);
  const [showCharCount, setShowCharCount] = useState(false);
  const [timing, setTiming] = useState('Offset');
  const [reference, setReference] = useState(0);
  const [tab, setTab] = useState(0);
  const [internalAssignee, setInternalAssignee] = useState(null);
  const [confirmation, setConfirmation] = useState(false);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const prompt = useSelector((state) => state.promptData);
  const doc_type = useSelector((state) => state.documentsTypeData);
  const singleTask = useSelector((state) => state.singleCardData);
  const loader = useSelector((state) => state.showLoader);
  const taskTypeData = useSelector((state) => state.documentsType);
  const projectData = useSelector((state) => state.singleProjectData);
  const cards_data = projectData?.data?.[0]?.cards;
  cards_data?.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  const { enable_maap_link, activate_deal_police } = useTenantContext();
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data[0] : [];
  const filteredCards = (cards_data || []).filter((card) => card.id !== singleTaskData?.id);
  const { user: parsedData } = useUserContext();
  const hasAdminRole = parsedData?.user_access_group?.some((role) => role.name === 'Admin');

  const handleTaskTiming = (event) => {
    setTiming(event.target.value);
  };

  const handleTaskReference = (event) => {
    setReference(event.target.value);
  };

  const handleTasks = (event) => {
    setShowCharCount(true);
    setTaskName(event.target.value);
  };

  const handleCopyLink = () => {
    setShowModal(true);
    dispatch(requestMaapLink({ card: singleTaskData?.id, user: parsedData.id }));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFilters = (id) => {
    setTab(id);
    setTimeout(() => {
      if (!forAdd) {
        handleUpdate(id);
      } else {
        return;
      }
    }, 2000);
  };

  const showTaskTypes = () => {
    setTaskTypeSearch(!taskTypeSearch);
  };

  useEffect(() => {
    if (forAdd) {
      setTaskName('');
      setTaskType(0);
      setStartDate(new Date());
      setEndDate(new Date(extendedDate));
      setDescription('');
      handleSetDescription('');
      setReference(null);
      setTiming('Offset');
      setDuration('');
      setTab(0);
      setInternalAssignee(null);
    } else {
      setTaskName(singleTaskData?.title);
      setTaskType(singleTaskData?.task_type_details?.id);
      setStartDate(new Date(singleTaskData?.start_date));
      setEndDate(new Date(singleTaskData?.end_date));
      setDescription(singleTaskData?.description);
      handleSetDescription(singleTaskData?.description);
      setTiming(singleTaskData?.task_timing);
      setReference(singleTaskData?.timing_ref_task === null ? 0 : singleTaskData?.timing_ref_task);
      setDuration(singleTaskData?.duration);
      setTab(
        singleTaskData?.side === 'internal'
          ? 0
          : singleTaskData?.side === 'shared'
            ? 1
            : singleTaskData?.side === 'external'
              ? 2
              : 0,
      );
      setInternalAssignee(singleTaskData?.internal_assignee_details);
    }
  }, [singleTask]);

  useEffect(() => {}, [
    extendedDate,
    forAdd,
    formData,
    taskName,
    taskType,
    startDate,
    endDate,
    description,
    timing,
    reference,
    duration,
  ]);
  useEffect(() => {}, [tab]);

  const handleShowUsers = (e) => {
    if (e?.history) {
      setHistory(true);
    } else {
      setHistory(false);
    }
    if (e?.internal) {
      dispatch(getAllUsers({ onlyStaff: true }));
    } else if (e?.external) {
      dispatch(
        getAllUsers({
          company_id: singleTaskData?.buyer_company_details?.id,
          usersByCompany: true,
        }),
      );
    }
    if (e?.dealPolice) {
      setDealPolice(true);
    } else {
      setDealPolice(false);
    }
    setAssigneeType(e);
    setShowUsers(!showUsers);
  };

  const handleStartDate = (date) => {
    let selected = new Date(date).setDate(new Date(date).getDate());
    setStartDate(new Date(selected));
    if (!forAdd && !isClone) {
      return dispatch(
        editTaskData({
          id: singleTaskData?.id,
          start_date: new Date(selected).toJSON().slice(0, 10).replace(/-/g, '-'),
          board: singleTaskData?.board,
          last_update_type: truncateString(
            `Start Date changed ${getDuration(
              new Date(date).toJSON().slice(0, 10).replace(/-/g, '-'),
              singleTaskData?.start_date,
            )}days`,
          ),
          fetchAll: formData?.from_widget,
          fetchByType: formData?.byType,
          task_timing: timing,
          timing_ref_task: reference == 0 ? null : parseInt(reference),
          type: formData?.byType && singleTaskData?.task_type_details?.custom_label,
          filteredTasks: {
            allCards: formData?.my_task?.allCards,
            completed: formData?.my_task?.completed,
            upcoming: formData?.my_task?.upcoming,
          },
          legalTasks: {
            isLegal: formData?.is_legal?.isLegal,
            isLegal__completed: formData?.is_legal?.isLegal?.isLegal__completed,
            isLegal__upcoming: formData?.is_legal?.isLegal?.isLegal__upcoming,
          },
          task_info: true,
          userId: parsedData.id,
        }),
      );
    }
  };

  const handleEndDate = (date) => {
    let selected = new Date(date).setDate(new Date(date).getDate());
    setEndDate(new Date(selected));
    if (new Date(selected) >= new Date(singleTaskData?.start_date) && !forAdd && !isClone) {
      return dispatch(
        editTaskData({
          id: singleTaskData?.id,
          end_date: new Date(selected).toJSON().slice(0, 10).replace(/-/g, '-'),
          board: singleTaskData?.board,
          last_update_type: truncateString(
            `End Date changed ${getDuration(
              new Date(date).toJSON().slice(0, 10).replace(/-/g, '-'),
              singleTaskData?.end_date,
            )}days`,
          ),
          fetchAll: formData?.from_widget,
          fetchByType: formData?.byType,
          task_timing: timing,
          timing_ref_task: reference == 0 ? null : parseInt(reference),
          type: formData?.byType && singleTaskData?.task_type_details?.custom_label,
          filteredTasks: {
            allCards: formData?.my_task?.allCards,
            completed: formData?.my_task?.completed,
            upcoming: formData?.my_task?.upcoming,
          },
          legalTasks: {
            isLegal: formData?.is_legal?.isLegal,
            isLegal__completed: formData?.is_legal?.isLegal?.isLegal__completed,
            isLegal__upcoming: formData?.is_legal?.isLegal?.isLegal__upcoming,
          },
          task_info: true,
          userId: parsedData.id,
        }),
      );
    }
  };

  const onEditorStateChange = (state) => {
    setEditorState(state);
    const htmlData = convertToHTML(state.getCurrentContent());
    setDescription(htmlData);
  };

  const handleSetDescription = (item) => {
    if (item == undefined || item == '') {
      return;
    } else {
      const contentState = convertFromHTML(item);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  };

  const handleDuration = (event) => {
    setDuration(event.target.value);
  };

  const taskTypes = taskTypeData.data.length > 0 ? taskTypeData.data : [];
  const activeTypes = taskTypes?.filter((item) => item.active === true);
  const appliestoTasks = (activeTypes || [])?.filter(
    (item) => item.applies_to === 'Tasks' || item.applies_to === 'Both',
  );

  const groupedByDepartment = appliestoTasks.reduce((acc, item) => {
    const dept = item.department || 'No Department';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(item);
    return acc;
  }, {});
  for (const key of Object.keys(groupedByDepartment)) {
    groupedByDepartment[key].sort((a, b) => a.custom_label.localeCompare(b.custom_label));
  }

  const handleTaskType = (event) => {
    setTaskType(event.target.value);
    dispatch(
      requestSingleType({
        id: event.target.value,
        showPrompt: true,
      }),
    );
  };

  const handleTypeClick = (type) => {
    setTaskType(type.id);
    dispatch(
      requestSingleType({
        id: type.id,
        showPrompt: true,
      }),
    );
    setTaskTypeSearch(false);
  };

  const handleSave = () => {
    if (taskName === '') {
      dispatch(showErrorSnackbar('Task Name is Required!'));
      return;
    } else if (taskType === 0) {
      dispatch(showErrorSnackbar('Task Type is Required!'));
      return;
    } else if ((reference === 0 || reference === null) && timing !== 'Offset') {
      dispatch(showErrorSnackbar('Reference Task is Required!'));
      return;
    } else if (duration === '' && timing !== 'Offset') {
      dispatch(showErrorSnackbar('Duration is Required!'));
      return;
    } else {
      const requestBody = {
        title: taskName,
        start_date: new Date(startDate)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
        end_date: new Date(endDate)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
        description: description,
        board: isClone ? singleTaskData?.board : formData?.data,
        owner: parsedData.id,
        is_completed: 'False',
        task_type: parseInt(taskType),
        for_legal: formData?.is_legal,
        task_timing: timing,
        timing_ref_task: reference == 0 ? null : parseInt(reference),
        duration: duration === '' ? 0 : duration,
        side: tab === 0 ? 'internal' : tab === 1 ? 'shared' : tab === 2 ? 'external' : '',
        reload: true,
        task_info: true,
      };
      dispatch(postTaskData(requestBody));
    }
  };

  const handleUpdate = (tab) => {
    let taskTypeName = [];
    if (taskType) {
      taskTypeName = taskTypes?.filter((item) => item.id === parseInt(taskType));
    }
    if (taskName === '') {
      return;
    } else if (taskType === 0) {
      return;
    } else if ((reference === 0 || reference === null) && timing !== 'Offset') {
      return;
    } else if (duration === '' && timing !== 'Offset') {
      return;
    } else {
      dispatch(
        editTaskData({
          id: singleTaskData?.id,
          title: taskName,
          start_date: new Date(startDate)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
          end_date: new Date(endDate)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
          description: description,
          board: singleTaskData?.board,
          is_completed: singleTaskData?.is_completed,
          task_type: taskType,
          task_timing: timing,
          timing_ref_task: reference === 0 ? null : parseInt(reference),
          internal_assignee: internalAssignee?.id,
          duration: duration === '' ? 0 : duration,
          side: tab === 0 ? 'internal' : tab === 1 ? 'shared' : tab === 2 ? 'external' : '',
          last_update_type:
            singleTaskData?.title !== taskName
              ? truncateString(`task_name changed from ${singleTaskData?.title} to ${taskName}`)
              : singleTaskData?.task_type_details?.id !== parseInt(taskType)
                ? truncateString(
                    `task_type changed from ${singleTaskData?.task_type_details?.custom_label} to ${taskTypeName?.[0]?.custom_label}`,
                  )
                : singleTaskData?.description !== description
                  ? truncateString(
                      `description changed from ${singleTaskData?.description} to ${description}`,
                    )
                  : null,
          fetchAll: formData?.from_widget,
          fetchByType: formData?.byType,
          type: formData?.byType && singleTaskData?.task_type_details?.custom_label,
          filteredTasks: {
            allCards: formData?.my_task?.allCards,
            completed: formData?.my_task?.completed,
            upcoming: formData?.my_task?.upcoming,
          },
          legalTasks: {
            isLegal: formData?.is_legal?.isLegal,
            isLegal__completed: formData?.is_legal?.isLegal?.isLegal__completed,
            isLegal__upcoming: formData?.is_legal?.isLegal?.isLegal__upcoming,
          },
          task_info: true,
          userId: parsedData.id,
        }),
      );
    }
  };

  const handleCompleted = () => {
    if (taskName === '') {
      return;
    } else if (taskType === 0) {
      return;
    } else if ((reference === 0 || reference === null) && timing !== 'Offset') {
      return;
    } else if (duration === '' && timing !== 'Offset') {
      return;
    } else {
      dispatch(
        editTaskData({
          id: singleTaskData?.id,
          title: taskName,
          start_date: new Date(startDate)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
          end_date: new Date(endDate)?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
          description: description,
          board: singleTaskData?.board,
          is_completed: singleTaskData?.is_completed ? false : true,
          actual_completion_date: singleTaskData?.is_completed
            ? null
            : new Date()?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
          task_type: taskType,
          task_timing: timing,
          timing_ref_task: reference === 0 ? null : parseInt(reference),
          duration: duration === '' ? 0 : duration,
          side: tab === 0 ? 'internal' : tab === 1 ? 'shared' : tab === 2 ? 'external' : '',
          last_update_type: singleTaskData?.is_completed ? 'Task re-opened' : 'Task Approved',
          fetchAll: formData?.from_widget,
          fetchByType: formData?.byType,
          type: formData?.byType && singleTaskData?.task_type_details?.custom_label,
          filteredTasks: {
            allCards: formData?.my_task?.allCards,
            completed: formData?.my_task?.completed,
            upcoming: formData?.my_task?.upcoming,
          },
          legalTasks: {
            isLegal: formData?.is_legal?.isLegal,
            isLegal__completed: formData?.is_legal?.isLegal?.isLegal__completed,
            isLegal__upcoming: formData?.is_legal?.isLegal?.isLegal__upcoming,
          },
          task_info: true,
          userId: parsedData.id,
        }),
      );
    }
  };

  const handleAlert = () => {
    if (taskName !== singleTaskData?.title || description !== singleTaskData?.description) {
      setShowAlert(!showAlert);
    } else {
      setTaskName('');
      setTaskType(0);
      setStartDate(new Date());
      setEndDate(new Date(extendedDate));
      setDescription('');
      toClose();
      setTab(0);
    }
  };

  const handleCloseAlert = (e) => {
    setShowAlert(!showAlert);
    if (e.close) {
      setTaskName('');
      setTaskType(0);
      setStartDate(new Date());
      setEndDate(new Date(extendedDate));
      setDescription('');
      toClose();
      setTab(0);
    }
  };

  const handleClosePrompt = (e) => {
    if (e.close) {
      dispatch(showPrompt(false));
      const filteredTab = appliestoTasks?.filter((type) => type.id == taskType);
      setDuration(filteredTab?.[0]?.duration);
      setInternalAssignee(filteredTab?.[0]?.internal_assignee_details);
      let selected = addBusinessDays(
        new Date(singleTaskData?.start_date),
        doc_type.data[0].duration,
      );
      if (isNaN(selected)) {
        setEndDate(new Date());
      } else {
        setEndDate(new Date(selected));
      }
      setTab(
        filteredTab?.[0]?.side === 'internal'
          ? 0
          : filteredTab?.[0]?.side === 'shared'
            ? 1
            : filteredTab?.[0]?.side === 'external'
              ? 2
              : 0,
      );
      setTimeout(() => {
        if (forAdd || formData.clone) {
          const start_date = new Date();
          const end_date = addBusinessDays(start_date, doc_type.data[0].duration);
          const requestBody = {
            title: taskName,
            description: description,
            board: formData?.data,
            is_completed: 'False',
            task_type: parseInt(taskType),
            for_legal: formData?.is_legal,
            task_timing: timing,
            timing_ref_task: reference == 0 ? null : parseInt(reference),
            duration: doc_type.data[0].duration,
            side: doc_type.data[0].side,
            reload: true,
            task_info: true,
            populateFromType: true,
            start_date: start_date.toISOString().split('T')[0],
            end_date: end_date.toISOString().split('T')[0],
          };
          dispatch(postTaskData(requestBody));
        } else {
          dispatch(
            editTaskData({
              id: singleTaskData?.id,
              board: singleTaskData?.board,
              is_completed: singleTaskData?.is_completed,
              task_type: parseInt(taskType),
              duration: filteredTab?.[0]?.duration,
              side: filteredTab?.[0]?.side,
              fetchAll: formData?.from_widget,
              fetchByType: formData?.byType,
              type: formData?.byType && singleTaskData?.task_type_details?.custom_label,
              filteredTasks: {
                allCards: formData?.my_task?.allCards,
                completed: formData?.my_task?.completed,
                upcoming: formData?.my_task?.upcoming,
              },
              legalTasks: {
                isLegal: formData?.is_legal?.isLegal,
                isLegal__completed: formData?.is_legal?.isLegal?.isLegal__completed,
                isLegal__upcoming: formData?.is_legal?.isLegal?.isLegal__upcoming,
              },
              task_info: true,
              populateFromType: true,
              userId: parsedData.id,
            }),
          );
        }
      }, 2000);
    } else {
      dispatch(showPrompt(false));
      return;
    }
  };

  const handleShowConfirmation = (type) => {
    setAssigneeType(type);
    setConfirmation(true);
  };

  const handleCloseConfirmation = (e) => {
    if (e.close) {
      dispatch(show(true));
      if (assigneeType.internal) {
        dispatch(
          editTaskData({
            id: singleTaskData?.id,
            board: singleTaskData?.board,
            internal_assignee: null,
            fetchAll: formData?.from_widget,
            fetchByType: formData?.byType,
            type: formData?.byType && singleTaskData?.task_type_details?.custom_label,
            filteredTasks: {
              allCards: formData?.my_task?.allCards,
              completed: formData?.my_task?.completed,
              upcoming: formData?.my_task?.upcoming,
            },
            legalTasks: {
              isLegal: formData?.is_legal?.isLegal,
              isLegal__completed: formData?.is_legal?.isLegal?.isLegal__completed,
              isLegal__upcoming: formData?.is_legal?.isLegal?.isLegal__upcoming,
            },
            task_info: true,
            userId: parsedData.id,
          }),
        );
      } else {
        dispatch(
          editTaskData({
            id: singleTaskData?.id,
            board: singleTaskData?.board,
            external_assignee: null,
            fetchAll: formData?.from_widget,
            fetchByType: formData?.byType,
            type: formData?.byType && singleTaskData?.task_type_details?.custom_label,
            filteredTasks: {
              allCards: formData?.my_task?.allCards,
              completed: formData?.my_task?.completed,
              upcoming: formData?.my_task?.upcoming,
            },
            legalTasks: {
              isLegal: formData?.is_legal?.isLegal,
              isLegal__completed: formData?.is_legal?.isLegal?.isLegal__completed,
              isLegal__upcoming: formData?.is_legal?.isLegal?.isLegal__upcoming,
            },
            task_info: true,
            userId: parsedData.id,
          }),
        );
      }
      if (!loader.show) {
        setAssigneeType({});
        setConfirmation(false);
      }
    } else {
      setAssigneeType({});
      setConfirmation(false);
    }
  };

  const openDocument = () => {
    dispatch(handleTabsChange(1));
  };

  const handleNudge = (assignee_type) => {
    dispatch(show(true));
    const internal_requestBody = {
      card_id: singleTaskData?.id,
      user_id: singleTaskData?.internal_assignee_details?.id,
      email_template: 'nudge_email_internal',
    };
    const external_requestBody = {
      card_id: singleTaskData?.id,
      user_id: singleTaskData?.external_assignee_details?.id,
      email_template: 'nudge_email',
    };
    dispatch(
      postNudgeData({
        data: assignee_type?.internal ? internal_requestBody : external_requestBody,
      }),
    );
  };

  const path = window.location.href;
  const isUrlIncludesTasks = path.includes('tasks');
  let isDisabled = false;
  if (timing === 'Strictly_Sequential' || singleTaskData?.task_timing === 'Strictly_Sequential') {
    if (!singleTaskData?.ref_task_is_completed) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
  }

  return (
    <div
      className="taskWrap"
      style={{ height: 'calc(100vh - 167px)', overflowY: 'auto' }}
    >
      {loader.show ? (
        <Loader />
      ) : (
        <>
          <div className="inner-div">
            <div className="flex justify-center">
              <AppRadioGroup
                filters={toggles}
                getFilters={handleFilters}
                tabId={tab}
                isAdmin={hasAdminRole}
                startIcon
              />
            </div>
            <Grid
              container
              direction="row"
            >
              <Grid
                item
                direction="column"
                xs={6}
              >
                <div className="mb-3 pr-3">
                  <label
                    className="form-label"
                    style={{
                      color: taskName === '' ? 'red' : '#999',
                    }}
                  >
                    Task Name
                  </label>
                  <input
                    type="text"
                    className="form-control-input task-name"
                    onBlur={() => {
                      setShowCharCount(false);
                      if (singleTaskData?.title !== taskName && !forAdd && !isClone) {
                        return handleUpdate(tab);
                      } else {
                        return;
                      }
                    }}
                    style={{
                      color: singleTaskData?.is_completed && '#999',
                      border: taskName === '' ? '2px red solid' : '2px #999 solid',
                    }}
                    disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                    value={taskName}
                    placeholder={!forAdd ? 'Loading...' : 'Enter Task Name'}
                    onChange={handleTasks}
                    maxLength="50"
                  />
                  {showTextCount(taskName, showCharCount, 50)}
                </div>
                <div className="mb-3 pr-3">
                  <div className="selectbox">
                    <label className="form-label">Task Timing</label>
                    <select
                      disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                      className="form-select task-timing"
                      value={timing}
                      onChange={handleTaskTiming}
                      style={{
                        color:
                          singleTaskData?.is_completed && !forAdd && !isClone ? '#999' : '#000',
                      }}
                      onBlur={() => {
                        if (singleTaskData?.timing_ref_task !== null && !forAdd && !isClone) {
                          return handleUpdate(tab);
                        } else {
                          return;
                        }
                      }}
                    >
                      <option value={'Offset'}>Date</option>
                      <option value={'Sequential'}>After</option>
                      <option value={'Strictly_Sequential'}>Strictly After</option>
                      <option value={'Synchronous'}>At the same time as</option>
                    </select>
                  </div>
                </div>
                {timing === 'Offset' && (
                  <div className="mb-3 pr-3">
                    <label className="form-label">Start Date</label>
                    <ReactDatePicker
                      className={
                        singleTaskData?.is_completed
                          ? 'form-control-disabled w-full'
                          : 'form-control-input w-full'
                      }
                      // locale="en-GB"
                      dateFormat="dd-MM-yyyy"
                      popperPlacement="right"
                      required
                      selected={startDate}
                      disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                      onChange={(date) => {
                        handleStartDate(date);
                      }}
                      selectsEnd
                    />
                  </div>
                )}
              </Grid>
              <Grid
                item
                direction="column"
                style={{ justifyContent: 'center', alignItems: 'center' }}
                xs={6}
              >
                <div className="d-flex mb-3 pl-3">
                  <div
                    className="selectbox"
                    style={{ width: '95%' }}
                  >
                    <label
                      className="form-label"
                      style={{
                        color: taskType === 0 ? 'red' : '',
                      }}
                    >
                      Task Type
                    </label>
                    <select
                      disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                      style={{
                        color:
                          singleTaskData?.is_completed && !forAdd && !isClone ? '#999' : '#000000',
                        borderColor: taskType === 0 ? 'red' : '',
                      }}
                      className="form-select task-type"
                      value={taskType}
                      onChange={handleTaskType}
                    >
                      <option
                        value="none"
                        disabled
                        aria-disabled
                      >
                        Task Type
                      </option>
                      {Object.keys(groupedByDepartment).map((department) => (
                        <optgroup
                          key={department}
                          label={department}
                        >
                          {groupedByDepartment[department].map((name) => (
                            <option
                              key={name.id}
                              value={name.id}
                            >
                              {name.custom_label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="relative top-[18px]">
                    <Tooltip title="Search for a task type">
                      <button onClick={showTaskTypes}>
                        <SearchOutlined />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="mb-3 pl-3">
                  {timing === 'Sequential' ||
                  timing === 'Synchronous' ||
                  timing === 'Strictly_Sequential' ? (
                    <div className="selectbox">
                      <label
                        style={{
                          color: reference == null || reference == 0 ? 'red' : '#999',
                        }}
                        className="form-label"
                      >
                        Reference
                      </label>
                      <select
                        disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                        className="form-select task-reference"
                        value={reference}
                        onChange={handleTaskReference}
                        style={{
                          border:
                            reference == null || reference == 0
                              ? '2px red solid'
                              : '2px #999 solid',
                        }}
                        onBlur={() => {
                          if (timing !== 'Offset' && !forAdd && !isClone) {
                            return handleUpdate(tab);
                          } else {
                            return;
                          }
                        }}
                      >
                        <option value={0}>Select</option>
                        {(forAdd
                          ? cards_data
                          : formData?.show_board
                            ? singleTaskData?.card_list
                            : filteredCards
                        )?.map((card) => (
                          <option
                            key={card.id}
                            value={card.id}
                          >
                            {card.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="h-16" />
                  )}
                </div>
                {timing === 'Offset' && (
                  <div className="mb-3 pl-3">
                    <label className="form-label">End Date</label>
                    <ReactDatePicker
                      className={
                        singleTaskData?.is_completed
                          ? 'form-control-disabled'
                          : 'form-control-input'
                      }
                      minDate={startDate}
                      // locale="en-GB"
                      dateFormat="dd-MM-yyyy"
                      popperPlacement="right"
                      required
                      selected={endDate}
                      disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                      onChange={(date) => {
                        handleEndDate(date);
                      }}
                      selectsEnd
                      startDate={startDate}
                    />
                  </div>
                )}
                {timing !== 'Offset' && (
                  <div className="mb-3 ml-3">
                    <label
                      className="form-label"
                      style={{
                        color: duration == '' ? 'red' : '#999',
                      }}
                    >
                      Duration (Working days)
                    </label>
                    <input
                      type="number"
                      className="form-control-input task-duration"
                      onBlur={() => {
                        if (singleTaskData?.duration !== duration && !forAdd && !isClone) {
                          return handleUpdate(tab);
                        } else {
                          return;
                        }
                      }}
                      style={{
                        color: singleTaskData?.is_completed && '#999',
                        border: duration === '' ? '2px red solid' : '2px #999 solid',
                      }}
                      disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                      value={duration}
                      placeholder={'Duration'}
                      onChange={handleDuration}
                    />
                  </div>
                )}
              </Grid>
              <Grid
                item
                xs={12}
              >
                <div>
                  <label className="form-label">Description</label>
                  <div className="editorContainer">
                    <div className="board-editor">
                      <RichTextEditor
                        editorState={editorState}
                        placeholder="Type your comment here..."
                        editorStyle={{
                          height: 120,
                          overflowY: 'auto',
                          marginLeft: 5,
                        }}
                        onEditorStateChange={onEditorStateChange}
                        onBlur={() => {
                          if (singleTaskData?.description !== description && !forAdd && !isClone) {
                            return handleUpdate(tab);
                          } else {
                            return;
                          }
                        }}
                        spellCheck
                        disabled={singleTaskData?.is_completed && !forAdd && !isClone}
                        toolbar={{
                          options: ['inline', 'link', 'emoji'],
                          inline: {
                            inDropdown: false,
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['bold', 'italic', 'underline', 'strikethrough'],
                            italic: { className: undefined },
                            underline: { className: undefined },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
            >
              {(!forAdd || !isClone) && (
                <>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    direction="row"
                  >
                    <div className="flex">
                      <IconButton onClick={openDocument}>
                        <Badge
                          badgeContent={singleTaskData?.attachments?.length}
                          style={{ fontSize: 18 }}
                          color={'secondary'}
                        >
                          <img
                            src={attachFile}
                            className="h-[25px] w-[25px]"
                          />
                        </Badge>
                      </IconButton>
                      <span className="font18 last-doc">
                        <strong>Last Document: </strong>
                      </span>
                      {singleTaskData?.attachments?.length > 0 ? (
                        <span
                          style={{ fontSize: 14, wordBreak: 'break-word' }}
                          className="textGray"
                        >
                          {singleTaskData?.attachments[0] == undefined
                            ? 'N/A'
                            : singleTaskData?.attachments[0]?.name}
                        </span>
                      ) : (
                        <span className="textGray text-md">No document attached yet!</span>
                      )}
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
            {(!forAdd || isClone) && (
              <div style={{ minHeight: 260 }}>
                <Grid
                  className="mt-3"
                  container
                  direction="row"
                >
                  <Grid
                    item
                    direction="column"
                    xs={12}
                    sm={12}
                    md={4}
                  >
                    <div className="style-assignee">
                      <h3 className="font18 mb-2">
                        <strong>Owner</strong>
                      </h3>
                      <div className="TeamAvatarWrap">
                        <div className={'avatar-wrap'}>
                          <AssigneesAvatar
                            src={singleTaskData?.owner_details}
                            owner={true}
                          />
                        </div>
                        <h4 className="font14 mb-3 mt-4">
                          {/* TODO FIXME these seems incorrect */}
                          {typeof singleTaskData?.owner_details?.first_name === 'undefined' ||
                          typeof singleTaskData?.owner_details?.first_name === 'undefined' ? (
                            ''
                          ) : (
                            <strong>
                              {singleTaskData?.owner_details?.first_name +
                                ' ' +
                                singleTaskData?.owner_details?.last_name}
                            </strong>
                          )}
                        </h4>
                      </div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    direction="column"
                    xs={12}
                    sm={12}
                    md={4}
                  >
                    <div className="style-assignee">
                      <h3 className="font18 mb-2">
                        <strong>Internal Resource</strong>
                      </h3>
                      <div className="TeamAvatarWrap">
                        <div className="avatar-wrap">
                          <AssigneesAvatar
                            seller={true}
                            src={internalAssignee}
                            onPage={isUrlIncludesTasks}
                          />
                          {singleTaskData?.internal_assignee_details !== null && (
                            <Tooltip
                              title="Unassign this user"
                              placement="top"
                            >
                              <button
                                onClick={() => handleShowConfirmation({ internal: true })}
                                className="unassign-icon"
                              >
                                <FaUserSlash />
                              </button>
                            </Tooltip>
                          )}
                          <img
                            className={'assignee-img-page'}
                            onClick={() => handleShowUsers({ internal: true, history: true })}
                            src={assigneePic}
                          />
                        </div>
                        <h4 className="font14 mb-3 mt-4">
                          <strong>
                            {internalAssignee === null
                              ? 'Unassigned'
                              : internalAssignee?.first_name + ' ' + internalAssignee?.last_name}
                          </strong>
                        </h4>
                      </div>
                      {!singleTaskData?.is_completed && (
                        <div className={'button-wrapper'}>
                          <AppButton
                            onClick={() =>
                              handleShowUsers({
                                internal: true,
                                history: false,
                              })
                            }
                            outlined
                            className="internal-assign"
                            buttonText={internalAssignee === null ? 'Assign' : 'Reassign'}
                          />
                          {internalAssignee !== null && (
                            <div className="ml-2">
                              <AppButton
                                onClick={() => handleNudge({ internal: true })}
                                outlined
                                buttonIcon={<Telegram />}
                                buttonText={'Nudge'}
                                className={'internal-nudge'}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid
                    item
                    direction="column"
                    xs={12}
                    sm={12}
                    md={4}
                  >
                    <div className="style-assignee">
                      <h3 className="font18 mb-2">
                        <strong className="mr-1">External Contact</strong>
                      </h3>
                      <div className="TeamAvatarWrap">
                        <div className={'avatar-wrap'}>
                          <AssigneesAvatar
                            company={singleTaskData?.buyer_company_details}
                            src={singleTaskData?.external_assignee_details}
                            seller={false}
                          />
                          {enable_maap_link &&
                            singleTaskData?.external_assignee_details !== null && (
                              <Tooltip
                                title="Copy MAAP Link"
                                placement="top"
                              >
                                <button
                                  onClick={handleCopyLink}
                                  className="link-icon"
                                >
                                  <InsertLinkOutlined />
                                </button>
                              </Tooltip>
                            )}
                          {singleTaskData?.external_assignee_details !== null && (
                            <Tooltip
                              title="Unassign this user"
                              placement="top"
                            >
                              <button
                                onClick={() => handleShowConfirmation({ external: true })}
                                className="unassign-icon"
                              >
                                <FaUserSlash
                                  width={35}
                                  height={35}
                                />
                              </button>
                            </Tooltip>
                          )}
                          <img
                            className="assignee-img-page"
                            onClick={() =>
                              handleShowUsers({
                                external: true,
                                history: true,
                                dealPolice: false,
                              })
                            }
                            src={assigneePic}
                          />
                        </div>
                        <h4 className="font14 mb-3 mt-4">
                          <strong>
                            {singleTaskData?.external_assignee_details === null
                              ? 'Unassigned'
                              : singleTaskData?.external_assignee_details?.first_name +
                                ' ' +
                                singleTaskData?.external_assignee_details?.last_name}
                          </strong>
                        </h4>
                      </div>
                      {!singleTaskData?.is_completed && (
                        <div className="d-flex-column">
                          <div className="button-wrapper">
                            <AppButton
                              outlined
                              onClick={() =>
                                handleShowUsers({
                                  external: true,
                                  history: false,
                                  dealPolice: false,
                                })
                              }
                              className="external-assign"
                              buttonText={
                                singleTaskData?.external_assignee_details === null
                                  ? 'Assign'
                                  : 'Reassign'
                              }
                            />
                            {singleTaskData?.external_assignee_details !== null && (
                              <>
                                <div className="ml-2">
                                  <AppButton
                                    onClick={() => handleNudge({ external: true })}
                                    outlined
                                    buttonIcon={<Telegram />}
                                    buttonText={'Nudge'}
                                    className={'external-nudge'}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          {activate_deal_police && (
                            <div className="mt-2">
                              <DealPoliceStuffs
                                showAssignees={() =>
                                  handleShowUsers({
                                    external: true,
                                    history: false,
                                    dealPolice: true,
                                  })
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
            )}
          </div>
          <div className="footerBar">
            <Grid
              container
              direction="row"
            >
              {!singleTaskData?.board_status ? (
                <Grid
                  item
                  xs={12}
                  className="d-flex justify-end"
                >
                  {!forAdd && !singleTaskData?.archived && <div className="mr-3" />}
                  {!isUrlIncludesTasks && (
                    <AppButton
                      greyButton
                      onClick={handleAlert}
                      buttonText={'Close'}
                      className={'close'}
                    />
                  )}
                  <div className="ml-3">
                    {(forAdd || isClone) && (
                      <AppButton
                        onClick={handleSave}
                        contained
                        buttonText={
                          loader.show ? (
                            <CircularProgress
                              style={{ color: '#ffffff' }}
                              size={20}
                            />
                          ) : (
                            'Save'
                          )
                        }
                      />
                    )}
                  </div>
                  {!forAdd && !isClone && (
                    <div className="ml-3">
                      <AppButton
                        onClick={handleCompleted}
                        contained={!isDisabled}
                        greyButton={isDisabled}
                        disabled={isDisabled}
                        buttonIcon={<CheckCircleOutline />}
                        buttonText={
                          singleTaskData?.is_completed ? 'Re-open task' : 'Mark as Complete'
                        }
                        tooltip={
                          isDisabled
                            ? 'Previous task must be completed first'
                            : 'Mark this task complete'
                        }
                        className={'mark-as-complete'}
                      />
                    </div>
                  )}
                </Grid>
              ) : (
                !isUrlIncludesTasks && (
                  <AppButton
                    greyButton
                    onClick={handleAlert}
                    buttonText={'Close'}
                    className={'close'}
                  />
                )
              )}
            </Grid>
          </div>
        </>
      )}
      <TaskTypeSearch
        data={appliestoTasks}
        open={taskTypeSearch}
        handleClose={showTaskTypes}
        handleClick={handleTypeClick}
      />
      {prompt.show && (
        <ConfirmDialog
          open={prompt.show}
          handleClose={handleClosePrompt}
          dialogTitle={`Import from Task Type`}
          dialogContent={`Do you want to replace all Steps, Documents and Settings from the
          template : ${doc_type?.data?.[0]?.custom_label}`}
          onlyAdd={true}
        />
      )}
      {confirmation && (
        <ConfirmDialog
          open={confirmation}
          handleClose={handleCloseConfirmation}
          dialogTitle={`Unassign`}
          dialogContent={`Are you sure you want to un-assign this task?`}
        />
      )}
      {showAlert && (
        <ConfirmDialog
          open={showAlert}
          handleClose={handleCloseAlert}
          dialogTitle={'Cancel'}
          dialogContent={'Cancel Task entry, changes will be lost!'}
        />
      )}
      <Assignees
        open={showUsers}
        handleClose={handleShowUsers}
        card={formData}
        recent_data={singleTaskData}
        assignment_type={assigneeType}
        history={history}
        dealPolice={dealPolice}
      />
      <MaapLinkModal
        open={showModal}
        assignee={
          singleTaskData?.external_assignee_details?.first_name +
          ' ' +
          singleTaskData?.external_assignee_details?.last_name
        }
        handleClose={closeModal}
      />
    </div>
  );
}

export default React.memo(TaskInfo);
