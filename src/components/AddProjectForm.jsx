import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import postProject, {
  removeTag,
  requestStatuses,
  saveCustomAttributes,
  saveTag,
  updateProject,
} from '../Redux/Actions/create-project';
import AppBar from '@mui/material/AppBar';
import {
  Box,
  Chip,
  CircularProgress,
  DialogActions,
  Grid,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { getCompanies } from '../Redux/Actions/companies';
import { show } from '../Redux/Actions/loader';
import {
  ArchiveOutlined,
  BuildOutlined,
  Check,
  PublishOutlined,
  WarningRounded,
} from '@mui/icons-material';
import TemplatesTable from './Documents/TemplatesLibrary/TemplatesTable';
import { fetchData } from '../Redux/Actions/store-data';
import NewCompanyDialog from './NewCompanyDialog';
import { completed } from '../Redux/Actions/completed-value';
import ConfirmDialog from './ProjectForm/Components/ConfirmDialog';
import CrmComponent from './Crm/CrmComponent';
import TasksWeightTable from './TasksWeightTable';
import requestProject, { requestContentsList } from '../Redux/Actions/dashboard-data';
import { showErrorSnackbar, showWarningSnackbar } from '../Redux/Actions/snackbar';
import { FaTag } from 'react-icons/fa';
import { assignColorsToNames } from './Utils';
import RichTextEditor from './RichTextEditor/RichTextEditor';
import { convertFromHTML, convertToHTML } from './RichTextEditor/converters';
import { EditorState } from 'draft-js';
import { tagColors } from './TagColors';
import Contents from './Contents';
import { getDocsList } from '../Redux/Actions/document-upload';
import DocumentsView from './DocumentsView';
import DynamicForm from './DynamicForm/index';
import requestSingleProject from '../Redux/Actions/single-project';
import StatusTableModal from './Documents/TemplatesLibrary/TemplatesTask/StatusTableModal';
import { useTenantContext } from '../context/TenantContext';
import { useUserContext } from '../context/UserContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box style={{ height: 'auto' }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const StyledTabs = withStyles({
  root: {
    borderBottom: '5px grey',
    '& .MuiTabs-flexContainer': {
      flexWrap: 'wrap',
    },
  },
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 120,
      width: '100%',
      backgroundColor: '#627daf',
      color: '#627daf',
      borderBottom: 15,
      borderBottomColor: '#627daf',
      borderBottomStyle: 'solid',
    },
  },
})((props) => (
  <Tabs
    variant="standard"
    {...props}
    TabIndicatorProps={{ children: <span /> }}
  />
));

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: '#555555',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 16,
    marginRight: theme.spacing(0),
    '&:hover': {
      color: '#627daf',
      opacity: 2,
    },
    '&.Mui-selected': {
      outline: 'none',
      color: '#627daf',
    },
    '&:selected': {
      color: '#627daf',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#627daf',
      outline: 'none',
    },
  },
}))((props) => (
  <Tab
    className="tabtxtsize"
    style={props.style}
    disableRipple
    {...props}
  />
));

function AddProjectForm({ data, forCrm, tab, forEdit, forContent, tabVal }) {
  const extendedDate = new Date().setDate(new Date().getDate() + 30);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const textRef = React.useRef();
  const dispatch = useDispatch();
  const [showStatus, setShowStatus] = useState(false);
  const [display, setDisplay] = useState(false);
  const [showCrms, setShowCrms] = useState(false);
  const [value, setValue] = React.useState(tab);
  const [tabValue, setTabValue] = React.useState(tabVal);
  const [htmlView, setHtmlView] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const [showCustomFields, setShowCustomFields] = React.useState(true);
  const [descriptionView, setDescriptionView] = React.useState(false);
  const [form, setForm] = useState({
    projectTitle: '',
    projectValue: 0,
    company: '',
    description: '',
    category: '',
    label: '',
    targetCloseDate: new Date(extendedDate).toJSON().slice(0, 10).replace(/-/g, '-'),
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [prompt, setPrompt] = React.useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [formValues, setFormValues] = useState({});

  const loader = useSelector((state) => state.showLoader);
  const singleBoard = useSelector((state) => state.singleProjectData);
  const boardData = singleBoard?.data?.length > 0 ? singleBoard?.data?.[0] : [];
  const promptMessage = useSelector((state) => state.messageData);
  const dropDownData = useSelector((state) => state.companiesData);
  const tags = useSelector((state) => state.tagsData);
  const { project_type_list, tag_categories } = useTenantContext();

  useEffect(() => {
    if (textRef.current) {
      // const obj = new SelectionText(textRef.current);
    }
    dispatch(getCompanies());
  }, []);

  useEffect(() => {}, [
    form.projectTitle,
    form.projectValue,
    form.targetCloseDate,
    form.description,
    form.company,
    form.label,
    form.category,
    descriptionView,
    formValues,
  ]);

  useEffect(() => {
    setValue(tab);
    setTabValue(tabVal);
  }, [tab, tabVal]);

  useEffect(() => {
    if (data?.edit_project) {
      setForm({
        projectTitle: boardData?.name,
        projectValue: boardData?.project_value,
        company: boardData?.buyer_company_details?.name,
        description: boardData?.description,
        targetCloseDate: boardData?.target_close_date,
      });
      setHtmlView(boardData?.description_is_html);
      setDescriptionView(boardData?.description_is_html);
      setSelectedType(boardData?.project_type === 'Select' ? null : boardData?.projectType);
    } else {
      setForm({
        projectTitle: '',
        projectValue: 0,
        company: '',
        description: '',
        category: '',
        label: '',
        targetCloseDate: new Date(extendedDate).toJSON().slice(0, 10).replace(/-/g, '-'),
      });
      setSelectedType(null);
    }
  }, [singleBoard]);

  const { user: parsedUser } = useUserContext();

  const onEditorStateChange = (state) => {
    setEditorState(state);
    const htmlData = convertToHTML(state.getCurrentContent());
    setForm({ ...form, ['description']: htmlData });
  };

  const allCategories = tag_categories;
  allCategories?.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  const companyData = dropDownData.data.length > 0 ? dropDownData.data : [];
  const unArchivedCompany = companyData.filter((element) => element.archived === false);
  const handleConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleSelectedType = (event) => {
    const selectedValue = event.target.value;
    setSelectedType(selectedValue === 'Select' ? null : selectedValue);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (forEdit) {
      if (newValue == 1) {
        dispatch(requestSingleProject({ id: boardData?.id }));
        handleEditDescription(boardData);
      }
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 0) {
      dispatch(requestProject({ id: boardData?.id, filteredByBoard: true }));
    }
    if (newValue == 1) {
      dispatch(requestContentsList({ id: boardData?.id, fetchContent: false }));
    }
    if (newValue == 2) {
      dispatch(
        getDocsList({
          fetchByBoard: false,
          fetchLightList: true,
          board_id: boardData?.id,
        }),
      );
    }
  };

  const handleEditDescription = (item) => {
    setHtmlView(false);
    if (Object.keys(item).length > 0) {
      if (item?.description == undefined || item?.description == '') {
        return;
      } else {
        const contentState = convertFromHTML(item?.description);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        const htmlData = convertToHTML(editorState.getCurrentContent().getPlainText());
        setForm({ ...form, ['description']: htmlData });
      }
    } else {
      setForm({ ...form, ['description']: item });
    }
  };

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSaveTags = () => {
    if (
      form.category == undefined ||
      form.category === 'Category' ||
      form.category === '' ||
      form.label == undefined ||
      form.label === ''
    ) {
      dispatch(showWarningSnackbar('Please select a Category and Type a label.'));
      return;
    } else {
      dispatch(show(true));
      const reqBody = {
        board: data?.board_id,
        category: form.category,
        label: form.label,
      };
      dispatch(saveTag({ data: reqBody }));
      if (!loader.show) {
        setForm({
          category: '',
          label: '',
        });
      }
    }
  };

  const handleDeleteTags = (id) => {
    dispatch(removeTag({ id: id, board: data?.board_id }));
  };

  const handleShowTemplates = () => {
    const selectedCompany = companyData.filter((item) => item.name === form.company);
    if (form.projectTitle === '' || form.company === '') {
      dispatch(showErrorSnackbar('All fields are required!'));
    } else {
      if (selectedCompany?.length > 0) {
        if (form.company === selectedCompany[0].name) {
          dispatch(
            fetchData({
              project_value: parseInt(form.projectValue),
              name: form.projectTitle,
              target_close_date: form.targetCloseDate,
              buyer_company: selectedCompany[0].id,
              description: form.description,
              owner: parsedUser.id,
            }),
          );
          setShowTemplates(!showTemplates);
          dispatch(completed(false));
        }
      } else {
        handleConfirmation();
      }
    }
  };

  const handleCloseTemplates = () => {
    setShowTemplates(!showTemplates);
  };

  const handleClear = () => {
    setForm({
      projectTitle: '',
      projectValue: 0,
      company: '',
      description: '',
      targetCloseDate: new Date(extendedDate).toJSON().slice(0, 10).replace(/-/g, '-'),
    });
    setFormValues({});
  };

  const createProject = () => {
    if (form.projectTitle === '' || form.company == '') {
      dispatch(showErrorSnackbar('All fields are required!'));
    } else {
      dispatch(show(true));
      const projectRequest = {
        project_value: form.projectValue,
        name: form.projectTitle,
        is_template: 'True',
        owner: parsedUser?.id,
        description: form.description,
        project_type: selectedType == null ? '' : selectedType,
        archived: 'False',
      };
      dispatch(
        postProject({
          data: projectRequest,
          filterByTemplate: true,
          archivedTemplates: false,
          closedBoards: false,
        }),
      );
      if (!loader.show) {
        handleClear();
      }
    }
  };

  const editProject = (closeForm, htmlView) => {
    if (form.projectTitle === '' && form.projectValue == 0) {
      dispatch(showErrorSnackbar('All fields are required!'));
    }
    const selectedCompany = companyData.filter((item) => item.name === form.company);
    if (selectedCompany?.length > 0) {
      if (form.company === selectedCompany[0].name) {
        const projectRequest = {
          project_value: form.projectValue == null ? 0 : form.projectValue,
          nb_green_flags: boardData?.green_flag,
          nb_red_flags: boardData?.red_flag,
          nb_amber_flags: boardData?.amber_flag,
          name: form?.projectTitle,
          target_close_date: form?.targetCloseDate,
          buyer_company: selectedCompany[0].id,
          description: form.description,
          archived: boardData?.archived,
          description_is_html: htmlView,
          project_type: selectedType,
        };
        dispatch(
          updateProject({
            id: boardData?.id,
            data: projectRequest,
            closedBoards: false,
            is_crm: forCrm,
          }),
        );
        if (closeForm) {
          handleClear();
        }
      } else {
        handleConfirmation();
      }
    } else {
      const projectRequest = {
        project_value: form.projectValue == null ? 0 : form.projectValue,
        name: form.projectTitle,
        target_close_date: boardData?.target_close_date,
        description: form.description,
        owner: parsedUser?.id,
        archived: boardData?.archived,
        project_type: selectedType,
      };
      dispatch(
        updateProject({
          id: boardData?.id,
          data: projectRequest,
          filterByTemplate: true,
          archivedTemplates: false,
          closedBoards: false,
          is_crm: forCrm,
        }),
      );
      if (!loader.show) {
        handleClear();
      }
    }
  };

  const handleArchive = (e) => {
    if (e.close) {
      archiveProject();
      setDisplay(!display);
    }
    setDisplay(!display);
  };

  const archiveProject = () => {
    dispatch(show(true));
    const projectRequest = {
      archived: boardData?.archived ? 'False' : 'True',
    };
    dispatch(
      updateProject({
        id: boardData?.id,
        data: projectRequest,
        filterByTemplate: false,
        archivedTemplates: true,
        closedBoards: false,
        liteView: true,
      }),
    );
    if (!loader.show) {
      handleClear();
    }
  };

  const handleCloseCrmTable = () => {
    setShowCrms(!showCrms);
  };
  const finalArr = assignColorsToNames(tags?.data?.length > 0 ? tags?.data : [], tagColors);

  const handlePreview = (e) => {
    if (e.close) {
      editProject(false, htmlView ? false : true);
    }
    setPreview(false);
    setHtmlView(!htmlView);
  };

  const toggleCustomFields = () => {
    setShowCustomFields(!showCustomFields);
  };

  const handleUpdateAttributes = (dry_run) => {
    const form_data = new FormData();
    form_data.append('dry_run', dry_run);
    dispatch(
      saveCustomAttributes({
        id: boardData?.id,
        data: form_data,
        dry_run: dry_run,
      }),
    );
    setTimeout(() => {
      if (!loader.show) setPrompt(!prompt);
    }, 2000);
  };

  const handleDialog = (e) => {
    if (e.close) {
      handleUpdateAttributes(false);
    } else {
      setPrompt(false);
    }
  };

  const loadStatus = () => {
    dispatch(requestStatuses({ id: boardData?.id }));
    setShowStatus(true);
  };

  const closeStatusList = () => {
    setShowStatus(false);
  };

  return (
    <div>
      {(data || null)?.add ? (
        <>
          <div className="grid grid-cols-2 gap-x-4 p-4">
            <div
              style={{
                flex:
                  data?.crm_id !== null &&
                  data?.template &&
                  !data?.edit_project &&
                  !data?.template &&
                  !data?.edit_template
                    ? 4
                    : 10,
              }}
            >
              <label
                style={{
                  color: form.projectTitle === '' ? 'red' : '#aeaeae',
                }}
                className="form-label"
              >
                Title
              </label>
              <input
                type="text"
                placeholder={
                  (data?.edit_template || data?.edit_project) && form.projectTitle === ''
                    ? 'Loading...'
                    : 'Title'
                }
                name="projectTitle"
                className={form.projectTitle === '' ? 'error-form-control' : 'text-input'}
                defaultValue={data?.name ? data?.name : form?.projectTitle}
                value={form.projectTitle}
                onChange={handleForm}
              />
            </div>
            <div className="mb-3">
              <label
                style={{
                  color: '#aeaeae',
                }}
                className="form-label"
              >
                {data?.template
                  ? 'Initialize Average Value'
                  : data?.edit_template
                    ? 'Reset Average Value'
                    : 'Value'}
              </label>
              <input
                type="number"
                name="projectValue"
                placeholder={
                  (data?.edit_template || data?.edit_project) && form.projectValue == 0
                    ? 'Loading...'
                    : 'value'
                }
                className={'text-input'}
                value={form?.projectValue}
                onChange={handleForm}
              />
            </div>
            {!data?.template && !data?.edit_template && (
              <div>
                <label
                  className="form-label"
                  style={{
                    color: form.projectTitle === '' ? 'red' : '#aeaeae',
                  }}
                >
                  Company
                </label>
                <input
                  type="text"
                  disabled={data?.edit_project}
                  style={{ color: data?.edit_project && '#999' }}
                  autoComplete="off"
                  placeholder={
                    (data?.edit_template || data?.edit_project) && form.company == ''
                      ? 'Loading...'
                      : 'Select a Company'
                  }
                  list="data"
                  className={form.company === '' ? 'error-form-control' : 'text-input'}
                  value={form.company}
                  name="company"
                  onChange={handleForm}
                />
                <datalist id="data">
                  {unArchivedCompany.map((item, key) => (
                    <option
                      key={key}
                      value={item?.name}
                    />
                  ))}
                </datalist>
              </div>
            )}
            {(project_type_list || []).length > 0 && (
              <div>
                <label className="form-label">Project Type</label>
                <select
                  className="text-input task-type mr-3"
                  style={{ color: '#000000' }}
                  value={selectedType}
                  onChange={handleSelectedType}
                  onBlur={() => {
                    if (
                      selectedType !== boardData?.project_type &&
                      (data?.edit_template || data?.edit_project)
                    ) {
                      editProject(false, boardData?.description_is_html);
                    }
                  }}
                >
                  <option>Select</option>
                  {(project_type_list || [])?.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {data?.crm_id !== null &&
              data?.template &&
              !data?.edit_project &&
              !data?.template &&
              !data?.edit_template && (
                <div className="d-flex mb-3">
                  <div className="flex-2" />
                  <div className="flex-4">
                    <label className="form-label">CRM ID</label>
                    <input
                      type="text"
                      className="text-input"
                      disabled={true}
                      style={{ color: '#999' }}
                      value={data?.crm_id}
                    />
                  </div>
                </div>
              )}
            {!data?.template && !data?.edit_template && (
              <div>
                <label className="form-label">Target End Date</label>
                <input
                  type="date"
                  className="text-input"
                  name="targetCloseDate"
                  placeholder={
                    (data?.edit_template || data?.edit_project) && form.targetCloseDate == ''
                      ? 'Loading...'
                      : 'Target date'
                  }
                  min={new Date().toJSON().slice(0, 10).replace(/-/g, '-')}
                  defaultValue={
                    data?.target_close_date
                      ? new Date(data?.target_close_date).toJSON().slice(0, 10).replace(/-/g, '-')
                      : form.targetCloseDate
                  }
                  value={form?.targetCloseDate}
                  onChange={handleForm}
                />
              </div>
            )}
          </div>
          <DialogActions>
            {data?.template ? (
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#6385b7',
                  color: '#ffffff',
                  fontSize: 16,
                }}
                onClick={createProject}
              >
                {loader?.show ? (
                  <CircularProgress
                    size={15}
                    color="inherit"
                  />
                ) : (
                  'ADD'
                )}
              </Button>
            ) : data?.add ? (
              <Button
                variant="contained"
                style={{
                  backgroundColor: '#6385b7',
                  color: '#ffffff',
                  fontSize: 16,
                }}
                onClick={handleShowTemplates}
              >
                {loader?.show ? (
                  <CircularProgress
                    size={15}
                    color="inherit"
                  />
                ) : (
                  'NEXT'
                )}
              </Button>
            ) : (
              ''
            )}
          </DialogActions>
        </>
      ) : (data || null)?.edit_project ? (
        <div>
          {forEdit ? (
            <>
              <AppBar
                position="static"
                color="default"
              >
                <StyledTabs
                  value={value}
                  onChange={handleChange}
                >
                  <StyledTab
                    label={'Project Info'}
                    value={0}
                  />
                  <StyledTab
                    label={'Description'}
                    value={1}
                  />
                </StyledTabs>
              </AppBar>
              <TabPanel
                value={value}
                index={0}
              >
                <div className="grid grid-cols-2 gap-x-4 p-4">
                  <div
                    style={{
                      flex:
                        data?.crm_id !== null &&
                        data?.template &&
                        !data?.edit_project &&
                        !data?.template &&
                        !data?.edit_template
                          ? 4
                          : 10,
                    }}
                  >
                    <label
                      style={{
                        color: form.projectTitle === '' ? 'red' : '#aeaeae',
                      }}
                      className="form-label"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder={
                        (data?.edit_template || data?.edit_project) && form.projectTitle === ''
                          ? 'Loading...'
                          : 'Title'
                      }
                      name="projectTitle"
                      className={form.projectTitle === '' ? 'error-form-control' : 'text-input'}
                      onBlur={() => {
                        if (form.projectTitle !== boardData?.name) {
                          editProject(false, boardData?.description_is_html);
                        }
                      }}
                      defaultValue={data?.name ? data?.name : form?.projectTitle}
                      value={form.projectTitle}
                      onChange={handleForm}
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      style={{
                        color: '#aeaeae',
                      }}
                      className="form-label"
                    >
                      {data?.template
                        ? 'Initialize Average Value'
                        : data?.edit_template
                          ? 'Reset Average Value'
                          : 'Value'}
                    </label>
                    <input
                      type="number"
                      name="projectValue"
                      placeholder={
                        (data?.edit_template || data?.edit_project) && form.projectValue == 0
                          ? 'Loading...'
                          : 'value'
                      }
                      onBlur={() => {
                        if (form.projectValue !== boardData?.value) {
                          editProject(false, boardData?.description_is_html);
                        }
                      }}
                      className={'text-input'}
                      value={form?.projectValue}
                      onChange={handleForm}
                    />
                  </div>
                  {!data?.template && !data?.edit_template && (
                    <div>
                      <label
                        className="form-label"
                        style={{
                          color: form.projectTitle === '' ? 'red' : '#aeaeae',
                        }}
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        disabled={data?.edit_project}
                        style={{ color: data?.edit_project && '#999' }}
                        autoComplete="off"
                        placeholder={
                          (data?.edit_template || data?.edit_project) && form.company == ''
                            ? 'Loading...'
                            : 'Select a Company'
                        }
                        list="data"
                        className={form.company === '' ? 'error-form-control' : 'text-input'}
                        value={form.company}
                        name="company"
                        onChange={handleForm}
                      />
                      <datalist id="data">
                        {unArchivedCompany.map((item, key) => (
                          <option
                            key={key}
                            value={item?.name}
                          />
                        ))}
                      </datalist>
                    </div>
                  )}
                  {data?.crm_id !== null &&
                    data?.template &&
                    !data?.edit_project &&
                    !data?.template &&
                    !data?.edit_template && (
                      <div className="d-flex mb-3">
                        <div className="flex-2" />
                        <div className="flex-4">
                          <label className="form-label">CRM ID</label>
                          <input
                            type="text"
                            className="text-input"
                            disabled={true}
                            style={{ color: '#999' }}
                            value={data?.crm_id}
                          />
                        </div>
                      </div>
                    )}
                  {!data?.template && !data?.edit_template && (
                    <div>
                      <label className="form-label">Target End Date</label>
                      <input
                        type="date"
                        className="text-input"
                        name="targetCloseDate"
                        placeholder={
                          (data?.edit_template || data?.edit_project) && form.targetCloseDate == ''
                            ? 'Loading...'
                            : 'Target date'
                        }
                        min={new Date().toJSON().slice(0, 10).replace(/-/g, '-')}
                        defaultValue={
                          data?.target_close_date
                            ? new Date(data?.target_close_date)
                                .toJSON()
                                .slice(0, 10)
                                .replace(/-/g, '-')
                            : form.targetCloseDate
                        }
                        value={form?.targetCloseDate}
                        onChange={handleForm}
                        onBlur={() => {
                          if (form.targetCloseDate !== boardData?.target_close_date) {
                            editProject(false, boardData?.description_is_html);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                {(data?.edit_project || data?.edit_template) && (
                  <>
                    <div className="grid grid-cols-2 gap-x-4 p-4">
                      <div>
                        <label className="form-label">Status</label>
                        <select
                          className="text-input task-type mr-3"
                          style={{ color: '#000000' }}
                          value={boardData?.status_label}
                          onClick={loadStatus}
                          // disabled
                        >
                          <option disabled>{boardData?.status_label}</option>
                        </select>
                      </div>
                      {(project_type_list || []).length > 0 && (
                        <div>
                          <label className="form-label">Project Type</label>
                          <select
                            className="text-input task-type mr-3"
                            style={{ color: '#000000' }}
                            value={selectedType}
                            onChange={handleSelectedType}
                            onBlur={() => {
                              if (
                                selectedType !== boardData?.project_type &&
                                (data?.edit_template || data?.edit_project)
                              ) {
                                editProject(false, boardData?.description_is_html);
                              }
                            }}
                          >
                            <option>Select</option>
                            {(project_type_list || [])?.map((type) => (
                              <option
                                key={type}
                                value={type}
                              >
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 p-4">
                      <>
                        <div className="d-flex">
                          <FaTag className="app-color h-7 w-7" />
                          <div className="d-flex max-w-xs rounded-3xl border-2 h-8 border-solid m-2">
                            <select
                              value={form.category}
                              onChange={handleForm}
                              name="category"
                              className="ml-2"
                            >
                              <option>Category</option>
                              <option value={'default'}>Default</option>
                              {allCategories?.map((category) => (
                                <option
                                  key={category}
                                  value={category}
                                >
                                  {category}
                                </option>
                              ))}
                            </select>
                            <div
                              style={{
                                width: 3,
                                height: 20,
                                backgroundColor: '#aeaeae',
                              }}
                            />
                            <input
                              value={form.label}
                              onChange={handleForm}
                              name="label"
                              placeholder="Type here..."
                              className="mr-2 h-7"
                              maxLength={30}
                            />
                            <div
                              onClick={handleSaveTags}
                              className="mr-2"
                            >
                              <Check />
                            </div>
                          </div>
                          <div>
                            {finalArr?.map((tag) => (
                              <Chip
                                key={tag.id}
                                label={tag.category + ' | ' + tag.label}
                                style={{
                                  backgroundColor: tag.background,
                                  color: '#ffffff',
                                }}
                                onDelete={() => handleDeleteTags(tag.id)}
                                className="mr-2 mb-1"
                                size="small"
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    </div>
                    <div className="d-flex">
                      {boardData?.custom_attributes?.length > 0 && (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              flex: 5,
                              height: 2,
                              width: '45%',
                              backgroundColor: '#6385b7',
                              marginLeft: 15,
                            }}
                          />
                          <div onClick={toggleCustomFields}>
                            <Chip
                              label={'Custom Fields'}
                              clickable
                              style={{
                                backgroundColor: '#6385b7',
                                color: '#ffffff',
                              }}
                              size="small"
                            />
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flex: 5,
                              height: 2,
                              width: '100%',
                              backgroundColor: '#6385b7',
                            }}
                          />
                          <Tooltip
                            title="Update Attributes Field definition"
                            placement="bottom"
                          >
                            <div
                              style={{
                                backgroundColor: '#6385b7',
                                marginRight: 15,
                                borderRadius: '0.5rem',
                              }}
                              onClick={() => handleUpdateAttributes(true)}
                            >
                              <BuildOutlined
                                style={{
                                  color: '#ffffff',
                                  fontSize: 25,
                                  margin: 4,
                                }}
                              />
                            </div>
                          </Tooltip>
                        </>
                      )}
                    </div>
                    {showCustomFields && boardData?.custom_attributes?.length > 0 && (
                      <div style={{ maxHeight: '35vh', overflowY: 'auto' }}>
                        <DynamicForm
                          attributes={boardData?.custom_attributes}
                          board={boardData?.id}
                        />
                      </div>
                    )}
                  </>
                )}
              </TabPanel>
              <TabPanel
                value={value}
                index={1}
              >
                <Grid
                  container
                  className="p-3"
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                  >
                    <div className="mb-3">
                      <div className="d-flex-column editorContainer">
                        <div className="board-editor">
                          <RichTextEditor
                            editorState={editorState}
                            placeholder="Type your description here..."
                            editorStyle={{
                              height: '57vh',
                              overflowY: 'auto',
                              marginLeft: 5,
                            }}
                            editorClassName="comment-editor"
                            onEditorStateChange={onEditorStateChange}
                            onBlur={() => {
                              if (form.description !== boardData?.description) {
                                editProject(false, boardData?.description_is_html);
                              }
                            }}
                            spellCheck
                            toolbar={{
                              options: [
                                'inline',
                                'emoji',
                                'list',
                                'textAlign',
                                'link',
                                // "embedded",
                                'image',
                              ],
                              inline: {
                                component: undefined,
                                dropdownClassName: undefined,
                                options: ['bold', 'italic', 'underline', 'strikethrough'],
                                italic: { className: undefined },
                                underline: { className: undefined },
                              },
                              image: {
                                className: undefined,
                                component: undefined,
                                popupClassName: undefined,
                                urlEnabled: true,
                                alignmentEnabled: true,
                                defaultSize: {
                                  height: 'auto',
                                  width: 'auto',
                                },
                              },
                            }}
                          />
                          <div
                            style={{
                              borderTop: `1px solid #D3D3D3`,
                              borderTopRightRadius: '0.3rem',
                              borderTopLeftRadius: '0.3rem',
                            }}
                            className={'d-flex justify-end p-1'}
                          >
                            {data?.add ? (
                              <button
                                className="btn-comment"
                                onClick={handleShowTemplates}
                              >
                                {loader?.show ? (
                                  <CircularProgress
                                    size={15}
                                    color="inherit"
                                  />
                                ) : (
                                  'NEXT'
                                )}
                              </button>
                            ) : (
                              <button
                                className="btn-comment"
                                onClick={() => editProject(false, boardData?.description_is_html)}
                              >
                                {loader?.show ? (
                                  <CircularProgress
                                    size={15}
                                    color="inherit"
                                  />
                                ) : (
                                  'UPDATE'
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </TabPanel>
              {value === 0 && (
                <DialogActions>
                  <Button
                    variant="contained"
                    onClick={loadStatus}
                    style={{
                      backgroundColor: '#6385b7',
                      color: '#ffffff',
                      fontSize: 16,
                    }}
                  >
                    <PublishOutlined className="white-color" />
                    Change Status
                  </Button>
                  {data?.edit_project && (
                    <>
                      <Button
                        variant="contained"
                        onClick={handleArchive}
                        startIcon={<ArchiveOutlined style={{ color: '#ffffff', fontSize: 25 }} />}
                        style={{
                          backgroundColor: '#6385b7',
                          color: '#ffffff',
                          fontSize: 16,
                          marginRight: 5,
                        }}
                      >
                        Archive
                      </Button>
                    </>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => editProject(false, boardData?.description_is_html)}
                    style={{
                      backgroundColor: '#6385b7',
                      color: '#ffffff',
                      fontSize: 16,
                    }}
                  >
                    {loader?.show ? (
                      <CircularProgress
                        size={15}
                        color="inherit"
                      />
                    ) : (
                      'UPDATE'
                    )}
                  </Button>
                </DialogActions>
              )}
            </>
          ) : forContent ? (
            <>
              <AppBar
                position="static"
                color="default"
              >
                <StyledTabs
                  value={tabValue}
                  onChange={handleChangeTab}
                >
                  {!data?.template && !data?.edit_template && data?.edit_project && (
                    <StyledTab
                      label={'Task Settings'}
                      value={0}
                    />
                  )}
                  <StyledTab
                    label={'Content'}
                    value={1}
                  />
                  <StyledTab
                    label={'Documents'}
                    value={2}
                  />
                </StyledTabs>
              </AppBar>
              <TabPanel
                value={tabValue}
                index={0}
              >
                <TasksWeightTable
                  forDashboard
                  is_group_enabled={boardData?.display_group_maap}
                />
              </TabPanel>
              <TabPanel
                value={tabValue}
                index={1}
              >
                <Contents
                  id={data?.board_id}
                  preview
                  forLibrary
                />
              </TabPanel>
              <TabPanel
                value={tabValue}
                index={2}
              >
                <DocumentsView forDashboard />
              </TabPanel>
            </>
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
      <TemplatesTable
        show={showTemplates}
        handleHide={handleCloseTemplates}
      />
      <NewCompanyDialog
        open={showConfirmation}
        handleClose={handleConfirmation}
        company={form.company}
      />
      {prompt && (
        <ConfirmDialog
          open={prompt}
          dialogTitle={'Update Attributes Fields Definition'}
          dialogContent={promptMessage?.message}
          handleClose={handleDialog}
        />
      )}
      {display && (
        <ConfirmDialog
          open={display}
          dialogTitle={'Archive'}
          dialogContent={
            <div className="text-centre">
              <WarningRounded
                style={{
                  color: 'lightcoral',
                  height: '4rem',
                  width: '4rem',
                }}
              />
              <p>Warning, are you sure you want to archive this project?</p>
              <p>Archived projects cannot be re-opened!</p>
            </div>
          }
          handleClose={handleArchive}
        />
      )}
      {preview && (
        <ConfirmDialog
          open={preview}
          dialogTitle={'Editor'}
          dialogContent={
            htmlView
              ? 'Unsupported content will be stripped, do you want to continue?'
              : 'Switching to HTML mode is non-reversible, are you sure you want to go ahead?'
          }
          handleClose={handlePreview}
        />
      )}
      <StatusTableModal
        open={showStatus}
        handleClose={closeStatusList}
        board={boardData?.id}
      />
      <CrmComponent
        open={showCrms}
        handleClose={handleCloseCrmTable}
      />
    </div>
  );
}

export default React.memo(AddProjectForm);
