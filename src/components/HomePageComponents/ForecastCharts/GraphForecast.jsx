import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { currencyFormatter } from '../../Utils';
import { useTenantContext } from '../../../context/TenantContext';

function GraphForecast({ data }) {
  const { tenante_locale, currency_symbol } = useTenantContext();
  const chartData = {
    series: [
      {
        name: 'Value',
        data: data?.map((item) => ({
          x: [item.name],
          y: [item.value],
        })),
      },
    ],
    options: {
      chart: {
        height: 500,
        type: 'area',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'linear',
          speed: 2000,
          animateGradually: {
            enabled: true,
            delay: 1000,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 1000,
          },
        },
      },
      title: {
        text: 'Forecast Category',
        align: 'center',
        style: {
          fontSize: '16px',
          color: '#666',
        },
      },
      noData: {
        text: data?.[0]?.value1 == 0 && 'No data',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: '14px',
          fontFamily: undefined,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          colorStops: data.map((item) => ({
            color: item.value2,
            opacity: 0.6,
            offset: item.value3,
          })),
          type: 'horizontal',
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: ['#627daf'],
        width: 4,
      },
      xaxis: {
        labels: {
          show: data?.[0]?.value1 == 0 ? false : true,
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return currencyFormatter(tenante_locale, value, currency_symbol);
          },
        },
      },
    },
  };
  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="area"
      height={500}
    />
  );
}

export default React.memo(GraphForecast);
