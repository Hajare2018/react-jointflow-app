import { createAction } from 'redux-actions';
import {
  FETCH_CRM_PROJECTS,
  FETCH_DOCUMENTS_DATA,
  FETCH_PROJECTS_BY_COMPANY,
  FETCH_PROJECTS_IN_LITE_VIEW,
  FETCH_SUNBURST_DATA,
  FETCH_TEMPLATES_DATA,
} from '../Constants/actionTypes';
import * as Documents from '../../Api/documents-data';
import documentsData, {
  crmProjectsData,
  liteViewProjectsData,
  ProjectsByCompanyData,
  sunburstData,
  templatesData,
} from '../Reducers/documents-data';
import { setMessage, show } from './loader';
import { handleError } from '../../components/Utils';

const fetchDocumentsData = createAction(FETCH_DOCUMENTS_DATA);
const fetchTemplates = createAction(FETCH_TEMPLATES_DATA);
const sunburst_data = createAction(FETCH_SUNBURST_DATA);
const dataInLiteView = createAction(FETCH_PROJECTS_IN_LITE_VIEW);
const projectsByCompany = createAction(FETCH_PROJECTS_BY_COMPANY);
const crm_projects = createAction(FETCH_CRM_PROJECTS);

export default function requestDocumentsData(params) {
  return (dispatch) =>
    Documents.requestDocumentsData(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));

          if (!data?.data?.length) {
            dispatch(setMessage('Create your first playbook!'));
          } else {
            dispatch(setMessage(''));
          }
        }
        if (params?.filterByTemplate) {
          dispatch(fetchTemplates(data));
          dispatch(templatesData({ data: data.data, errors: null }, FETCH_TEMPLATES_DATA));
        } else if (params?.fetch_sunburst_data) {
          if (!data.data.length) {
            dispatch(setMessage("No board's chart to display!"));
          } else {
            dispatch(setMessage('Loading...'));
          }
          dispatch(sunburst_data(data));
          dispatch(sunburstData({ data: data.data, errors: null }, FETCH_SUNBURST_DATA));
        } else if (params?.fetch_crm_projects) {
          dispatch(crm_projects(data));
          dispatch(crmProjectsData({ data: data.data, errors: null }, FETCH_CRM_PROJECTS));
        } else {
          dispatch(fetchDocumentsData(data));
          dispatch(documentsData({ data: data.data, errors: null }, FETCH_DOCUMENTS_DATA));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestProjectsInLiteView(params) {
  return (dispatch) =>
    Documents.projectsLiteView(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          setTimeout(() => {
            if (!data?.data?.length) {
              dispatch(setMessage('No Record(s) found!'));
            }
          }, 2000);
          dispatch(dataInLiteView(data));
          dispatch(
            liteViewProjectsData({ data: data.data, errors: null }, FETCH_PROJECTS_IN_LITE_VIEW),
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestProjectsByCompany(params) {
  return (dispatch) =>
    Documents.projectsCompanyView(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          setTimeout(() => {
            if (!data?.data?.length) {
              dispatch(setMessage('No Record(s) found!'));
            }
          }, 2000);
          dispatch(projectsByCompany(data));
          dispatch(
            ProjectsByCompanyData({ data: data.data, errors: null }, FETCH_PROJECTS_BY_COMPANY),
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
