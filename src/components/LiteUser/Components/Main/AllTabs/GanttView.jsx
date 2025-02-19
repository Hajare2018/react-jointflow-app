import React from 'react';
import { getDevice } from '../../../../Utils';
import DashboardApexChart from '../../../../ChartComponent/DashboardApexChart';
import { useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';

const container = makeStyles({
  container: {
    height: '75vh',
    maxHeight: `63vh`,
    overflowY: 'auto',
    '@media(max-height: 2160px)': {
      maxHeight: `83vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `68vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `77vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `61vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `52vh`,
    },
  },
});

function GanttView() {
  const classes = container();
  const isMobile = getDevice();
  const liteData = useSelector((state) => state.dashboardLiteData);
  let project = liteData?.data?.length > 0 ? liteData?.data?.[0] : [];
  const tasks = project?.maap_cards?.sort(
    (a, b) => new Date(a.start_date) - new Date(b.start_date),
  );
  let chartData = [];
  (tasks || [])?.forEach((element) => {
    chartData.push({
      task_id: element?.id,
      task_name: element?.title,
      color: element?.task_type_colour,
      start_date: element?.start_date,
      end_date: element?.end_date,
      is_completed: element?.is_completed,
      last_doc: {
        name: element?.attachments?.[element?.attachments?.length - 1]?.name,
      },
    });
  });
  return (
    <div
      className={`card ${!isMobile && 'ml-3'}`}
      style={{ height: '100%' }}
    >
      <div className={classes.container}>
        {chartData?.length > 0 ? (
          <DashboardApexChart
            dashboardTasks={chartData}
            height={'90%'}
            lightView
          />
        ) : (
          <div className="text-centre app-color font-bold-24">
            <strong>No Gantt Chart available to display!</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(GanttView);
