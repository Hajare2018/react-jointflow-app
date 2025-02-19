import React from 'react';
import Steps from '../../ProjectForm/Steps';

function TaskTypeSteps({ id }) {
  return (
    <Steps
      forTemplates={false}
      forTaskType={true}
      taskTypeId={id}
    />
  );
}

export default React.memo(TaskTypeSteps);
