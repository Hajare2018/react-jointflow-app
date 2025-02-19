import { Avatar } from '@mui/material';
import React from 'react';
import parse from 'html-react-parser';
import { toHTML } from 'slack-markdown';
import { timeAgo } from '../Utils';

function SlackBubble({ message_data, isAnotherUser, isCurrentUser }) {
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
            src={'metadata' in message_data ? message_data?.metadata?.event_payload?.avatar : ''}
          />
        </div>
      )}
      <div
        style={{
          backgroundColor: isCurrentUser ? '#611f69' : '#f2f2f2',
          color: isCurrentUser ? '#f2f2f2' : '#611f69',
          padding: 8,
          borderTopLeftRadius: isCurrentUser ? 10 : 0,
          borderTopRightRadius: isAnotherUser ? 10 : 0,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      >
        <div className="d-flex">
          <p style={{ fontSize: 10, fontWeight: '700' }}>
            {'metadata' in message_data
              ? message_data?.metadata?.event_payload?.name
              : message_data?.user}
          </p>{' '}
          <span className={isCurrentUser ? 'comment_time_user' : 'comment_time_other'}>
            {'metadata' in message_data
              ? timeAgo(new Date(message_data?.metadata?.event_payload?.created_at)?.getTime())
              : ''}{' '}
          </span>
        </div>
        <h4 style={{ fontSize: 14, width: 250, wordWrap: 'break-word' }}>
          {parse(toHTML(message_data?.text))}
        </h4>
      </div>
      {isCurrentUser && (
        <div style={{ marginLeft: 5 }}>
          <Avatar
            style={{ height: 30, width: 30 }}
            src={'metadata' in message_data ? message_data?.metadata?.event_payload?.avatar : ''}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(SlackBubble);
