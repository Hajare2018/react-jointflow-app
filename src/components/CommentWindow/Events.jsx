import {
  AddCommentOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  Comment,
  Create,
  CreateOutlined,
  Drafts,
  Markunread,
  TouchAppOutlined,
} from '@mui/icons-material';
import React from 'react';
import { timeAgo } from '../Utils';

function Events({ event }) {
  return (
    <div className="d-flex justify-centre">
      {event?.target_entity_label === 'EmailSent' && event?.target_event_type === 'Open' ? (
        <Drafts className="app-color" />
      ) : event?.target_entity_label === 'Card' && event?.target_event_type === 'Created' ? (
        <CreateOutlined className="app-color" />
      ) : event?.target_entity_label === 'Comment' && event?.target_event_type === 'Created' ? (
        <AddCommentOutlined className="app-color" />
      ) : event?.target_entity_label === 'Comment' && event?.target_event_type === 'Updated' ? (
        <Comment className="app-color" />
      ) : event?.target_entity_label === 'EmailSent' && event?.target_event_type === 'Click' ? (
        <TouchAppOutlined className="app-color" />
      ) : event?.target_entity_label === 'Document' && event?.target_event_type === 'Download' ? (
        <CloudDownloadOutlined className="app-color" />
      ) : event?.target_entity_label === 'Document' && event?.target_event_type === 'Created' ? (
        <CloudUploadOutlined className="app-color" />
      ) : event?.target_entity_label === 'EmailSent' && event?.target_event_type === 'Created' ? (
        <Markunread className="app-color" />
      ) : event?.target_entity_label === 'Card' && event?.target_event_type === 'Updated' ? (
        <Create className="app-color" />
      ) : (
        ''
      )}
      <h4 style={{ color: '#999', fontSize: 16, marginLeft: 5 }}>
        {event?.target_entity_label === 'EmailSent' ? 'Email' : event?.target_entity_label}{' '}
        <strong>{event?.target_record_label}</strong>{' '}
        {event?.target_entity_label === 'EmailSent' && event?.target_event_type === 'Created'
          ? 'sent'
          : event?.target_entity_label === 'Document' && event?.target_event_type === 'Created'
            ? 'uploaded'
            : event?.target_event_type}{' '}
        {timeAgo(new Date(event?.created_at).getTime())} by {event?.created_by_name}{' '}
        {event?.payload !== null ? '(' + event?.payload + ')' : ''}
      </h4>
    </div>
  );
}

export default React.memo(Events);
