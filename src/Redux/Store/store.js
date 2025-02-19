import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import logger from 'redux-logger';
import reducer from '../Reducers';
import config from '../../config';

const middlewares = config.ENABLE_REDUX_LOGGER ? [thunk, logger] : [thunk];
const store = createStore(reducer, applyMiddleware(...middlewares));

export default store;
