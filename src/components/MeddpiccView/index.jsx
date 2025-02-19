import React from 'react';
import MeddpiccComponent from './MeddpiccComponent';

function MeddpiccView() {
  return (
    <div>
      <MeddpiccComponent />
    </div>
  );
}

export default React.memo(MeddpiccView);
