import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { currencyFormatter } from '../../Utils';
import { useTenantContext } from '../../../context/TenantContext';

function BarGraph({ data, xaxis, isData }) {
  const { tenant_locale, currency_symbol } = useTenantContext();
  const chartData = {
    series: data?.map((item) => ({
      name: item.name,
      data: item.value,
    })),
    options: {
      chart: {
        type: 'bar',
        height: 500,
        stacked: true,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1500,
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
        text: 'Closing Completion',
        align: 'center',
        style: {
          fontSize: '16px',
          color: '#666',
        },
      },
      noData: {
        text: 'No data',
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
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          // borderRadius: [5, 5, 5, 5],
          columnWidth: '60%',
        },
      },
      dataLabels: {
        enabled: false,
        total: {
          enabled: true,
          style: {
            fontSize: '13px',
            fontWeight: 900,
          },
        },
      },
      fill: {
        opacity: 0.8,
        colors: ['#ec7d31', '#ffbf00', '#91cf51', '#37b7db'],
      },
      xaxis: {
        categories: xaxis,
        labels: {
          show: isData ? true : false,
          formatter: function (value) {
            return value + '%';
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return currencyFormatter(tenant_locale, value, currency_symbol);
          },
        },
      },
    },
  };
  return (
    <ReactApexChart
      options={chartData.options}
      series={chartData.series}
      type="bar"
      height={500}
    />
  );
}

export default React.memo(BarGraph);
