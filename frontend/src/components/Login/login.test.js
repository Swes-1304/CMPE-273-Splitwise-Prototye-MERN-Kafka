import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Login from './Login';
import Navheader from '../navbar/navbar';
import rootReducer from '../../reducers/index';

const initialState = {};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware))
);

const component = TestRenderer.create(
  <Provider store={store}>
    <MemoryRouter>
      <Login>
        <Navheader />
      </Login>{' '}
    </MemoryRouter>
  </Provider>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for login butoon', async () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Login>
          <Navheader />
        </Login>{' '}
      </MemoryRouter>
    </Provider>
  );
  expect(getByTestId('login')).toHaveTextContent('Login');
});
