import React from 'react';
import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import { expect, describe, it } from 'vitest';
import renderProvider from '../test-utils/render-provider';
import Toast from './Toast';

describe('Toast component', () => {
  it('renders the toast message', async () => {
    renderProvider(<Toast />, {
      initialState: {
        snackbar: {
          message: 'Test toast',
          open: true,
          title: '',
          action: null,
          severity: 'success',
        },
      },
    });

    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });
});
