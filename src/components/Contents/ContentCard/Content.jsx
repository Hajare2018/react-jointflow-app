import React from 'react';
import ContentCard from './ContentCard';

function Content({ contents }) {
  return (
    <div
      className="content-app"
      id="progress"
    >
      {contents?.length > 0 ? (
        contents?.map(
          (content) =>
            content.client_visible && (
              <ContentCard
                key={content.id}
                content={content}
              />
            ),
        )
      ) : (
        <div className="text-centre app-color font-bold-24">
          <strong>No shared contents</strong>
        </div>
      )}
    </div>
  );
}

export default React.memo(Content);
