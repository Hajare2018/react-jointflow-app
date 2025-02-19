import { useState } from 'react';
import { Button } from '../../component-lib/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '../../component-lib/catalyst/dialog';
import { Textarea } from '../../component-lib/catalyst/textarea';
import { Field, Label } from '../../component-lib/catalyst/fieldset';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';
import SpinnerIcon from '../../component-lib/icons/Spinner';

function getButtonText(completed, pending) {
  if (completed) {
    if (pending) {
      return 'Reopening...';
    }

    return 'Reopen';
  }

  if (pending) {
    return 'Approving...';
  }

  return 'Approve';
}

export default function ApproveDialog({ disabled, task, refetchTask }) {
  let [isOpen, setIsOpen] = useState(false);
  let [message, setMessage] = useState('');

  const queryClient = useQueryClient();
  const approveTaskMutation = useMutation({
    mutationFn: async () => {
      const result = await HttpClient.updateTask({
        id: task.id,
        is_completed: !task.is_completed,
      });

      if (message) {
        return HttpClient.postComments({
          card: task.id,
          client_facing: true,
          comment: message,
          created_at: new Date().toISOString(),
        });
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', task.id] });
      refetchTask();
      closeDialog();
    },
  });

  const closeDialog = () => {
    setMessage('');
    setIsOpen(false);
  };

  const buttonText = getButtonText(task.is_completed, approveTaskMutation.isPending);

  return (
    <>
      <Button
        className="w-1/2 mr-2"
        color="rose"
        disabled={disabled}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {task.is_completed ? 'Reopen' : 'Approve'}
      </Button>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
      >
        <DialogTitle>Update task</DialogTitle>
        <DialogBody>
          <Field>
            <Label>Message</Label>
            <Textarea
              value={message}
              placeholder="Enter a message"
              onChange={(event) => setMessage(event.target.value)}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button
            plain
            onClick={() => closeDialog()}
            disabled={approveTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="rose"
            onClick={() => {
              approveTaskMutation.mutate({});
            }}
            disabled={approveTaskMutation.isPending}
          >
            {approveTaskMutation.isPending && <SpinnerIcon className="animate-spin w-5 h-5" />}
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
