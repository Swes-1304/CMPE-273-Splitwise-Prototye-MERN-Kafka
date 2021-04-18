import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from './dashboard';
import Navheader from '../navbar/navbar';

const component = TestRenderer.create(
  <MemoryRouter>
    <Dashboard>
      <Navheader />
    </Dashboard>{' '}
  </MemoryRouter>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for dashboard header', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Dashboard>
        <Navheader />
      </Dashboard>{' '}
    </MemoryRouter>
  );
  expect(getByTestId('Dashboard')).toHaveTextContent('Dashboard');
});
