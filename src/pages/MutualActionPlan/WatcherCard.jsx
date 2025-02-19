import clsx from 'clsx';
import { Button } from '../../component-lib/catalyst/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '../../component-lib/catalyst/dialog';
import { Field, FieldGroup, Label } from '../../component-lib/catalyst/fieldset';
import { Input } from '../../component-lib/catalyst/input';
import AvatarGroup from './AvatarGroup';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import SpinnerIcon from '../../component-lib/icons/Spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';
import { randomString } from '../../components/Utils';

export default function WatcherCard({
  users,
  enableAddWatcher = true,
  task,
  buyerCompany,
  refetchWatcher,
}) {
  let [isOpen, setIsOpen] = useState(false);
  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');

  const closeDialog = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setIsOpen(false);
  };

  const queryClient = useQueryClient();
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

      const watcherFormData = new FormData();
      watcherFormData.append('card', task.id);
      watcherFormData.append('user_id', userId);
      return HttpClient.postWatchers({
        data: watcherFormData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['card', task.id] });
      refetchWatcher();
      closeDialog();
    },
  });
  const paddingClass = enableAddWatcher ? 'p-2' : 'px-2 py-3';

  return (
    <div
      className={clsx(
        'h-[52px] flex shadow-sm border rounded bg-slate-50 items-center',
        paddingClass,
      )}
    >
      {users.length === 0 ? (
        <div className="flex-1">
          <p className="text-base font-bold text-sm">No watchers yet</p>
        </div>
      ) : (
        <AvatarGroup
          size={6}
          users={users.map((u) => ({
            ...u.assignee_details,
          }))}
        />
      )}
      {enableAddWatcher && (
        <>
          <Button
            plain
            className="sm:text-xs ml-auto my-0.5"
            onClick={() => setIsOpen(true)}
          >
            <PlusCircleIcon />
            Add
          </Button>
          <Dialog
            open={isOpen}
            onClose={setIsOpen}
          >
            <DialogTitle>Add watcher</DialogTitle>
            <DialogBody>
              <FieldGroup>
                <Field>
                  <Label>First name</Label>
                  <Input
                    value={firstName}
                    placeholder="Watcher's first name"
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </Field>
                <Field>
                  <Label>Last name</Label>
                  <Input
                    value={lastName}
                    placeholder="Watcher's last name"
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </Field>
                <Field>
                  <Label>Email</Label>
                  <Input
                    value={email}
                    placeholder="Watcher's email"
                    onChange={(event) => setEmail(event.target.value)}
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
                {transferTaskMutation.isPending ? 'Adding...' : 'Add'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
}
