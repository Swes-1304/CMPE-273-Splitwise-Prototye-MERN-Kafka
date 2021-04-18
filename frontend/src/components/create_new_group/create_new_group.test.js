import React from 'react';
import { render, cleanup } from '@testing-library/react';
import TestRenderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Createnewgroup from './create_new_group';

const component = TestRenderer.create(
  <MemoryRouter>
    <Createnewgroup />
  </MemoryRouter>
);

// eslint-disable-next-line no-undef
afterEach(cleanup);

it('renders', async () => {
  expect(component.toJSON()).toMatchSnapshot();
});

test('Check for create button', async () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <Createnewgroup />
    </MemoryRouter>
  );
  expect(getByTestId('Create')).toHaveTextContent('Save');
});
