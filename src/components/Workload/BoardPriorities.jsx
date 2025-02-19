import React, { useEffect } from 'react';
import { withStyles, makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TableBody } from '@mui/material';
import { Button, CircularProgress } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { reorder } from './helper';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import { show } from '../../Redux/Actions/loader';
import DraggableBoards from './DraggableBoards';
import { updateProject } from '../../Redux/Actions/create-project';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
    fontWeight: '700',
    width: 'auto',
    height: 'auto',
    padding: '6px !important',
  },
  body: {
    fontSize: 12,
    height: 40,
    padding: 8,
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

function BoardPriorities({ data }) {
  const dispatch = useDispatch();
  const loader = useSelector((state) => state.showLoader);
  const classes = useStyles();
  const [items, setItems] = React.useState(data);

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
      .filter((index) => data[index] !== items[index])
      .map((index) => items[index]);
    final?.forEach((element) => {
      let finalIndices = items.map((x) => x.id).indexOf(element.id);
      priorities.push({
        board_id: element.id,
        priority: finalIndices + 1,
        last_update_type: `Priority set to ${finalIndices + 1}`,
      });
    });
    dispatch(
      updateProject({
        boards: priorities,
        archivedTemplates: false,
        filterByTemplate: false,
        closedBoards: false,
        showSuccess: true,
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
                      <StyledTableCell align="left">Project Value</StyledTableCell>
                      <StyledTableCell align="left">Owner</StyledTableCell>
                      <StyledTableCell align="left">Target Close Date</StyledTableCell>
                      <StyledTableCell align="left">Progression %</StyledTableCell>
                      <StyledTableCell align="left">Predicted ETA</StyledTableCell>
                      <StyledTableCell align="left">Priority</StyledTableCell>
                      <StyledTableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(items || []).map((row, index) => (
                      <DraggableBoards
                        key={row.id}
                        row={row}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </TableBody>
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
              className="h-5 w-5"
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

export default BoardPriorities;
