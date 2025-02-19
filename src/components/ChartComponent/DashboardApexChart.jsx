import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import toggleIcon from '../../assets/icons/Calendar32.png';
import timerIcon from '../../assets/icons/timer.svg';
import { addOneDay, getDuration } from '../Utils';

function DashboardApexChart({ dashboardTasks, height, forTemplates, lightView }) {
  const [toggleQuarter, setToggleQuarter] = useState(false);
  const [toggleTimer, setToggleTimer] = useState(false);
  dashboardTasks.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  let newArr = [];
  let filteredArr = [];
  let ongoingDelayArr = [];
  dashboardTasks.forEach((element) => {
    if (element.is_completed) {
      newArr.push({
        task_id: element.task_id,
        task_name: element.task_name,
        start_date: addOneDay(new Date(element.end_date)),
        end_date: element.actual_completion_date,
        actual_completion_date: element.actual_completion_date,
        is_completed: 'Completion Delay',
        last_doc: element?.last_doc,
        task_timing: element?.task_timing,
        color: '#FF6966',
      });
    }
    if (element.end_date < new Date().toISOString().slice(0, 10) && !element.is_completed) {
      ongoingDelayArr.push({
        task_id: element.task_id,
        task_name: element.task_name,
        start_date: element.end_date,
        end_date: new Date().toISOString().slice(0, 10),
        actual_completion_date: element.actual_completion_date,
        is_completed: 'Ongoing delay',
        last_doc: element?.last_doc,
        task_timing: element?.task_timing,
        color: '#FF6966',
      });
    }
    if (element.actual_completion_date < element.end_date) {
      filteredArr.push({
        task_id: element.task_id,
        task_name: element.task_name,
        start_date: addOneDay(new Date(element.actual_completion_date)),
        end_date: element.end_date,
        actual_completion_date: element.actual_completion_date,
        is_completed: 'Early Completion',
        last_doc: element?.last_doc,
        task_timing: element?.task_timing,
        color: '#8AE2AF',
      });
    }
  });
  const mergedArr = [...dashboardTasks, ...newArr, ...ongoingDelayArr, ...filteredArr];
  const chartData = {
    series: [
      {
        name: 'Tasks',
        data: (toggleTimer ? mergedArr : lightView ? dashboardTasks : dashboardTasks)?.map(
          (task) => ({
            x: task?.task_name + ' (id# ' + task?.task_id + ')',
            y: [
              new Date(task?.start_date + 'T00:00:00').getTime(),
              new Date(task?.end_date + 'T23:59:59').getTime(),
            ],
            fillColor: task?.color,
            name: task?.task_name,
            id: ' (id# ' + task?.task_id + ')',
            start_date: task?.start_date,
            end_date: task?.end_date,
            doc: task?.last_doc?.name,
            offset: task?.offset,
            status: task?.is_completed,
            task_type: task?.task_type,
            pre_assigned: task?.pre_assigned,
            goals: [
              {
                name: 'Today',
                value: !forTemplates ? new Date().getTime() : '',
                strokeColor: '#CD2F2A',
              },
              {
                name: 'Quarter End',
                value:
                  !forTemplates &&
                  (toggleQuarter ? new Date(moment().endOf('quarter').calendar()).getTime() : ''),
                strokeColor: toggleQuarter ? '#6385b7' : '',
              },
            ],
          }),
        ),
      },
    ],
    options: {
      chart: {
        type: 'rangeBar',
        id: 'ganttChart',
        toolbar: {
          show: !forTemplates ? true : false,
          tools: {
            download: true,
            customIcons: [
              {
                icon: `<img src=${timerIcon} style="margin:2px;"/>`,
                index: 0,
                title: 'Toggle Early/Late view',
                click: function (_chart, _options, _e) {
                  setToggleTimer(!toggleTimer);
                },
              },
              {
                icon: `<img src=${toggleIcon} style="margin:2px;"/>`,
                index: 0,
                title: 'Enable Quarter View',
                click: function (_chart, _options, _e) {
                  setToggleQuarter(!toggleQuarter);
                },
              },
            ],
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '50%',
          distributed: false,
          rangeBarOverlap: true,
          borderRadius: 5,
          rangeBarGroupRows: true,
          dataLabels: {
            hideOverflowingLabels: false,
          },
        },
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opts) {
          var label = opts.w.globals.labels[opts.dataPointIndex];
          var a = moment(val[0]);
          var b = moment(val[1]);
          var diff = b.diff(a, 'days');
          return label + ': ' + diff + (diff > 1 ? ' days' : ' day');
        },
        style: {
          colors: ['#000000', '#000000'],
        },
      },
      fill: {
        opacity: 0.9,
        // type: 'gradient',
        // gradient: {
        //   shade: 'light',
        //   type: 'vertical',
        //   shadeIntensity: 0.5,
        //   inverseColors: true,
        //   opacityFrom: 1,
        //   opacityTo: 1,
        //   stops: [0, 50, 100],
        // },
      },
      xaxis: {
        type: 'datetime',
        lines: {
          show: false,
        },
      },
      annotations: {
        xaxis: [
          !forTemplates
            ? {
                x: new Date().getTime(),
                x2: toggleQuarter
                  ? new Date(moment().endOf('quarter').calendar()).getTime()
                  : new Date().getTime(),
                borderColor: '#CD2F2A',
                fillColor: toggleQuarter ? '#8673b8' : 'rgba(0,0,0,0.3)',
                label: {
                  borderColor: '#8673b8',
                  orientation: 'horizontal',
                  text: toggleQuarter ? 'Today - Quarter End Range' : 'Today',
                },
              }
            : '',
        ],
      },
      tooltip: {
        shared: false,
        intersect: true,
        custom: function ({ seriesIndex, dataPointIndex, w }) {
          var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          if (forTemplates) {
            return (
              `<ul style="background-color:${
                data.fillColor === null ? '#6385b7' : data.fillColor
              }; color:#ffffff; padding:10px;">` +
              `<li><b>${data.name}</b></li>` +
              '<li><b>Task Type: </b> ' +
              data.task_type +
              ' </li>' +
              '<li><b>Offset: </b> ' +
              data.offset +
              ' </li>' +
              '<li><b>Pre-assigned: </b> ' +
              (data.pre_assigned ? 'True' : 'False') +
              ' </li>' +
              '<li><b>Documents: </b> ' +
              (data?.doc == undefined ? 'NA' : data?.doc) +
              '</li>' +
              '</ul>'
            );
          } else {
            return (
              `<ul style="background-color:${
                data.fillColor == null || data.fillColor == undefined ? '#6385b7' : data.fillColor
              }; color:#ffffff; padding:10px;">` +
              `<li><b>${data.name}${
                typeof data.status !== 'string' ? data.id : ' - ' + data.status
              }</b></li>` +
              '<li><b>Dates</b>: ' +
              new Date(data.start_date).toLocaleDateString() +
              ' - ' +
              new Date(data.end_date).toLocaleDateString() +
              '</li>' +
              `<li><b>${
                data.status === 'Completion Delay'
                  ? 'Delay'
                  : data.status === 'Early Completion'
                    ? 'Time saved'
                    : 'Duration'
              }</b>: ` +
              getDuration(new Date(data.end_date), new Date(data.start_date)) +
              ' Days</li>' +
              (typeof data.status !== 'string'
                ? '<li><b>Status</b>: ' +
                  (typeof data.status === 'string'
                    ? data.status
                    : data.status
                      ? 'Completed'
                      : data.start_date > new Date().toJSON().slice(0, 10).replace(/-/g, '-')
                        ? 'Scheduled'
                        : data.start_date <= new Date().toJSON().slice(0, 10).replace(/-/g, '-') &&
                            new Date().toJSON().slice(0, 10).replace(/-/g, '-') < data.end_date
                          ? 'Ongoing'
                          : new Date().toJSON().slice(0, 10).replace(/-/g, '-') >= data.end_date
                            ? 'Overdue'
                            : '') +
                  '</li>' +
                  '<li><b>Last Doc</b>: ' +
                  (data?.doc == undefined ? 'None' : data?.doc) +
                  '</li>' +
                  '</ul>'
                : '')
            );
          }
        },
      },
      yaxis: {
        show: false,
        crosshairs: {
          show: false,
        },
      },
      grid: {
        show: true,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'back',
        row: {
          colors: ['#fafafa', '#fefefe'],
          opacity: 1,
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 7,
        },
      },
    },
  };
  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="rangeBar"
      height={height}
      width={lightView ? '98%' : '100%'}
    />
  );
}
export default React.memo(DashboardApexChart);
