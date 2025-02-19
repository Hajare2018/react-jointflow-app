import React from 'react';

export default function TestButton({ onClick, children, 'data-testid': dataTestId }) {
  return (
    <button
      style={{ outline: 'none' }}
      onClick={onClick}
      data-testid={dataTestId || 'test-button'}
    >
      {children}
    </button>
  );
}
