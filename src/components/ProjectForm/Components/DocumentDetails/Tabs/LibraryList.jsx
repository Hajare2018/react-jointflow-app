import React from 'react';
import ClauseLibrary from '../../ClauseLibrary';

function LibraryList({ libraryList }) {
  return (
    <div
      className="flex-3 dialog-height"
      style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '1rem',
      }}
    >
      {libraryList?.map((library) => (
        // TODO FIXME
        // eslint-disable-next-line react/jsx-key
        <ClauseLibrary data={library} />
      ))}
    </div>
  );
}

export default React.memo(LibraryList);
