import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Group from './group';
import Navheader from '../navbar/navbar';

const component = TestRenderer.create(
  <MemoryRouter>
    <Group>
      <Navheader />
    </Group>{' '}
  </MemoryRouter>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for leave grooup', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Group>
        <Navheader />
      </Group>{' '}
    </MemoryRouter>
  );
  expect(getByTestId('leavegroup')).toHaveTextContent('Leave Group');
});
