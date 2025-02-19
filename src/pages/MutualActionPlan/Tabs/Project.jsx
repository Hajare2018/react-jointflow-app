import DashboardApexChart from '../../../components/ChartComponent/DashboardApexChart';
import NumberCard from '../NumberCard';

export default function ProjectView({ project }) {
  const today = new Date();
  const completedTasks = project.maap_cards.filter((card) => card.is_completed);
  const delayedTasks = project.maap_cards.filter((card) => today > new Date(card.end_date));
  const ongoingTasks = project.maap_cards.filter(
    (card) => new Date(card.start_date) <= today && today <= new Date(card.end_date),
  );

  const chartData = project.maap_cards.map((card) => ({
    task_id: card?.id,
    task_name: card?.title,
    color: card?.task_type_colour,
    start_date: card?.start_date,
    end_date: card?.end_date,
    is_completed: card?.is_completed,
    last_doc: {
      name: card?.attachments?.[card?.attachments?.length - 1]?.name,
    },
  }));

  return (
    <div className="flex flex-col flex-1 gap-y-8">
      <div className="grid grid-cols-4 gap-x-4 w-full auto-rows-min">
        <NumberCard
          title="Total tasks"
          value={project.maap_cards.length}
          textColor="text-blue-500"
        />
        <NumberCard
          title="Completed tasks"
          value={completedTasks.length}
          textColor="text-green-500"
        />
        <NumberCard
          title="Delayed tasks"
          value={delayedTasks.length}
          textColor="text-orange-500"
        />
        <NumberCard
          title="Ongoing tasks"
          value={ongoingTasks.length}
          textColor="text-grey-500"
        />
      </div>
      <div className="flex-1">
        <DashboardApexChart
          dashboardTasks={chartData}
          lightView
        />
      </div>
    </div>
  );
}
