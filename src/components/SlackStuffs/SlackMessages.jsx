import React from 'react';
import { useSelector } from 'react-redux';
import SlackBubble from './SlackBubble';

function SlackMessages({ user, slack_id }) {
  const slackComments = useSelector((state) => state.slackHistoryData);
  const slack_messages =
    slackComments?.data?.messages?.length > 0 ? slackComments?.data?.messages : [];
  return slack_messages?.map((message) =>
    (
      'metadata' in message
        ? message?.metadata?.event_payload?.user_id == user
        : message?.user == slack_id
    ) ? (
      // TODO FIXME
      // eslint-disable-next-line react/jsx-key
      <SlackBubble
        message_data={message}
        isCurrentUser
      />
    ) : (
      // TODO FIXME
      // eslint-disable-next-line react/jsx-key
      <SlackBubble
        message_data={message}
        isAnotherUser
      />
    ),
  );
}

export default React.memo(SlackMessages);
