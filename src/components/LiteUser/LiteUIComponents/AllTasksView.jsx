import { Avatar, Divider, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createImageFromInitials,
  dateFormat,
  getDevice,
  getTaskStatus,
  showTaskStatus,
} from '../../Utils';

const useStyles = makeStyles(() => ({
  avatar: {
    width: 40,
    height: 40,
    '&:hover': {
      transform: 'scale(2.00)',
    },
  },
  container: {
    height: '87vh',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    '@media(max-height: 2160px)': {
      maxHeight: `85.5vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `82.5vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `81vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `77.7vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `72vh`,
    },
  },
}));

function AllTasksView() {
  const classes = useStyles();
  const fullUrl = new URL(window.location.href);
  let search_params = fullUrl.searchParams;
  const task_id = search_params.get('task_id');
  const isTab = search_params.has('tab');
  const [selected, setSelected] = useState(task_id);
  const liteData = useSelector((state) => state.dashboardLiteData);
  let project = liteData?.data?.length > 0 ? liteData?.data?.[0] : [];
  const tasks = project?.maap_cards?.sort(
    (a, b) => new Date(a.start_date) - new Date(b.start_date),
  );
  const total_closed_cards = tasks?.filter((task) => task.is_completed === true);
  const left_cards = tasks?.filter((task) => task.is_completed === false);
  let chartData = [];
  (tasks || [])?.forEach((element) => {
    chartData.push({
      task_id: element?.id,
      task_name: element?.title,
      color: element?.task_type_details?.color,
      start_date: element?.start_date,
      end_date: element?.end_date,
      display_end_date: element?.display_end_date,
      actual_completion_date: element?.actual_completion_date,
      is_completed: element?.is_completed,
      last_doc: element?.last_uploaded_document,
      task_timing: element?.task_timing,
    });
  });
  const handleOpenTask = (e) => {
    // setSelected(e.id);
    localStorage.setItem('selected_id', e.id);
    search_params.set('task_id', e.id);
    fullUrl.search = search_params.toString();
    var new_url = fullUrl.toString();
    window.open(new_url, '_self');
  };
  const id = localStorage.getItem('selected_id');
  const parsed = JSON.parse(id);
  const isMobile = getDevice();

  const handleAssignment = (e) => {
    localStorage.setItem('selected_id', e.id);
    search_params.set('task_id', e.id);
    fullUrl.search = search_params.toString();
    var new_url = fullUrl.toString();
    if (isTab) {
      search_params.set('tab', 2);
      window.open(new_url, '_self');
    } else {
      window.open(new_url + '&tab=2', '_self');
    }
  };

  useEffect(() => {
    setSelected(parsed);
  }, [selected]);
  return (
    <div className={`card gap-3 ${classes.container} ${!isMobile && 'mr-3'}`}>
      {tasks?.length > 0 ? (
        <>
          <div
            className="d-flex justify-space-between"
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#ffffff',
              zIndex: 999,
            }}
          >
            <strong className="app-color font-bold-20 m-2">Project Timeline</strong>
            <>
              <Tooltip
                title={`${(tasks || []).length - total_closed_cards?.length} left`}
                placement="top"
                arrow
              >
                <strong>
                  {left_cards?.length}/{(tasks || [])?.length}
                </strong>
              </Tooltip>
            </>
          </div>
          <Divider variant="fullWidth" />
          <div>
            <Timeline
              sx={{
                width: '100%',
                maxWidth: '100%',
                bgcolor: 'background.paper',
              }}
            >
              {tasks?.map((card, index) => (
                <TimelineItem
                  key={card.id}
                  style={{
                    backgroundColor: selected === card.id ? '#6385b7' : '',
                    color: selected === card.id ? '#ffffff' : '',
                    borderRadius: '0.75rem',
                    padding: selected === card.id ? `0px 10px 0 10px` : `0 10px 0 10px`,
                  }}
                >
                  <TimelineSeparator>
                    {index !== 0 ? <TimelineConnector /> : <div style={{ flexGrow: 1 }} />}
                    <div className="timeline-dot">
                      <Tooltip
                        title={showTaskStatus(card?.is_completed, card?.start_date, card?.end_date)}
                      >
                        {getTaskStatus(card?.is_completed, card?.start_date, card?.end_date)}
                      </Tooltip>
                    </div>
                    {project?.maap_cards?.length - 1 !== index ? (
                      <TimelineConnector />
                    ) : (
                      <div style={{ flexGrow: 1 }} />
                    )}
                  </TimelineSeparator>
                  <div />
                  <TimelineContent style={{ padding: '0px 0px', paddingTop: '10px' }}>
                    <div>
                      <div className="d-flex justify-space-between">
                        <div>
                          <strong
                            onClick={() => handleOpenTask(card)}
                            style={{ cursor: 'pointer' }}
                            className="ml-3"
                          >
                            {card?.title}
                          </strong>
                          <br />
                          <p className="ml-3">
                            {dateFormat(card?.start_date)} -{dateFormat(card?.end_date)}
                          </p>
                        </div>
                        <Tooltip
                          title={
                            card?.assignee_details == null
                              ? 'Assign this task'
                              : card?.assignee_details?.first_name +
                                ' ' +
                                card?.assignee_details?.last_name
                          }
                          placement="right"
                        >
                          {card?.assignee_details == null ? (
                            <Avatar style={{ height: 40, width: 40 }}>
                              <strong
                                onClick={() => handleAssignment(card)}
                                className="add-icon cursor-pointer"
                              >
                                +
                              </strong>
                            </Avatar>
                          ) : (
                            <Avatar
                              className={classes.avatar}
                              src={
                                card?.assignee_details?.avatar == null
                                  ? createImageFromInitials(
                                      200,
                                      card?.assignee_details?.first_name == undefined
                                        ? 'Unassigned'
                                        : card?.assignee_details?.first_name +
                                            ' ' +
                                            card?.assignee_details?.last_name,
                                      '#627daf',
                                    )
                                  : card?.assignee_details?.avatar
                              }
                            />
                          )}
                        </Tooltip>
                      </div>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </>
      ) : (
        <div className="text-centre app-color font-bold-24">
          <strong>No shared tasks</strong>
        </div>
      )}
    </div>
  );
}

export default React.memo(AllTasksView);
