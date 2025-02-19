import { Paper } from '@mui/material';
import React from 'react';
import AccordionGroup from './AccordionGroup';

function Widget2() {
  return (
    <Paper
      elevation={3}
      component="div"
      style={{ padding: 0 }}
    >
      <div className="mt-2">
        <AccordionGroup />
      </div>
    </Paper>
  );
}

export default React.memo(Widget2);
