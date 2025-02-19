import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

function GaugeChart({ score }) {
  const scoresArr = [
    score?.m_score === undefined ? 0 : score?.m_score,
    score?.e_score === undefined ? 0 : score?.e_score,
    score?.dc_score === undefined ? 0 : score?.dc_score,
    score?.dp_score === undefined ? 0 : score?.dp_score,
    score?.p_score === undefined ? 0 : score?.p_score,
    score?.i_score === undefined ? 0 : score?.i_score,
    score?.ch_score === undefined ? 0 : score?.ch_score,
    score?.co_score === undefined ? 0 : score?.co_score,
  ];
  const totalScore = scoresArr?.reduce((a, b) => a + b);

  useEffect(() => {}, [score]);
  const data = {
    series: [totalScore * (100 / 24)],
    options: {
      chart: {
        type: 'radialBar',
        offsetY: -5,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: '#e7e7e7',
            strokeWidth: '100%',
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: 0,
              fontSize: 16,
              formatter: function (val) {
                return isNaN(val) ? 0 : Math.trunc(val) + '%';
              },
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
        },
      },
      labels: ['Meddpicc Score'],
    },
  };

  return (
    <ReactApexChart
      options={data.options}
      series={data.series}
      type="radialBar"
      height={'100px'}
      width={100}
    />
  );
}

export default React.memo(GaugeChart);
