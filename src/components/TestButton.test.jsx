import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, describe, it } from 'vitest';
import TestButton from './TestButton';

describe('TestButton', () => {
  it('renders the children components', async () => {
    render(
      <TestButton onClick={vi.fn()}>
        <div>children</div>
      </TestButton>,
    );

    expect(screen.getByText('children')).toBeInTheDocument();
  });

  it('handles the onClick event', async () => {
    const onClickSpy = vi.fn();

    render(
      <TestButton
        data-testid="testButton"
        onClick={onClickSpy}
      >
        <div>children</div>
      </TestButton>,
    );

    const button = await screen.findByTestId('testButton');

    await userEvent.click(button);

    expect(onClickSpy).toHaveBeenCalled();
  });
});
