import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProjectForm from './ProjectForm/ProjectForm';
import TableComponent from './TableComponent';
import { useDispatch } from 'react-redux';
import { reload } from '../Redux/Actions/reload-data';
import getSingleTask from '../Redux/Actions/single-task';
import { show } from '../Redux/Actions/loader';
import { requestDocumentsType } from '../Redux/Actions/documents-type';
import { requestTaskSteps } from '../Redux/Actions/task-info';
import { showWarningSnackbar } from '../Redux/Actions/snackbar';
import { getAllUsers } from '../Redux/Actions/user-info';
import { getSingleCardDocs } from '../Redux/Actions/document-upload';

export default function DashboardTable({ tableData, project_data, board, showExtra }) {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState([]);
  const dispatch = useDispatch();

  const handleClickOpen = (e) => {
    dispatch(show(true));
    dispatch(requestDocumentsType());
    setFormData(e);
    if (e.add) {
      dispatch(reload({ add: true }));
    } else if (e.clone) {
      dispatch(reload({ clone: true }));
      dispatch(
        getSingleTask({
          card_id: e.data.taskId,
          board_id: e.data.boardId,
          task_info: true,
        }),
      );
    } else {
      dispatch(reload({ add: false }));
      dispatch(getAllUsers({ onlyStaff: true }));
      dispatch(getSingleCardDocs({ doc_id: e?.taskId, archived: false }));
      dispatch(requestTaskSteps({ id: e?.taskId, fetchByTaskType: false }));
      dispatch(
        getSingleTask({
          card_id: e?.taskId,
          board_id: e?.boardId,
          task_info: true,
        }),
      );
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const path = new URL(window.location.href);
  const isCard = new URLSearchParams(path.search).has('card');
  const card_id = parseInt(new URLSearchParams(path.search).get('card'));
  const board_id = parseInt(new URLSearchParams(path.search).get('id'));
  const is_id_available = project_data?.[0]?.cards?.find((card) => card.id == card_id);
  useEffect(() => {
    if (isCard && is_id_available == undefined) {
      dispatch(showWarningSnackbar('This task is not available. It might be archived.'));
    } else if (isCard && Object.keys(is_id_available)?.length > 0) {
      handleClickOpen({
        edit: true,
        taskId: card_id,
        boardId: board_id,
      });
    } else if (isCard && !Object.keys(is_id_available)?.length) {
      dispatch(showWarningSnackbar('This task is not available. It might be archived.'));
    }
  }, []);

  function getKey() {
    if (formData && formData.taskId) {
      return formData.taskId;
    }

    if (formData && formData.board) {
      return formData.board;
    }

    return 'DashboardTable';
  }
  return (
    <div className="margin-top">
      {tableData.length > 0 ? (
        <div>
          <div id="tasks">
            <TableComponent
              data={tableData}
              project_buyer_company={project_data[0]?.buyer_company_details}
              handleForm={handleClickOpen}
              showExtra={showExtra}
            />
          </div>
          {!project_data.closed && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClickOpen({ add: true, data: board })}
              className="btns"
            >
              + Add New Task
            </Button>
          )}
        </div>
      ) : (
        <div>
          <h4 style={{ color: '#627daf' }}>No Record(s) Found!</h4>
          {!project_data.closed && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClickOpen({ add: true, data: board })}
              className="btns"
            >
              + Add New Task
            </Button>
          )}
        </div>
      )}
      <ProjectForm
        handleClose={handleClose}
        formData={formData}
        open={open}
        fromComponent="DashboardTable"
        key={getKey()}
      />
    </div>
  );
}
