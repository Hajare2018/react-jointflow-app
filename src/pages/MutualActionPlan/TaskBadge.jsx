import { isAfter, isBefore, differenceInDays } from 'date-fns';
import { Badge } from '../../component-lib/catalyst/badge';

export default function TaskBadge({ task }) {
  if (task.is_completed) {
    return <Badge color="green">Completed</Badge>;
  }

  const today = new Date();

  if (isAfter(task.start_date, today)) {
    return <Badge color="blue">Scheduled</Badge>;
  }

  if (isBefore(today, task.end_date)) {
    return <Badge color="orange">Ongoing</Badge>;
  }

  return <Badge color="red">{differenceInDays(today, task.end_date)} days behind</Badge>;
}
