import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button, CircularProgress } from '@mui/material';
import DraggableRows from './DraggableRows';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { reorder } from './helper';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import editTaskData from '../../Redux/Actions/update-task-info';
import { show } from '../../Redux/Actions/loader';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import requestProject from '../../Redux/Actions/dashboard-data';

const StyledTableCell = withStyles((_theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: '#000000',
    fontWeight: '700',
  },
  body: {
    fontSize: 12,
    height: 40,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: 'calc(100vh - 148px)',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

function WorkloadTable({ data, task_type }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const classes = useStyles();
  const [items, setItems] = React.useState(data);
  const [priorityOrdering, setPriorityOrdering] = useState('');
  const [salesPriorityOrdering, setSalesPriorityOrdering] = useState('asc');
  const [activatePriorityCol, setActivatePriorityCol] = useState(true);
  const [activateSalesPriorityCol, setActivateSalesPriorityCol] = useState(false);

  const handlePriorityOrdering = () => {
    setActivateSalesPriorityCol(false);
    setActivatePriorityCol(true);
    if (priorityOrdering === 'asc') {
      setPriorityOrdering('desc');
      dispatch(
        requestProject({
          task_type__desc_ordering: task_type,
          orderBy: 'priority',
        }),
      );
    } else {
      setPriorityOrdering('asc');
      dispatch(
        requestProject({
          task_type__asc_ordering: task_type,
          orderBy: 'priority',
        }),
      );
    }
  };

  const handleSalesPriorityOrdering = () => {
    setActivatePriorityCol(false);
    setActivateSalesPriorityCol(true);
    if (salesPriorityOrdering === 'asc') {
      setSalesPriorityOrdering('desc');
      dispatch(
        requestProject({
          task_type__desc_ordering: task_type,
          orderBy: 'board__priority',
        }),
      );
    } else {
      setSalesPriorityOrdering('asc');
      dispatch(
        requestProject({
          task_type__asc_ordering: task_type,
          orderBy: 'board__priority',
        }),
      );
    }
  };

  useEffect(() => {
    setItems(data);
  }, [data]);

  const onDragEnd = ({ destination, source }) => {
    if (!destination) return;
    const newItems = reorder(items, source.index, destination.index);
    setItems(newItems.result);
  };

  const savePriorities = () => {
    dispatch(show(true));
    let priorities = [];
    let final = Object.keys(data)
      .filter((index) => data[index] !== items[index].priority)
      .map((index) => items[index]);
    final?.forEach((element, index) => {
      priorities.push({
        card_id: element.id,
        priority: index + 1,
        last_update_type: `Priority set to ${index + 1}`,
      });
    });
    dispatch(
      editTaskData({
        cards: priorities,
        task_type__asc_ordering: task_type,
        fetchByOrder: true,
        orderBy: 'priority',
      }),
    );
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-table">
          {(provided) =>
            loader.show ? (
              <Loader />
            ) : (
              <TableContainer
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={classes.container}
              >
                <Table
                  className={classes.table}
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="left">Name</StyledTableCell>
                      <StyledTableCell align="left">Company</StyledTableCell>
                      <StyledTableCell align="left">Project Name</StyledTableCell>
                      <StyledTableCell align="left">Project Value</StyledTableCell>
                      <StyledTableCell align="left">End Date</StyledTableCell>
                      <StyledTableCell
                        onClick={() => handlePriorityOrdering()}
                        align="center"
                      >
                        Priority
                        {(activatePriorityCol &&
                          ((priorityOrdering === 'desc' && <ArrowDownward />) ||
                            (priorityOrdering === 'asc' && <ArrowUpward />))) || (
                          <ArrowUpward style={{ color: '#aeaeae' }} />
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => handleSalesPriorityOrdering()}
                        align="center"
                      >
                        Sales Priority
                        {(activateSalesPriorityCol &&
                          ((salesPriorityOrdering === 'desc' && <ArrowDownward />) ||
                            (salesPriorityOrdering === 'asc' && <ArrowUpward />))) || (
                          <ArrowUpward style={{ color: '#aeaeae' }} />
                        )}
                      </StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  {(items || []).map((row, index) => (
                    // TODO FIXME
                    // eslint-disable-next-line react/jsx-key
                    <DraggableRows
                      row={row}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </Table>
              </TableContainer>
            )
          }
        </Droppable>
      </DragDropContext>
      <div className={'btm-btn'}>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#627daf',
            color: '#ffffff',
          }}
          onClick={savePriorities}
        >
          {loader.show ? (
            <CircularProgress
              size={15}
              color="inherit"
            />
          ) : (
            'Save Priorities'
          )}
        </Button>
      </div>
    </>
  );
}

export default React.memo(WorkloadTable);
