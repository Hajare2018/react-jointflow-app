import { useSearchParams } from 'react-router-dom';
import { isAfter, isBefore } from 'date-fns';
import clsx from 'clsx';
import { Divider } from '../../../component-lib/catalyst/divider';
import { Badge } from '../../../component-lib/catalyst/badge';
import { getDuration } from '../../../components/Utils';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@material-tailwind/react';
import TaskBadge from '../TaskBadge';
import TaskAssignee from './TaskAssignee';
import { useMutation } from '@tanstack/react-query';
import { useUserContext } from '../../../context/UserContext';
import HttpClient from '../../../Api/HttpClient';

function getDotColor(task) {
  if (task.is_completed) {
    return 'green';
  }

  const today = new Date();

  if (isAfter(task.start_date, today)) {
    return 'blue';
  }

  if (isBefore(today, task.end_date)) {
    return 'orange';
  }

  return 'red';
}

function RoadmapBadge({ duration }) {
  if (duration > 0) {
    return (
      <Badge color="yellow">
        <ExclamationCircleIcon className="w-5 h-5" /> +{duration} days
      </Badge>
    );
  }

  return null;
}

export default function Roadmap({ tasks, project }) {
  const { user } = useUserContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTaskId = parseInt(searchParams.get('task_id'), 10);
  const isUserInternal = user?.is_staff;

  const trackTaskClicks = useMutation({
    mutationFn: async (card) => {
      const formData = new FormData();
      formData.append('board', project?.id);
      formData.append('card', card);
      formData.append('project_title', project?.name);
      formData.append('event_type', 'Task');
      const result = await HttpClient.postTrackingData({ data: formData });

      return result;
    },
  });

  const switchTask = (taskId) => {
    searchParams.set('task_id', taskId);
    setSearchParams(searchParams);
    if (!isUserInternal) {
      trackTaskClicks.mutate(taskId);
    }
  };

  return (
    <div
      className="bg-white shadow-sm border rounded flex flex-col"
      style={{ maxHeight: 794 }}
    >
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-900">Roadmap</h3>
        <RoadmapBadge
          duration={getDuration(project?.board_likely_end_date, project?.target_close_date)}
        />
      </div>
      <Divider />
      <div className="py-4 pl-2 pr-4 max-h-[476px] overflow-auto">
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {tasks
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
            .map((task) => {
              const color = getDotColor(task);
              return (
                <div
                  key={task.id}
                  className="relative flex items-center justify-between group is-active"
                >
                  {/* <!-- Icon --> */}
                  <Tooltip
                    className="bg-transparent"
                    content={<TaskBadge task={task} />}
                  >
                    <div
                      className={clsx(
                        'flex items-center justify-center w-4 h-4 rounded-full border border-white shadow shrink-0',
                        color === 'blue' ? 'bg-blue-500' : '',
                        color === 'orange' ? 'bg-orange-500' : '',
                        color === 'green' ? 'bg-green-500' : '',
                        color === 'red' ? 'bg-red-500' : '',
                      )}
                    ></div>
                  </Tooltip>
                  {/* <!-- Card --> */}
                  <div
                    className={clsx(
                      'w-[calc(100%-2rem)] cursor-pointer p-2 rounded border border-slate-200 shadow-sm',
                      currentTaskId !== task.id ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-200',
                    )}
                    onClick={() => switchTask(task.id)}
                  >
                    <div className="flex items-center justify-between space-x-2">
                      <div>
                        <div className="mb-1 font-bold text-slate-900">{task.title}</div>
                        <time className="font-caveat text-slate-500">{task.display_end_date}</time>
                      </div>
                      <TaskAssignee
                        task={task}
                        buyerCompany={project.buyer_company_details_light}
                        refetchProject={() => {}}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
