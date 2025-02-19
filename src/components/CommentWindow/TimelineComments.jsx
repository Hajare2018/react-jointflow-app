import React from 'react';
import Events from './Events';
import CommentBubble from './ReceiverComments';
import { useUserContext } from '../../context/UserContext';

function TimelineComments({
  comments,
  isBuyersComment,
  editComment,
  showComments,
  showEvents,
  forBoards,
}) {
  const { user: parsedData } = useUserContext();
  const buyersComments = comments.filter((item) => item.client_facing === true);
  const onlyComments = comments.filter((item) => item.object_type === 'comment');
  const onlyEvents = comments.filter((item) => item.object_type === 'event');

  return isBuyersComment ? (
    buyersComments.map((item) => (
      <div key={item.id}>
        {item?.object_type === 'comment' &&
          (item.owner_id === parsedData.id ? (
            <CommentBubble
              comment_data={item}
              edit={editComment}
              isCurrentUser
            />
          ) : (
            <CommentBubble
              comment_data={item}
              edit={editComment}
              isAnotherUser
            />
          ))}
        {item?.object_type === 'event' && <Events event={item} />}
      </div>
    ))
  ) : !showComments && !showEvents ? (
    <div className="d-flex justify-centre">
      <h4 style={{ color: 'red', fontSize: 22 }}>Nothing to show!</h4>
    </div>
  ) : (
    (showComments && showEvents
      ? comments
      : showComments
        ? onlyComments
        : showEvents
          ? onlyEvents
          : isBuyersComment
            ? buyersComments
            : ''
    ).map((item) => (
      <div key={item.id}>
        {item?.object_type === 'comment' &&
          (item.owner_id === parsedData.id ? (
            <CommentBubble
              comment_data={item}
              edit={editComment}
              isBoard={forBoards}
              isCurrentUser
            />
          ) : (
            <CommentBubble
              comment_data={item}
              edit={editComment}
              isBoard={forBoards}
              isAnotherUser
            />
          ))}
        {item?.object_type === 'event' && <Events event={item} />}
      </div>
    ))
  );
}

export default React.memo(TimelineComments);
