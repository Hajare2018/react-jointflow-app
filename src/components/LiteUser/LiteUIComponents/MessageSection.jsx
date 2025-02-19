import React from 'react';
import CommentBubble from '../../CommentWindow/ReceiverComments';
import { useUserContext } from '../../../context/UserContext';

function MessageSection({ comments }) {
  const { user } = useUserContext();

  return (
    <div
      style={{ maxHeight: 720, overflowY: 'auto' }}
      className="pl-3"
    >
      {comments?.map((item) =>
        item.owner_id == user.id ? (
          <CommentBubble
            key={item.id}
            comment_data={item}
            edit={false}
            isCurrentUser
            isBoard
          />
        ) : (
          <CommentBubble
            key={item.id}
            comment_data={item}
            edit={false}
            isAnotherUser
            isBoard
          />
        ),
      )}
    </div>
  );
}

export default React.memo(MessageSection);
