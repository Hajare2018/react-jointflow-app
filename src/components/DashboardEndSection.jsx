import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alerts from './Alerts';
import ProjectForm from './ProjectForm/ProjectForm';
import { compareArrays, groupBy } from './Utils';
import { reload } from '../Redux/Actions/reload-data';
import { requestTaskSteps } from '../Redux/Actions/task-info';
import getSingleTask from '../Redux/Actions/single-task';
import { fetchProjectsInsight, updateProjectsInsight } from '../Redux/Actions/dashboard-data';
import { RefreshOutlined } from '@mui/icons-material';
import { show } from '../Redux/Actions/loader';
import { getAllUsers } from '../Redux/Actions/user-info';
import { getComments } from '../Redux/Actions/comments';
import { getSingleCardDocs } from '../Redux/Actions/document-upload';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'grey',
    color: theme.palette.common.black,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    borderBottom: 0,
    padding: `5px !important`,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: `67vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `84vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `80vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `37vh`,
    },
  },
});

const useInsightsStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: `79vh`,
    '@media(max-height: 1080px)': {
      maxHeight: `75vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `75vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `71vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `58vh`,
    },
  },
});

function Row({ row }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const handleClose = () => {
    setOpen(false);
  };
  const viewCard = (e) => {
    setFormData(e);
    dispatch(reload({ add: false }));
    dispatch(requestTaskSteps({ id: e?.taskId, fetchByTaskType: false }));
    dispatch(getAllUsers({ onlyStaff: true }));
    dispatch(getComments({ id: e?.taskId }));
    dispatch(getSingleCardDocs({ doc_id: e?.taskId, archived: false }));
    dispatch(
      getSingleTask({
        card_id: e?.taskId,
        board_id: e?.boardId,
        task_info: true,
      }),
    );
    setOpen(true);
  };
  const handleClick = (e) => {
    if (e.data.insight_status !== 'addressed' && e.data.insight_status !== 'obsolete') {
      dispatch(
        updateProjectsInsight({
          board_id: e.data.board,
          id: e.data.id,
          data: {
            insight_status: e.data.insight_status === 'mitigated' ? 'raised' : 'mitigated',
          },
        }),
      );
    } else {
      return;
    }
  };
  return (
    <React.Fragment>
      <StyledTableRow>
        <StyledTableCell
          style={{ backgroundColor: '#EEF2F6', color: '#627daf' }}
          className="d-flex justify-space-between"
        >
          <strong className="app-color ml-1">{row.card_details.task_name}</strong>
          {row.card_details.card !== null && (
            <button
              style={{
                background: 'none',
                marginRight: 10,
              }}
              onClick={() =>
                viewCard({
                  edit: true,
                  taskId: row.card_details.card,
                  boardId: row.card_details.board,
                  taskName: row.card_details.task_name,
                })
              }
            >
              <strong>View</strong>
            </button>
          )}
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell
          style={{ padding: 0 }}
          colSpan={4}
        >
          <Box sx={{ margin: 1 }}>
            <Table
              size="small"
              aria-label="documents"
            >
              <TableBody>
                {(row || []).map((insight) => (
                  // TODO FIXME not sure about the data structure and what can be used as a key
                  // eslint-disable-next-line react/jsx-key
                  <Alerts
                    type={
                      insight.insight_status === 'raised'
                        ? 'errors'
                        : insight.insight_status === 'obsolete'
                          ? 'alerts'
                          : insight.insight_status === 'addressed'
                            ? 'green_flags'
                            : insight.insight_status === 'mitigated'
                              ? 'warnings'
                              : ''
                    }
                    alert={insight}
                    onPress={handleClick}
                  />
                ))}
              </TableBody>
            </Table>
          </Box>
        </TableCell>
      </TableRow>
      <ProjectForm
        handleClose={handleClose}
        formData={formData}
        open={open}
        fromComponent="DashboardEndSection"
        key={formData ? formData?.taskId : 'DashboardEndSection'}
      />
    </React.Fragment>
  );
}

function DashboardEndSection({ forDashboard, id }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const insightsClasses = useInsightsStyles();
  const loader = useSelector((state) => state.showLoader);
  const insightsData = useSelector((state) => state.insightsData);
  const insights = insightsData?.data?.length > 0 ? insightsData?.data : [];
  const raised = insights.filter((item) => item.insight_status === 'raised');
  insights.sort((a, b) => a.card_start_date - b.card_start_date);
  const grouped = groupBy(insights, 'card');
  let arr = Object.keys(grouped).map((item) => grouped[item]);
  let card_data = [];
  let finalArr = [];
  arr.forEach((element) => {
    element.sort((a, b) => a.id - b.id);
    card_data.push(element.reduce((acc, shot) => (acc = acc > shot ? acc : shot), 0));
    finalArr.push(element);
  });
  finalArr.forEach((element, index) => {
    element.card_details = card_data[index];
  });
  finalArr.sort(compareArrays);

  useEffect(() => {}, [insightsData]);
  const doRefresh = () => {
    dispatch(show(true));
    dispatch(fetchProjectsInsight({ board_id: id }));
  };

  return (
    <div>
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          marginTop: 10,
        }}
      >
        {loader.show ? (
          <div className="m-3 text-centre">
            <strong>Re-calculating and loading...</strong>
          </div>
        ) : (
          <>
            <div className="d-flex justify-space-between">
              <h3
                style={{
                  fontSize: 16,
                  margin: 10,
                  position: 'sticky',
                  top: 0,
                  backgroundColor: '#ffffff',
                }}
              >
                Warnings ({isNaN(raised?.length) ? 'Loading...' : raised?.length})
              </h3>
              <div onClick={doRefresh}>
                <RefreshOutlined className="app-color cursor-pointer" />
              </div>
            </div>
            <TableContainer
              className={forDashboard ? insightsClasses.container : classes.container}
            >
              <Table
                className={classes.table}
                aria-label="customized table"
              >
                <TableBody>
                  {finalArr?.map((i) => (
                    // TODO FIXME
                    // eslint-disable-next-line react/jsx-key
                    <Row row={i} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>
    </div>
  );
}

export default React.memo(DashboardEndSection);
