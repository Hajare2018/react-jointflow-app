import { Paper } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import TaskByTypeTable from './TaskByTypeTable';

function Widget3() {
  const types = useSelector((state) => state.forecastData);
  const typesData = Object.keys(types?.data).length > 0 ? types?.data?.tasks_by_type : [];
  return (
    <Paper
      elevation={3}
      component="div"
    >
      <div className="text-centre app-color font-bold-24 p-3">
        <strong>OPERATING SPEED</strong>
      </div>
      <div>
        <TaskByTypeTable data={typesData} />
      </div>
    </Paper>
  );
}

export default React.memo(Widget3);
