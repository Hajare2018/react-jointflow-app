import { Divider, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { getDevice, groupBy } from '../../../../Utils';
import TaskContent from '../TaskContent';
import Actions from '../Actions';
import DocumentHistory from '../../../LiteUIComponents/DocumentHistory';
import MessageSection from '../../../LiteUIComponents/MessageSection';
import { useSelector } from 'react-redux';

const container = makeStyles({
  container: {
    maxHeight: `63vh`,
    overflowY: 'auto',
    '@media(max-height: 2160px)': {
      maxHeight: `83vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `78vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `77vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `75vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `52vh`,
    },
  },
});

function TaskDetails() {
  const classes = container();
  const isMobile = getDevice();
  const fullUrl = new URL(window.location.href);
  let search_params = fullUrl.searchParams;
  const task_id = search_params.get('task_id');
  const tasks = useSelector((state) => state.singleCardData);
  const liteData = useSelector((state) => state.dashboardLiteData);
  let project = liteData?.data?.length > 0 ? liteData?.data?.[0] : [];
  const taskData = tasks?.data?.length > 0 ? tasks?.data?.[0] : [];
  const activeAttachments =
    taskData?.attachments?.length > 0
      ? taskData?.attachments?.filter(
          (item) => item.archived === false && item.grouping_id !== null,
        )
      : [];
  const groupedDocs = groupBy(activeAttachments, 'grouping_id');
  let arr = Object.keys(groupedDocs).map((item) => groupedDocs[item]);
  let originalDocs = [];
  let finalArr = [];
  arr.forEach((element) => {
    originalDocs.push(element.reduce((acc, shot) => (acc = acc > shot ? acc : shot), 0));
    finalArr.push(element);
  });
  return (
    <div
      className={`card ${!isMobile && 'ml-3'}`}
      style={{ height: '100%' }}
    >
      {Object.keys(taskData).length > 0 ? (
        <Grid
          container
          direction="row"
          className="p-4"
          style={{ height: '100%' }}
        >
          <Grid
            className={classes.container}
            style={{
              borderRight: !isMobile && `1px solid #aeaeae`,
            }}
            item
            xs={12}
            md={8}
            lg={8}
          >
            <TaskContent />
            <div className={!isMobile && 'mr-5'}>
              <Actions />
              <Divider
                variant="fullWidth"
                className="mt-5"
              />
              {finalArr?.length > 0 && <DocumentHistory documents={finalArr} />}
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            lg={4}
          >
            <div className="text-centre font-bold-20">
              <strong>Messages</strong>
            </div>
            <Divider
              variant="fullWidth"
              className="ml-5 mt-5"
            />
            <MessageSection comments={taskData?.external_comments} />
          </Grid>
        </Grid>
      ) : (
        <div className="text-centre app-color font-bold-24">
          {task_id === 0 || project?.maap_cards?.length > 0 ? (
            <strong>Please select a Task for more details.</strong>
          ) : (
            <strong>No shared task details!</strong>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(TaskDetails);
