import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reducer from '../Redux/Reducers';
import { thunk } from 'redux-thunk';

function renderProvider(
  ui,
  {
    initialState = {},
    store = createStore(reducer, initialState, applyMiddleware(thunk)),
    ...renderOptions
  } = {},
) {
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export default renderProvider;
