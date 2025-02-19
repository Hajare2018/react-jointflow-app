import React, { useEffect } from 'react';
import Chart from 'react-google-charts';

function ChartComponent({ tasks, view, customStartDate, customEndDate }) {
  const allTasks = tasks.length > 0 ? tasks : [];
  const taskData = [];
  const tasksColor = [];
  const startDate = [];
  const endDate = [];
  allTasks.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  allTasks.forEach((element) => {
    tasksColor.push({
      color: element?.task_type_details?.color,
      dark: element?.task_type_details?.color,
      light: element?.task_type_details?.color,
    });
    taskData.push(element);
  });

  allTasks.forEach((element) => {
    startDate.push(element.start_date);
    endDate.push(element.end_date);
  });

  const editedTasks = allTasks.map((task) => [
    task.id,
    task.title,
    task.title,
    view === 'a'
      ? new Date(
          new Date(task.start_date).getFullYear(),
          new Date(task.start_date).getMonth(),
          new Date(task.start_date).getDate(),
        )
      : view === 'b'
        ? new Date(task.start_date) > new Date()
          ? new Date(
              new Date(task.start_date).getFullYear(),
              new Date(task.start_date).getMonth(),
              new Date(task.start_date).getDate(),
            )
          : new Date()
        : view === 'e'
          ? new Date(
              new Date(task.start_date).getFullYear(),
              new Date(task.start_date).getMonth(),
              new Date(task.start_date).getDate(),
            )
          : view === 'd'
            ? new Date(task.start_date) >=
              new Date(
                new Date(customStartDate).getFullYear(),
                new Date(customStartDate).getMonth(),
                new Date(customStartDate).getDate(),
              )
              ? new Date(
                  new Date(task.start_date).getFullYear(),
                  new Date(task.start_date).getMonth(),
                  new Date(task.start_date).getDate(),
                )
              : new Date(
                  new Date(customStartDate).getFullYear(),
                  new Date(customStartDate).getMonth(),
                  new Date(customStartDate).getDate(),
                )
            : null,
    view === 'a'
      ? new Date(
          new Date(task.end_date).getFullYear(),
          new Date(task.end_date).getMonth(),
          new Date(task.end_date).getDate(),
        )
      : view === 'b'
        ? new Date(task.end_date) > new Date(new Date().setDate(new Date().getDate() + 30))
          ? new Date(
              new Date(new Date().setDate(new Date().getDate() + 30)).getFullYear(),
              new Date(new Date().setDate(new Date().getDate() + 30)).getMonth(),
              new Date(new Date().setDate(new Date().getDate() + 30)).getDate(),
            )
          : new Date(
              new Date(task.end_date).getFullYear(),
              new Date(task.end_date).getMonth(),
              new Date(task.end_date).getDate(),
            )
        : view === 'e'
          ? new Date(
              new Date(task.end_date).getFullYear(),
              new Date(task.end_date).getMonth(),
              new Date(task.end_date).getDate(),
            )
          : view === 'd'
            ? new Date(task.end_date) >
              new Date(
                new Date(customEndDate).getFullYear(),
                new Date(customEndDate).getMonth(),
                new Date(customEndDate).getDate(),
              )
              ? new Date(
                  new Date(customEndDate).getFullYear(),
                  new Date(customEndDate).getMonth(),
                  new Date(customEndDate).getDate(),
                )
              : new Date(
                  new Date(task.end_date).getFullYear(),
                  new Date(task.end_date).getMonth(),
                  new Date(task.end_date).getDate(),
                )
            : null,
    null,
    null,
    null,
  ]);
  useEffect(() => {}, [view]);

  function getHeight() {
    if (document.getElementsByTagName('svg')[0]) {
      document.getElementsByTagName('svg')[0].setAttribute('height', (editedTasks.length + 1) * 35);
      document.getElementsByTagName('svg')[1].setAttribute('height', (editedTasks.length + 1) * 35);
    }
    return (editedTasks.length + 1) * 35;
  }

  return (
    <div
      className="w-100 pr-10"
      id="chart_div"
    >
      <Chart
        height={'100%'}
        width={'100%'}
        // style={{overflow:'auto', minWidth: 1000}}
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
          ...editedTasks,
        ]}
        options={{
          height: getHeight(),
          gantt: {
            trackHeight: 30,
            palette: tasksColor,
            labelStyle: {
              fontSize: 12,
              color: '#757575',
            },
          },
        }}
        rootProps={{ 'data-testid': '2' }}
        chartEvents={[
          {
            eventName: 'error',
            callback: ({ chartWrapper, google }) => {
              const chart = chartWrapper.getChart();
              google.visualization.events.addListener(chart, 'error', (e) => {
                google.visualization.errors.removeError(e.id);
                if (e) {
                  chart.clearChart();
                  // google.visualization.errors.addError(<div></div>, 'There is x tasks in past and y tasks in future!', '', 'background-color: #33ff99; padding: 2px;')
                  chartWrapper.setRefreshInterval(200);
                }
              });
            },
          },
        ]}
      />
    </div>
  );
}

export default ChartComponent;
