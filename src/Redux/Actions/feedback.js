import { createAction } from 'redux-actions';
import { FETCH_FAQS, POST_FEEDBACK, SINGLE_FAQ } from '../Constants/actionTypes';
import * as Feedback from '../../Api/feedback';
import { keepData, show } from './loader';
import { showSuccessSnackbar } from './snackbar';
import feedbackData, { faqsData, singleFaqData } from '../Reducers/feedback';
import { handleError } from '../../components/Utils';

const saveFeedback = createAction(POST_FEEDBACK);
const faqs = createAction(FETCH_FAQS);
const singleFaq = createAction(SINGLE_FAQ);

export default function giveFeedback(params) {
  return (dispatch) =>
    Feedback.saveFeedback(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar('Thank you for your feedback!'));
        }
        dispatch(saveFeedback(data));
        dispatch(feedbackData({ data: data.data, errors: null }, POST_FEEDBACK));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function allFaqs(params) {
  return (dispatch) =>
    Feedback.getFaqs(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(faqs(data));
        dispatch(faqsData({ data: data.data, errors: null }, FETCH_FAQS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function fetchSingleFaq(params) {
  return (dispatch) =>
    Feedback.getSingleFaq(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(singleFaq(data));
        dispatch(singleFaqData({ data: data.data, errors: null }, SINGLE_FAQ));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function addNewFaq(params) {
  return (dispatch) =>
    Feedback.createFaq(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(keepData(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(allFaqs({ all: true }));
        }
        dispatch(singleFaq(data));
        dispatch(singleFaqData({ data: data.data, errors: null }, SINGLE_FAQ));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updateFaq(params) {
  return (dispatch) =>
    Feedback.editFaq(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(keepData(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(allFaqs({ all: true }));
        }
        dispatch(singleFaq(data));
        dispatch(singleFaqData({ data: data.data, errors: null }, SINGLE_FAQ));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
