import { Tooltip } from '@material-tailwind/react';
import { Avatar } from '../../../component-lib/catalyst/avatar';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import TransferDialog from '../TransferDialog';

export default function TaskAssignee({ task, buyerCompany, refetchProject }) {
  if (task.assignee_details) {
    return (
      <Tooltip content={`${task.assignee_details.first_name} ${task.assignee_details.last_name}`}>
        <div>
          <Avatar
            src={task.assignee_details.avatar}
            initials={`${task.assignee_details.first_name[0]}${task.assignee_details.last_name[0]}`}
            className="size-6"
          />
        </div>
      </Tooltip>
    );
  }

  if (task.side !== 'internal' && !task.is_completed) {
    return (
      <>
        <TransferDialog
          buyerCompany={buyerCompany}
          task={task}
          refetchTask={refetchProject}
          type="assign"
          button={(buttonProps) => (
            <Tooltip content="Add assignee">
              <a
                className={clsx(
                  'inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1',
                  'outline outline-1 -outline-offset-1 outline-black/[--ring-opacity] dark:outline-white/[--ring-opacity]',
                  'rounded-full *:rounded-full',
                  'bg-white hover:bg-zinc-950/5',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!buttonProps.disabled) {
                    buttonProps.onClick();
                  }
                }}
              >
                <PlusCircleIcon className="w-6 h-6" />
              </a>
            </Tooltip>
          )}
        />
      </>
    );
  }

  return null;
}
