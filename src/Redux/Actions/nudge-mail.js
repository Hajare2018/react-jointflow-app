import { createAction } from 'redux-actions';
import { POST_MAIL, REACTIVATE_LINK, RESET_PASSWORD_MAIL } from '../Constants/actionTypes';
import * as Nudge from '../../Api/nudge-mail';
import singleProjectData from '../Reducers/single-project';
import { show } from './loader';
import { showSuccessSnackbar, showWarningSnackbar } from './snackbar';
import { resetPasswordData } from '../Reducers/nudge-mail';
import { handleError } from '../../components/Utils';

const doNudge = createAction(POST_MAIL);
const doReactivate = createAction(REACTIVATE_LINK);
const sendResetMail = createAction(RESET_PASSWORD_MAIL);

export default function postNudgeData(params) {
  return (dispatch) =>
    Nudge.doNudge(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (data?.status === 200) {
            dispatch(showSuccessSnackbar(data?.data?.details));
          }
          if (data?.status === 299) {
            dispatch(showWarningSnackbar(data?.data?.details));
          }
        }
        dispatch(doNudge(data));
        dispatch(singleProjectData({ data: data.data, errors: null }, POST_MAIL));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function postReactivationData(params) {
  return (dispatch) =>
    Nudge.sendActivationMail(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(doReactivate(data));
        dispatch(singleProjectData({ data: data.data, errors: null }, REACTIVATE_LINK));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function sendResetPasswordMail(params) {
  return (dispatch) =>
    Nudge.sendResetPassMail(params)
      .then((data) => {
        if (data) {
          // dispatch(show(false))
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(sendResetMail(data));
        dispatch(resetPasswordData({ data: data.data, errors: null }, RESET_PASSWORD_MAIL));
      })
      .catch((_error) => {
        // handleError(error, dispatch);
      });
}
