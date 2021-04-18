import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Profilepage from './profile_page';
import Navheader from '../navbar/navbar';

const component = TestRenderer.create(
  <MemoryRouter>
    <Profilepage>
      <Navheader />
    </Profilepage>{' '}
  </MemoryRouter>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('look for save butoon', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Profilepage>
        <Navheader />
      </Profilepage>{' '}
    </MemoryRouter>
  );
  expect(getByTestId('Saveupdates')).toHaveTextContent('Save');
});
