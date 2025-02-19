import { CircularProgress } from '@mui/material';
import React from 'react';

export default function Loader({ fullscreen, size = 40 }) {
  if (fullscreen) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center">
      <CircularProgress size={size} />
    </div>
  );
}
