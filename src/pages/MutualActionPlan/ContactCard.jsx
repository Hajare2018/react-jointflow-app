import { useState } from 'react';
import { PhoneIcon, EnvelopeIcon, PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Avatar } from '../../component-lib/catalyst/avatar';
import { Button } from '../../component-lib/catalyst/button';
import { useUserContext } from '../../context/UserContext';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '../../component-lib/catalyst/dialog';
import { Field, FieldGroup, Label } from '../../component-lib/catalyst/fieldset';
import { Input } from '../../component-lib/catalyst/input';
import { useMutation } from '@tanstack/react-query';
import HttpClient from '../../Api/HttpClient';
import SpinnerIcon from '../../component-lib/icons/Spinner';
import { Tooltip } from '@material-tailwind/react';

export default function ContactCard({ user, enableAddContact, onAddContactClick }) {
  const { user: loggedInUser } = useUserContext();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone_number === 'null' ? '' : user?.phone_number,
  );

  const updateContactMutation = useMutation({
    mutationFn: async () => {
      if (loggedInUser.is_staff) {
        const formData = new FormData();
        formData.append('phone_number', phoneNumber);
        await HttpClient.editUserInfo({
          id: loggedInUser.id,
          data: formData,
        });
      } else {
        await HttpClient.editLiteUser({
          phone_number: phoneNumber,
        });
      }
    },
  });

  if (!user) {
    return (
      <div className="flex shadow-sm border rounded p-2 bg-slate-50 items-center min-h-[52px] h-[52px]">
        <div className="flex-1">
          <h4 className="text-base font-bold text-sm">Not assigned yet</h4>
        </div>
        {enableAddContact && (
          <Button
            plain
            className="sm:text-xs ml-auto my-0.5"
            onClick={onAddContactClick}
          >
            <PlusCircleIcon />
            Add
          </Button>
        )}
      </div>
    );
  }

  const { first_name, last_name, avatar, email, phone_number } = user;

  return (
    <div className="flex shadow-sm border rounded px-2 py-3 bg-slate-50 items-center h-[52px]">
      <div className="mr-4 flex-shrink-0 self-center">
        <Avatar
          className="size-6"
          src={avatar}
          initials={`${first_name[0]}${last_name[0]}`}
        />
      </div>
      <div className="flex-1">
        <h4 className="text-base font-bold text-sm">
          {first_name} {last_name}
        </h4>
      </div>
      <div className="flex justify-self-end items-center">
        <a href={`tel:${phone_number}`}>
          <PhoneIcon className="w-5 h-5" />
        </a>
        <a
          className="ml-1"
          href={`mailto:${email}`}
        >
          <EnvelopeIcon className="w-5 h-5" />
        </a>
        {loggedInUser.id === user.id && (
          <>
            <Tooltip content="Edit details">
              <a
                className="ml-1 cursor-pointer"
                onClick={() => setIsEditOpen(true)}
              >
                <PencilIcon className="w-5 h-w"></PencilIcon>
              </a>
            </Tooltip>
            <Dialog
              open={isEditOpen}
              onClose={setIsEditOpen}
            >
              <DialogTitle>Edit contact</DialogTitle>
              <DialogBody>
                <FieldGroup>
                  <Field>
                    <Label>Phone number</Label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </DialogBody>
              <DialogActions>
                <Button
                  plain
                  onClick={() => setIsEditOpen(false)}
                  disabled={updateContactMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  color="rose"
                  onClick={() => {
                    updateContactMutation.mutate({});
                  }}
                  disabled={updateContactMutation.isPending}
                >
                  {updateContactMutation.isPending && (
                    <SpinnerIcon className="animate-spin w-5 h-5" />
                  )}
                  {updateContactMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
