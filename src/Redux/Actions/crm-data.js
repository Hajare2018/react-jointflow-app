import { createAction } from 'redux-actions';
import {
  FETCH_CRM_DEALS,
  FETCH_CRM_COMPANY,
  FETCH_CRM_CONTACTS,
  FETCH_CRM_CONNECTIONS,
  FETCH_CRM_STATUS,
  CRM_SYNC,
  FETCH_SINGLE_CRM,
  FETCH_CRM_DEALS_SEARCH,
} from '../Constants/actionTypes';
import * as Crm from '../../Api/crm-data';
import { displayCompanies, displayDialog, setMessage, show } from './loader';
import {
  crmDealsData,
  crmCompanyData,
  crmContactData,
  crmConnectedData,
  crmStatusData,
  crmSyncData,
  singleCrmData,
  crmDealsDataBySearch,
} from '../Reducers/crm-data';
import { showSuccessSnackbar } from './snackbar';
import { fetchData } from './store-data';
import { getCompanies } from './companies';
import { handleError } from '../../components/Utils';

const crm_deals = createAction(FETCH_CRM_DEALS);
const crm_deals_search = createAction(FETCH_CRM_DEALS_SEARCH);
const single_crm = createAction(FETCH_SINGLE_CRM);
const crm_company = createAction(FETCH_CRM_COMPANY);
const crm_contact = createAction(FETCH_CRM_CONTACTS);
const crm_connections = createAction(FETCH_CRM_CONNECTIONS);
const crm_status = createAction(FETCH_CRM_STATUS);
const crm_sync = createAction(CRM_SYNC);

export function fetchCrmDeals(params) {
  return (dispatch) =>
    Crm.requestCrmDeals(params)
      .then((data) => {
        if (data) {
          if (data.data.length > 0) {
            dispatch(setMessage('Loading...'));
          } else {
            dispatch(setMessage('No Record(s) found!'));
          }
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(crm_deals(data));
        dispatch(crmDealsData({ data: data.data, errors: null }, FETCH_CRM_DEALS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
export function fetchCrmDealsBySearch(params) {
  return (dispatch) =>
    Crm.requestCrmDealsBySearch(params)
      .then((data) => {
        if (data) {
          if (data.data.length > 0) {
            dispatch(setMessage('Loading...'));
          } else {
            dispatch(setMessage('No Record(s) found!'));
          }
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(crm_deals_search(data));
        dispatch(crmDealsDataBySearch({ data: data.data, errors: null },  FETCH_CRM_DEALS_SEARCH));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function fetchSingleCrmDeal(params) {
  return (dispatch) =>
    Crm.requestSingleCrmDeal(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          const requestBody = {
            crm: params.crm,
            deal_id: params.deal,
          };
          const cloneReqBody = {
            deal_name: data?.data?.deal?.name,
            deal_val: data?.data?.deal?.value,
            target_end_date: data?.data?.deal?.target_end_date,
            crm_id: params.deal,
          };
          setTimeout(() => {
            dispatch(setMessage('Fetching Company Data...'));
            dispatch(fetchCrmCompany({ data: requestBody, cloneData: cloneReqBody }));
          }, 3000);
        }
        dispatch(single_crm(data));
        dispatch(singleCrmData({ data: data.data, errors: null }, FETCH_SINGLE_CRM));
      })
      .catch((error) => {
        handleError(error, dispatch);
        dispatch(setMessage('Retrieving Deal details...'));
      });
}

export function fetchCrmCompany(params) {
  return (dispatch) =>
    Crm.requestCrmCompany(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(setMessage(''));
          const reqBody = {
            crm: params?.data?.crm,
            deal_id: params?.data?.deal_id,
          };
          dispatch(requestCrmContact({ data: reqBody }));
          if (data?.status == 200) {
            dispatch(displayDialog(true));
            dispatch(
              fetchData({
                project_value: params?.cloneData?.deal_val,
                name: params?.cloneData?.deal_name,
                target_close_date: params?.cloneData?.target_end_date,
                buyer_company: data?.data?.comp_id,
                crm_id: params?.cloneData?.crm_id,
                show_templates: true,
              }),
            );
            return;
          } else {
            dispatch(
              fetchData({
                project_value: params?.cloneData?.deal_val,
                name: params?.cloneData?.deal_name,
                target_close_date: params?.cloneData?.target_end_date,
                buyer_company: '',
                crm_id: params?.cloneData?.crm_id,
              }),
            );
            dispatch(getCompanies());
            dispatch(displayCompanies(true));
          }
        }
        dispatch(crm_company(data));
        dispatch(crmCompanyData({ data: data?.data, errors: null }, FETCH_CRM_COMPANY));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

function requestCrmContact(params) {
  return (dispatch) =>
    Crm.requestCrmContacts(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(crm_contact(data));
        dispatch(crmContactData({ data: data?.data, errors: null }, FETCH_CRM_CONTACTS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function getConnectedCrms(params) {
  return (dispatch) =>
    Crm.requestCrmConnections(params)
      .then((data) => {
        if (!params.fromBoard) {
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(crm_connections(data));
        dispatch(crmConnectedData({ data: data?.data, errors: null }, FETCH_CRM_CONNECTIONS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function fetchCrmStages(params) {
  return (dispatch) =>
    Crm.requestCrmStatus(params)
      .then((data) => {
        if (data) {
          if (data.data.length > 0) {
            dispatch(setMessage('Loading...'));
          } else {
            dispatch(setMessage('No Record(s) found!'));
          }
          dispatch(show(false));
        }
        dispatch(crm_status(data));
        dispatch(crmStatusData({ data: data.data, errors: null }, FETCH_CRM_STATUS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestCrmSync(params) {
  return (dispatch) =>
    Crm.crmFeedback(params)
      .then((data) => {
        if (data) {
          dispatch(showSuccessSnackbar(data.data.details));
          if (data.data.length > 0) {
            dispatch(setMessage('Loading...'));
          } else {
            dispatch(setMessage('No Record(s) found!'));
          }
          dispatch(show(false));
        }
        dispatch(crm_sync(data));
        dispatch(crmSyncData({ data: data.data, errors: null }, CRM_SYNC));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
