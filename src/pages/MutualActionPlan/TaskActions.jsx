import ApproveDialog from './ApproveDialog';
import TransferDialog from './TransferDialog';

export default function TaskActions({ task, buyerCompany, refetchTask }) {
  const {
    maap_display_settings = {
      approve: true,
      reassign: true,
    },
  } = task;
  return (
    <div className="mt-4 flex justify-between">
      <ApproveDialog
        disabled={!maap_display_settings.approve}
        task={task}
        refetchTask={refetchTask}
      />
      <TransferDialog
        disabled={!maap_display_settings.reassign || task.is_completed}
        buyerCompany={buyerCompany}
        task={task}
        refetchTask={refetchTask}
      />
    </div>
  );
}
