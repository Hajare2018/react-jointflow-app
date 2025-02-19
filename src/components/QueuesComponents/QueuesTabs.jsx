import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyTasksTable from '../MyTasksTable';
import ProjectForm from '../ProjectForm/ProjectForm';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import newTab from '../../assets/icons/OpenNewTabIconBlue.png';
import { createImageFromInitials, currencyFormatter } from '../Utils';
import Loader from '../Loader';
import DashboardApexChart from '../ChartComponent/DashboardApexChart';
import QueuesTaskCard from './QueuesTaskCard';
import { requestDocumentsType } from '../../Redux/Actions/documents-type';
import getSingleTask from '../../Redux/Actions/single-task';
import requestSingleProject from '../../Redux/Actions/single-project';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { getComments } from '../../Redux/Actions/comments';
import { getSingleCardDocs } from '../../Redux/Actions/document-upload';
import { requestTaskSteps } from '../../Redux/Actions/task-info';
import { useTenantContext } from '../../context/TenantContext';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: '#eef2f6',
    color: '#000000',
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    height: 50,
    padding: 8,
    whiteSpace: 'nowrap',
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
});

function QueuesTabs({ gantt, table, view, task_type, completed }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const [formData, setFormData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { tenant_locale, currency_symbol } = useTenantContext();

  const handleEditForm = (edit, show) => {
    dispatch(requestDocumentsType());
    dispatch(requestSingleProject({ id: edit?.boardId }));
    dispatch(getAllUsers({ onlyStaff: true }));
    dispatch(getComments({ id: edit?.taskId }));
    dispatch(getSingleCardDocs({ doc_id: edit?.taskId, archived: false }));
    dispatch(
      requestTaskSteps({
        id: edit?.taskId,
        fetchByTaskType: false,
      }),
    );

    dispatch(
      getSingleTask({
        card_id: edit?.taskId,
        board_id: edit?.boardId,
        task_info: true,
      }),
    );
    setFormData(edit);
    setOpen(show);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleEditTask = (e) => {
    setFormData(e);
    setOpen(true);
  };

  return (
    <>
      {loader.show ? (
        <Loader />
      ) : (
        <>
          {view === 'list_view' ? (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <MyTasksTable
                data={table || []}
                locale={tenant_locale}
                currency={currency_symbol}
                handleForm={handleEditForm}
                withCalendarIcon
                hideContacts
                task_type={task_type}
                completed={completed}
              />
            </div>
          ) : view === 'grid_view' ? (
            <Grid
              container
              spacing={2}
            >
              {(table || []).map((task) => (
                // TODO FIXME
                // eslint-disable-next-line react/jsx-key
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={3}
                >
                  <QueuesTaskCard
                    cardData={task}
                    handleForm={handleEditForm}
                  />
                </Grid>
              ))}
            </Grid>
          ) : view === 'gantt_view' ? (
            <Grid
              container
              direction="row"
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={3}
              >
                <div
                  style={{
                    height: '100%',
                  }}
                >
                  <TableContainer className="mt-7">
                    <Table
                      className={classes.table}
                      aria-label="customized table"
                    >
                      <TableBody>
                        {(table || []).map((task) => (
                          <StyledTableRow key={task.task_id}>
                            <StyledTableCell align="left">
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Avatar
                                  src={
                                    task?.company?.company_image
                                      ? task?.company?.company_image
                                      : createImageFromInitials(200, task?.company?.name, '#627daf')
                                  }
                                />
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginLeft: 10,
                                  }}
                                >
                                  <h3
                                    style={{
                                      fontSize: 14,
                                      fontWeight: '700',
                                      color: '#627daf',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                      handleEditTask({
                                        taskName: task?.task_name,
                                        edit: true,
                                        taskId: task?.task_id,
                                        boardId: task?.board_id,
                                        board_name: task?.board_name,
                                        byType: true,
                                        show_board: true,
                                      })
                                    }
                                  >
                                    {task?.task_name?.length > 18
                                      ? (task?.task_name).substring(0, 18 - 3) + '...'
                                      : task?.task_name}
                                  </h3>
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <h2>
                                      {currencyFormatter(
                                        tenant_locale,
                                        task?.project_value === null ? '0' : task?.project_value,
                                        currency_symbol === null ? 'GBP' : currency_symbol,
                                      )}
                                    </h2>
                                    <Link
                                      to={`/board/?id=${task.board}&navbars=True&actions=True&card=${task.id}`}
                                      target="_blank"
                                    >
                                      <Tooltip
                                        title={`Open Project "${task?.board_name}" in new tab`}
                                        arrow
                                        placement="top"
                                      >
                                        <img
                                          src={newTab}
                                          style={{
                                            height: 15,
                                            width: 15,
                                            marginLeft: 10,
                                          }}
                                        />
                                      </Tooltip>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
              <Grid
                className="overflowBox"
                item
                xs={12}
                sm={12}
                md={12}
                lg={9}
              >
                <div
                  id="chart-height"
                  style={{ height: `calc(100% + 37px)` }}
                >
                  <DashboardApexChart
                    dashboardTasks={gantt || []}
                    height={'100%'}
                    forQueues
                  />
                  {/* <TasksChart dashboardTasks={(gantt || [])}/> */}
                </div>
              </Grid>
            </Grid>
          ) : (
            ''
          )}
        </>
      )}
      <ProjectForm
        handleClose={handleClose}
        formData={formData}
        open={open}
        fromComponent="QueuesTab"
        key={formData ? formData?.taskId : 'QueuesTab'}
      />
    </>
  );
}

export default React.memo(QueuesTabs);
