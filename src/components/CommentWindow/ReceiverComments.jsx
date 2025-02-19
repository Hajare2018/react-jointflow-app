import { Avatar, IconButton, Tooltip } from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import React from 'react';
import { timeAgo } from '../Utils';
import parse from 'html-react-parser';

function CommentBubble({ comment_data, isCurrentUser, isAnotherUser, edit, isBoard }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      {isAnotherUser && (
        <div style={{ marginRight: 5 }}>
          <Avatar
            style={{ height: 30, width: 30 }}
            src={comment_data.image}
          />
        </div>
      )}

      <div
        style={{
          maxWidth: '80%',
          backgroundColor: isCurrentUser ? '#627daf' : '#f2f2f2',
          color: isCurrentUser ? '#f2f2f2' : '#627daf',
          padding: 8,
          borderTopLeftRadius: isCurrentUser ? 10 : 0,
          borderTopRightRadius: isAnotherUser ? 10 : 0,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <div className="d-flex">
          <p style={{ fontSize: 10, fontWeight: '700' }}>
            {comment_data?.owner === null
              ? 'User'
              : (comment_data?.owner).length > 12
                ? comment_data?.owner?.substring(0, 12 - 3) + '...'
                : comment_data?.owner}
          </p>{' '}
          <span
            className={
              isCurrentUser ? 'comment_time_user ml-2 text-xs' : 'comment_time_other ml-2 text-xs'
            }
          >
            <Tooltip
              title={new Date(comment_data?.created_at).toString()}
              placement="top"
              arrow
            >
              <span>{timeAgo(new Date(comment_data?.created_at)?.getTime())} </span>
            </Tooltip>
            {comment_data?.client_facing && !isBoard && (
              <IconButton onClick={() => edit({ forBuyer: true, data: comment_data })}>
                <Visibility
                  style={{
                    color: isCurrentUser ? '#f2f2f2' : '#627daf',
                    fontSize: 14,
                  }}
                />
              </IconButton>
            )}
            {isCurrentUser && edit && (
              <IconButton onClick={() => edit(comment_data)}>
                <Edit
                  style={{
                    color: isCurrentUser ? '#f2f2f2' : '#627daf',
                    fontSize: 14,
                  }}
                />
              </IconButton>
            )}
          </span>
        </div>
        <div style={{ fontSize: 14, width: 'auto', wordWrap: 'break-word' }}>
          {parse(comment_data.comment)}
        </div>
      </div>

      {isCurrentUser && (
        <div style={{ marginLeft: 5 }}>
          <Avatar
            style={{ height: 30, width: 30 }}
            src={comment_data.image}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(CommentBubble);
