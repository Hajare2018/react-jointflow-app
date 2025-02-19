import { createAction } from 'redux-actions';
import {
  COMPANY_DETAILS,
  COMPANY_FAV_ICON,
  CREATE_COMPANY,
  EDIT_COMPANY,
  FETCH_COMPANIES,
  FETCH_COMPANY_HIERARCHY,
  GIVE_COMPANY_ACCESS,
} from '../Constants/actionTypes';
import * as Company from '../../Api/companies';
import {
  companiesData,
  companyAccessData,
  companyData,
  companyFavIcon,
  companyHierarchyData,
} from '../Reducers/companies';
import { show } from './loader';
import { showSuccessSnackbar } from './snackbar';
import { handleError } from '../../components/Utils';

const requestCompanies = createAction(FETCH_COMPANIES);
const saveCompany = createAction(CREATE_COMPANY);
const updateCompany = createAction(EDIT_COMPANY);
const company_details = createAction(COMPANY_DETAILS);
const company_icon = createAction(COMPANY_FAV_ICON);
const company_access = createAction(GIVE_COMPANY_ACCESS);
const company_hierarchy = createAction(FETCH_COMPANY_HIERARCHY);

export function getCompanies(params) {
  return (dispatch) =>
    Company.fetchCompanies(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(requestCompanies(data));
        dispatch(companiesData({ data: data.data, errors: null }, FETCH_COMPANIES));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function postCompany(params) {
  return (dispatch) =>
    Company.addCompany(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getCompanies());
        }
        dispatch(saveCompany(data));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function putCompany(params) {
  return (dispatch) =>
    Company.editCompany(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(requestCompanyData({ id: params.id }));
          dispatch(getCompanies());
        }
        dispatch(updateCompany(data));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestCompanyData(params) {
  return (dispatch) =>
    Company.fetchOneCompany(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(company_details(data));
        dispatch(companyData({ data: data.data, errors: null }, COMPANY_DETAILS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestCompanyFavIcon(params) {
  return (dispatch) =>
    Company.companyFavIcon(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(requestCompanyData({ id: params.id }));
          dispatch(getCompanies());
        }
        dispatch(company_icon(data));
        dispatch(companyFavIcon({ data: data.data, errors: null }, COMPANY_FAV_ICON));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestCompanyAccess(params) {
  return (dispatch) =>
    Company.companyAccess(params).then((data) => {
      if (data) {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data.data.details));
      }
      dispatch(company_access(data));
      dispatch(companyAccessData({ data: data.data, errors: null }, GIVE_COMPANY_ACCESS));
    });
}

export function requestCompanyHierarchy(params) {
  return (dispatch) =>
    Company.companyHierarchy(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(company_hierarchy(data));
        dispatch(companyHierarchyData({ data: data.data, errors: null }, FETCH_COMPANY_HIERARCHY));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
