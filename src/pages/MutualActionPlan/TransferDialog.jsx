import { useState } from 'react';
import { Button } from '../../component-lib/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '../../component-lib/catalyst/dialog';
import { Textarea } from '../../component-lib/catalyst/textarea';
import { Field, FieldGroup, Label } from '../../component-lib/catalyst/fieldset';
import { Input } from '../../component-lib/catalyst/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';
import { randomString } from '../../components/Utils';
import SpinnerIcon from '../../component-lib/icons/Spinner';

const dialogMessageValues = {
  transfer: {
    title: 'Transfer',
    inProgress: 'Transferring',
  },
  assign: {
    title: 'Assign',
    inProgress: 'Assigning',
  },
};

export function TransferDialogForm({ setIsOpen, isOpen, buyerCompany, task, refetchTask, type }) {
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');
  let [message, setMessage] = useState('');

  const queryClient = useQueryClient();

  const closeDialog = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setMessage('');
    setIsOpen(false);
  };
  const transferTaskMutation = useMutation({
    mutationFn: async () => {
      let formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('is_active', 'True');
      formData.append('is_staff', 'False');
      formData.append('role', 'buyer');
      formData.append('user_type', 'light');
      formData.append('buyer_company', buyerCompany.id);
      formData.append('email', email);
      formData.append('password', randomString(8));
      let userId;
      try {
        const { data } = await HttpClient.addUser({
          data: formData,
        });

        userId = data.user_id;
      } catch (err) {
        if (err.response && err.response.status === 409) {
          userId = err.response.data.existing_user_id;
        } else {
          throw err;
        }
      }

      const result = HttpClient.updateTask({
        id: task.id,
        external_assignee: userId,
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

  const messages = dialogMessageValues[type];

  return (
    <Dialog
      open={isOpen}
      onClose={setIsOpen}
    >
      <DialogTitle>{messages.title} task</DialogTitle>
      <DialogBody>
        <FieldGroup>
          <Field>
            <Label>First name</Label>
            <Input
              value={firstName}
              placeholder="Assignee's first name"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </Field>
          <Field>
            <Label>Last name</Label>
            <Input
              value={lastName}
              placeholder="Assignee's last name"
              onChange={(event) => setLastName(event.target.value)}
            />
          </Field>
          <Field>
            <Label>Email</Label>
            <Input
              value={email}
              placeholder="Assignee's email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field>
            <Label>Message</Label>
            <Textarea
              value={message}
              placeholder="Transfer message"
              onChange={(event) => setMessage(event.target.value)}
            />
          </Field>
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button
          plain
          onClick={() => closeDialog()}
          disabled={transferTaskMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          color="rose"
          disabled={transferTaskMutation.isPending}
          onClick={() => {
            transferTaskMutation.mutate({});
          }}
        >
          {transferTaskMutation.isPending && <SpinnerIcon className="animate-spin w-5 h-5" />}
          {transferTaskMutation.isPending ? messages.inProgress : messages.title}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function TransferDialog({
  disabled,
  buyerCompany,
  task,
  refetchTask,
  button,
  type = 'transfer',
}) {
  let [isOpen, setIsOpen] = useState(false);

  const messages = dialogMessageValues[type];

  return (
    <>
      {button ? (
        button({
          onClick: () => {
            setIsOpen(true);
          },
          disabled,
        })
      ) : (
        <Button
          color="rose"
          className="w-1/2 ml-2"
          outline
          disabled={disabled}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {messages.title}
        </Button>
      )}
      <TransferDialogForm
        buyerCompany={buyerCompany}
        type={type}
        task={task}
        refetchTask={refetchTask}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
