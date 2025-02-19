import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardChart from '../components/ChartComponent/DashboardChart';
import requestSingleProject from '../Redux/Actions/single-project';

function GanttView() {
  const pathname = window.location.href;
  const dispatch = useDispatch();
  const projectData = useSelector((state) => state?.singleProjectData);
  const allTasks = projectData?.data?.[0]?.cards;
  let chartData = [];
  allTasks?.forEach((element) =>
    chartData.push({
      task_id: element?.id,
      task_name: element?.title,
      color: element?.task_type_details?.color,
      start_date: element?.start_date,
      end_date: element?.end_date,
      is_completed: element?.is_completed,
      company: element?.buyer_company_details,
      project_value: element?.project_value,
      last_doc: element?.attachments?.length > 0 ? element?.attachments?.[0]?.name : 'NA',
    }),
  );
  useEffect(() => {
    let url = new URL(pathname);
    let board_id = new URLSearchParams(url.search).get('board_id');
    if (pathname.includes('localhost')) {
      dispatch(requestSingleProject({ id: pathname.split(':')[3] }));
    }
    if (pathname.includes('board_id')) {
      dispatch(requestSingleProject({ id: board_id }));
    }
  }, []);
  return (
    <main id="page">
      <div>
        <div style={{ position: 'sticky' }}>
          <h1 className="overview__heading">Gantt View</h1>
        </div>
      </div>
      <div style={{ height: (chartData || []).length * 50 }}>
        <DashboardChart
          dashboardTasks={chartData || []}
          reducedHeight
        />
      </div>
    </main>
  );
}

export default React.memo(GanttView);
