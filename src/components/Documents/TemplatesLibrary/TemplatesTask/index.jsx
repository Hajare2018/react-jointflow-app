import {
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AdditionalTable from '../AdditionalTable';
import { requestContentsList } from '../../../../Redux/Actions/dashboard-data';
import Contents from '../../../Contents';
import RichTextEditor from '../../../RichTextEditor/RichTextEditor';
import { convertToHTML, convertFromHTML } from '../../../RichTextEditor/converters';
import { EditorState } from 'draft-js';
import { requestStatuses, updateProject } from '../../../../Redux/Actions/create-project';
import StatusTable from './StatusTable';
import JiraIntegration from './JiraIntegration';
import HttpClient from '../../../../Api/HttpClient';
import { useTenantContext } from '../../../../context/TenantContext';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ height: '93vh' }}
    >
      {value === index && <Box style={{ height: '93vh' }}>{children}</Box>}
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

function AdditionalTableModal({ open, refresh, handleClose }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [description, setDescription] = React.useState('');
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const loader = useSelector((state) => state.showLoader);
  const projectData = useSelector((state) => state?.singleProjectData);

  const [jiraIntegrationStatus, setJiraIntegrationStatus] = React.useState({ cards: {} });
  const { jira_integration_enabled: jiraIntegrationEnabled } = useTenantContext();

  React.useEffect(() => {
    const loadJiraIntegration = async (boardId) => {
      const {
        data: { board },
      } = await HttpClient.getJiraIntegrationStatus(boardId);
      setJiraIntegrationStatus(board);
    };

    if (projectData?.data[0]?.id) {
      loadJiraIntegration(projectData?.data[0]?.id);
    }
  }, [projectData?.data[0]?.id]);

  const handleClear = () => {
    setValue(0);
    refresh();
    handleClose();
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == 1) {
      handleEditDescription(projectData?.data[0]);
    }
    if (newValue == 2) {
      dispatch(
        requestContentsList({
          id: projectData?.data[0]?.id,
          fetchContent: false,
        }),
      );
    }
    if (newValue == 3) {
      dispatch(
        requestStatuses({
          id: projectData?.data[0]?.id,
        }),
      );
    }
  };

  const handleEditDescription = (item) => {
    if (Object.keys(item).length > 0) {
      if (item?.description == undefined || item?.description == '') {
        return;
      } else {
        const contentState = convertFromHTML(item?.description);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        // const htmlData = convertToHTML(editorState.getCurrentContent().getPlainText());
      }
    }
  };

  const onEditorStateChange = (state) => {
    setEditorState(state);
    const htmlData = convertToHTML(state.getCurrentContent());
    setDescription(htmlData);
  };

  const editDescription = () => {
    const projectRequest = {
      description: description,
    };
    dispatch(
      updateProject({
        id: projectData?.data[0]?.id,
        data: projectRequest,
        filterByTemplate: true,
        archivedTemplates: false,
        closedBoards: false,
        is_crm: false,
      }),
    );
  };
  return (
    <Dialog
      fullWidth
      maxWidth="xxl"
      open={open}
    >
      <div style={{ position: 'sticky', top: 0, zIndex: 999 }}>
        <AppBar className={classes.appBar}>
          <Toolbar className="justify-space-between">
            <strong>Tasks for &quot;{projectData?.data[0]?.name}&quot; Template</strong>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClear}
              aria-label="close"
            >
              <Close style={{ fontSize: 30 }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AppBar
          position="static"
          color="default"
        >
          <StyledTabs
            value={value}
            onChange={handleChange}
          >
            <StyledTab label={'Playbook Info'} />
            <StyledTab label={'Description'} />
            <StyledTab label={'Contents'} />
            <StyledTab label={'Statuses'} />
            {jiraIntegrationEnabled && <StyledTab label={'Integrations'} />}
          </StyledTabs>
        </AppBar>
      </div>
      <TabPanel
        value={value}
        index={0}
      >
        <AdditionalTable
          jiraIntegrationStatus={jiraIntegrationStatus}
          setJiraIntegrationStatus={setJiraIntegrationStatus}
        />
      </TabPanel>
      <TabPanel
        value={value}
        index={1}
      >
        <div className="m-3">
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
                <button
                  className="btn-comment"
                  onClick={editDescription}
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
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel
        value={value}
        index={2}
      >
        <Contents
          id={projectData?.data[0]?.id}
          forLibrary
        />
      </TabPanel>
      <TabPanel
        value={value}
        index={3}
      >
        <StatusTable board={projectData?.data[0]?.id} />
      </TabPanel>
      <TabPanel
        value={value}
        index={4}
      >
        <JiraIntegration
          enabled={jiraIntegrationStatus.jiraSyncEnabled}
          onChange={async (jiraSyncEnabled) => {
            HttpClient.updateJiraIntegrationStatus({
              boardId: projectData?.data[0]?.id,
              jiraSyncEnabled,
            });
            setJiraIntegrationStatus((old) => ({ ...old, jiraSyncEnabled }));
          }}
        />
      </TabPanel>
    </Dialog>
  );
}

export default React.memo(AdditionalTableModal);
