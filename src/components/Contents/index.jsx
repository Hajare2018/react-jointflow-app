import React from 'react';
import ContentsTable from './ContentsTable';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateContent } from '../../Redux/Actions/dashboard-data';
import { showWarningSnackbar } from '../../Redux/Actions/snackbar';

function Contents({ id, preview, forDashboard, forLibrary }) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.completedData);
  const updateOrder = () => {
    if (orders?.data?.updateOrder) {
      dispatch(updateContent(orders?.data));
    } else {
      dispatch(showWarningSnackbar('Reorder a list item!'));
      return;
    }
  };
  return (
    <Grid
      container
      className="p-3"
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
      >
        <div className="mb-3">
          <div className="d-flex-column editorContainer">
            <div className="board-editor">
              <div
                style={{
                  maxHeight: preview ? '71vh' : forDashboard ? '79vh' : '88vh',
                  overflowY: 'auto',
                }}
              >
                <ContentsTable
                  board={id}
                  isPreview={preview}
                  withLibraryButton={forLibrary}
                />
                <div className="d-flex-row justify-end m-3">
                  <button
                    onClick={updateOrder}
                    className="btn-comment"
                  >
                    Save Ordering
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default React.memo(Contents);
