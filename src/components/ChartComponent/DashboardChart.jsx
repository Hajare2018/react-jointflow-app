import React from 'react';
import Chart from 'react-google-charts';

function DashboardChart({ dashboardTasks, reducedHeight }) {
  const tasksColor = [];
  dashboardTasks.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  dashboardTasks.forEach((element) =>
    tasksColor.push({
      color: element.color,
      dark: element.color,
      light: element.color,
    }),
  );
  const editedDashboardTasks = dashboardTasks.map((task) => [
    task.task_id,
    task.task_name,
    task.task_name,
    new Date(
      new Date(task.start_date).getFullYear(),
      new Date(task.start_date).getMonth(),
      new Date(task.start_date).getDate(),
    ),
    new Date(task.end_date) > new Date(new Date().setDate(new Date().getDate() + 30))
      ? new Date(
          new Date(new Date().setDate(new Date().getDate() + 30)).getFullYear(),
          new Date(new Date().setDate(new Date().getDate() + 30)).getMonth(),
          new Date(new Date().setDate(new Date().getDate() + 30)).getDate(),
        )
      : new Date(
          new Date(task.end_date).getFullYear(),
          new Date(task.end_date).getMonth(),
          new Date(task.end_date).getDate(),
        ),
    0,
    task.is_completed ? 100 : 0,
    0,
  ]);

  return tasksColor?.length > 0 ? (
    <div style={{ height: '100%' }}>
      <Chart
        height={'100%'}
        width={'100%'}
        className="chart-class"
        chartType="Gantt"
        loader={<div>Loading Chart</div>}
        data={[
          [
            { type: 'string', label: 'Task ID' },
            { type: 'string', label: 'Task Name' },
            { type: 'string', label: 'Resource' },
            { type: 'date', label: 'Start Date' },
            { type: 'date', label: 'End Date' },
            { type: 'number', label: 'Duration' },
            { type: 'number', label: 'Status' },
            { type: 'string', label: 'Dependencies' },
          ],
          ...editedDashboardTasks,
        ]}
        options={{
          width: '100%',
          height: 'auto',
          gantt: {
            trackHeight: reducedHeight ? 40 : 80,
            innerGridTrack: { fill: '#ffffff' },
            innerGridDarkTrack: { fill: '#f5f5f5' },
            palette: tasksColor,
            innerGridHorizLine: {
              strokeWidth: 0,
            },
          },
        }}
        rootProps={{ 'data-testid': '2' }}
      />
    </div>
  ) : (
    ''
  );
}

export default DashboardChart;
