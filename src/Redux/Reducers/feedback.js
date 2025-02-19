import { FETCH_FAQS, POST_FEEDBACK, SINGLE_FAQ } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function feedbackData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case POST_FEEDBACK:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function faqsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FAQS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleFaqData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SINGLE_FAQ:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
