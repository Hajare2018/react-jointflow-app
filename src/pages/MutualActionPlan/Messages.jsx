import parse from 'html-react-parser';
import { Divider } from '../../component-lib/catalyst/divider';
import { Avatar } from '../../component-lib/catalyst/avatar';
import clsx from 'clsx';
import { Input, InputGroup } from '../../component-lib/catalyst/input';
import { createRef, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';
import { Button } from '../../component-lib/catalyst/button';
import Loader from '../../components/Loader';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { timeAgo } from '../../components/Utils';
import { Tooltip } from '@material-tailwind/react';

export default function Messages({ messages, currentUser, cardId, ownerId, refetchCard }) {
  const [message, setMessage] = useState();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: (comment) => {
      return HttpClient.postComments({
        card: cardId,
        client_facing: 'True',
        comment,
        created_at: new Date().toISOString(),
        isLiteUI: true,
        owner: ownerId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', cardId] });
      refetchCard();
      setMessage('');
    },
  });

  const submitMessage = (event) => {
    event.preventDefault();
    sendMessageMutation.mutate(message);
  };

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const messagesEnd = createRef();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className="bg-neutral-100 shadow-sm border rounded flex flex-col w-80"
      style={{ maxHeight: 750 }}
    >
      <h3 className="text-sm font-bold p-4 text-slate-900">Messages</h3>
      <Divider />
      <div className="px-2 py-4 flex w-full flex-col gap-2 mh-[700px] flex-1 overflow-auto">
        {messages
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((message) => {
            const classes = clsx(
              'flex max-w-[70%] flex-col gap-2 p-2',
              message.owner_id === currentUser.id
                ? 'ml-auto mr-2 bg-blue-600 text-white rounded-l-md rounded-tr-md'
                : 'mr-auto ml-2 bg-zinc-200 text-neutral-900 rounded-r-md rounded-tl-md',
            );
            return (
              <div
                key={message.id}
                className={clsx(
                  'flex items-end',
                  message.owner_id === currentUser.id ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <Tooltip content={message.owner}>
                  <div>
                    <Avatar
                      className="size-6"
                      src={message.image}
                      initials={`${message.owner
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}`}
                    />
                  </div>
                </Tooltip>
                <div className={classes}>
                  <div>{parse(message.comment)}</div>
                  <div className="text-xs italic text-right">
                    {timeAgo(new Date(message.created_at))}
                  </div>
                </div>
              </div>
            );
          })}
        <div
          style={{ float: 'left', clear: 'both' }}
          ref={messagesEnd}
        ></div>
      </div>
      <Divider />
      <div className="p-2 w-full">
        <form
          onSubmit={submitMessage}
          className=""
        >
          <InputGroup>
            <Input
              placeholder="Enter message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={sendMessageMutation.isPending}
            />
            <div className="absolute right-0 top-0">
              {sendMessageMutation.isPending ? (
                <Loader size={24} />
              ) : (
                <Button
                  plain
                  type="submit"
                >
                  <PaperAirplaneIcon className="-rotate-45" />
                </Button>
              )}
            </div>
          </InputGroup>
        </form>
      </div>
    </div>
  );
}
