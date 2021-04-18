import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Login from './Login';
import Navheader from '../navbar/navbar';

const component = TestRenderer.create(
  <MemoryRouter>
    <Login>
      <Navheader />
    </Login>{' '}
  </MemoryRouter>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for login butoon', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Login>
        <Navheader />
      </Login>{' '}
    </MemoryRouter>
  );
  expect(getByTestId('login')).toHaveTextContent('Login');
});
