import { Grid, Paper } from '@mui/material';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createData, findPercentage, getFilteredValues } from '../../Utils';
import BarGraph from './BarGraph';
import GraphForecast from './GraphForecast';
import ProgressGraph from './ProgressGraph';
import { useUserContext } from '../../../context/UserContext';

export default function ForecastCharts({ view }) {
  const { user } = useUserContext();
  const forecast = useSelector((state) => state.forecastData);
  const forecastData = Object.keys(forecast?.data).length > 0 ? forecast?.data?.boards : [];
  const boardPercentageData =
    Object.keys(forecast?.data).length > 0 ? forecast?.data?.board_percentages : [];
  const thisUser = useSelector((state) => state.singleUserData);
  const targetValue = thisUser?.data?.[0] ? thisUser?.data?.[0]?.target_value : user.target_value;
  const onTrackTotals = useMemo(
    () => getFilteredValues(forecastData, 'on track', view),
    [forecast],
  );
  const slippingTotals = useMemo(
    () => getFilteredValues(forecastData, 'slipping', view),
    [forecast],
  );
  const upsideTotals = useMemo(() => getFilteredValues(forecastData, 'upside', view), [forecast]);
  const closedTotals = useMemo(() => getFilteredValues(forecastData, 'closed', view), [forecast]);
  const callingTotals = useMemo(() => onTrackTotals.total + closedTotals.total, [forecast]);

  const graphArr = [
    createData('Slipping', slippingTotals.total, slippingTotals.length, '#ec7d31', 0),
    createData('Upside', upsideTotals.total, upsideTotals.length, '#ffbf00', 30),
    createData('On Track', onTrackTotals.total, onTrackTotals.length, '#91cf51', 70),
    createData('Closed', closedTotals.total, closedTotals.length, '#37b7db', 100),
  ];

  const circularGraphArr = [
    createData('Calling', callingTotals, '#37b7db', findPercentage(callingTotals, targetValue), 0),
    createData(
      'UpSide',
      upsideTotals.total,
      '#ffbf00',
      findPercentage(upsideTotals.total, targetValue),
      upsideTotals.length,
    ),
    createData(
      'Slipping',
      slippingTotals.total,
      '#ec7d31',
      findPercentage(slippingTotals.total, targetValue),
      slippingTotals.length,
    ),
  ];

  const percentages = [];
  const slippingArr = [];
  const upSideArr = [];
  const onTrackArr = [];
  const closedArr = [];
  useMemo(() => {
    boardPercentageData?.forEach((element) => {
      percentages.push(element?.[0]?.perc);
      let slipping = element?.[0]?.breakdown?.filter((item) => item.status === 'slipping');
      let upSide = element?.[0]?.breakdown?.filter((item) => item.status === 'upside');
      let onTrack = element?.[0]?.breakdown?.filter((item) => item.status === 'on track');
      let closed = element?.[0]?.breakdown?.filter((item) => item.status === 'closed');
      slipping?.forEach((slip) => {
        slippingArr.push(slip?.value);
      });
      upSide?.forEach((up) => {
        upSideArr.push(up?.value);
      });
      onTrack?.forEach((on) => {
        onTrackArr.push(on?.value);
      });
      closed?.forEach((close) => {
        closedArr.push(close.value);
      });
    });
  }, [boardPercentageData]);

  const barGraphArr = [
    createData('Slipping', slippingArr),
    createData('Upside', upSideArr),
    createData('On Track', onTrackArr),
    createData('Closed', closedArr),
  ];
  const isData =
    slippingArr?.length > 0 ||
    upSideArr?.length > 0 ||
    onTrackArr?.length > 0 ||
    closedArr?.length > 0
      ? true
      : false;

  return (
    <Paper
      elevation={3}
      component="div"
      className="cardheight"
    >
      <p className="app-color text-centre font-bold-24">
        {view === 'monthly_view' ? 'MONTHLY VIEW' : 'FORECAST'}
      </p>
      <Grid
        container
        direction="row"
        spacing={1}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={5}
        >
          <GraphForecast data={graphArr} />
        </Grid>
        <Grid
          key={0}
          className="d-flex-justify"
          item
          xs={12}
          sm={12}
          md={12}
          lg={2}
        >
          <div>
            {circularGraphArr?.map((item) => (
              <ProgressGraph
                key={item.name}
                name={item.name}
                value={item.value}
                pathColor={item.value1}
                percent={item.value2}
                board={item.value3}
                closedValue={closedTotals.total}
                onTrackValue={onTrackTotals.total}
                target={targetValue}
              />
            ))}
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={5}
        >
          <BarGraph
            data={barGraphArr}
            xaxis={percentages}
            isData={isData}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
