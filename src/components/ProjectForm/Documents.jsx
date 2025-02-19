import { CircularProgress, Grid } from '@mui/material';
import { CheckCircleOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postDocumentData } from '../../Redux/Actions/document-upload';
import { show } from '../../Redux/Actions/loader';
import editTaskData from '../../Redux/Actions/update-task-info';
import DocumentsTemplate from '../Documents/DocumentsLibrary/DocumentsTemplate';
import AppButton from './Components/AppButton';
import DocumentsTable from './Components/DocumentsTable';
import UploadFile from './Components/UploadFile';
import './TaskInfo.css';
import { useUserContext } from '../../context/UserContext';

function Documents({ tableData, toClose }) {
  const [file, setFile] = useState({
    files: [],
  });
  const singleTask = useSelector((state) => state.singleCardData);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data[0] : [];
  const [fileName, setFileName] = useState('');
  const [openLibrary, setOpenLibrary] = useState(false);
  const dispatch = useDispatch();
  const { user: parsedData } = useUserContext();

  const updateUploadedFiles = (files) => {
    setFile({ ...file, files: files });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const documents_data = useSelector((state) => state?.singleCardDocs);

  const handleCompleted = () => {
    dispatch(show(true));
    dispatch(
      editTaskData({
        id: singleTaskData?.id,
        title: singleTaskData?.title,
        start_date: singleTaskData?.start_date,
        end_date: singleTaskData?.end_date,
        description: singleTaskData?.description,
        board: singleTaskData?.board,
        owner: singleTaskData?.owner_details?.id,
        color: singleTaskData?.task_type_details?.color,
        is_completed: singleTaskData?.is_completed ? 'False' : 'True',
        last_updated_type: 'Approved',
        document_type: singleTaskData?.task_type_details?.id,
        fetchAll: tableData?.from_widget,
        fetchByType: tableData?.byType,
        type: tableData?.byType && singleTaskData?.task_type_details?.custom_label,
        filteredTasks: {
          allCards: tableData?.my_task?.allCards,
          completed: tableData?.my_task?.completed,
          upcoming: tableData?.my_task?.upcoming,
        },
        legalTasks: {
          isLegal: tableData?.is_legal?.isLegal,
          isLegal__completed: tableData?.is_legal?.isLegal?.isLegal__completed,
          isLegal__upcoming: tableData?.is_legal?.isLegal?.isLegal__upcoming,
        },
        userId: parsedData.id,
      }),
    );
  };

  const loader = useSelector((state) => state.showLoader);

  const handleUploadFile = () => {
    const formData = new FormData();
    formData.append('name', fileName);
    formData.append('file', file?.files?.newFiles);
    formData.append('board', singleTaskData?.board);
    formData.append('card', singleTaskData?.id);
    formData.append('document_type', singleTaskData?.task_type_details?.id);
    formData.append('created_at', new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
    formData.append('change_percent', 0);
    formData.append('size', file?.files?.newFiles?.size);
    formData.append('version', 0);
    formData.append('created_by', parsedData.id);
    formData.append('is_template', false);
    formData.append('archived', false);
    dispatch(show(true));
    dispatch(
      postDocumentData({
        board_id: singleTaskData?.board,
        card_id: singleTaskData?.id,
        data: formData,
        fetchDocList: true,
        allDocs: false,
      }),
    );
    if (!loader.show) {
      setFile({ files: [] });
    }
  };

  useEffect(() => {
    let file_name = file?.files?.newFiles?.name?.split('.');
    setFileName(file_name && file_name.slice(0, -1).join('.'));
  }, [file]);

  const handleToggleLibrary = () => {
    setOpenLibrary(!openLibrary);
  };

  let isDisabled = false;
  if (singleTaskData?.task_timing === 'Strictly_Sequential') {
    if (!singleTaskData?.ref_task_is_completed) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
  }

  return (
    <>
      <div className="taskWrap hide-scrollbar">
        <div className="inner-div">
          <div style={{ maxHeight: 550, overflowY: 'hidden', marginBottom: 45 }}>
            {loader.show ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </div>
            ) : (
              <DocumentsTable table_data={documents_data?.data} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 5 }}>
              <form onSubmit={handleSubmit}>
                <UploadFile
                  accept="*"
                  label="Upload Documents"
                  updateFilesCb={updateUploadedFiles}
                />
                {file?.files?.newFiles && (
                  <div style={{ width: '100%', marginTop: 70 }}>
                    <div style={{ float: 'left' }}>
                      filename: <strong>{fileName}</strong>
                    </div>
                    <div style={{ float: 'right' }}>
                      <button
                        onClick={handleUploadFile}
                        style={{
                          backgroundColor: '#627daf',
                          color: '#ffffff',
                          borderRadius: 6,
                          padding: 5,
                        }}
                        type="button"
                      >
                        {loader.show ? (
                          <CircularProgress
                            size={10}
                            color={'inherit'}
                          />
                        ) : (
                          'Upload'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ flex: 5 }}>
              {!file?.files?.newFiles && (
                <UploadFile
                  uploadFromLibrary
                  handleFromLibrary={handleToggleLibrary}
                />
              )}
            </div>
          </div>
        </div>
        <div className="footerBar">
          <Grid
            container
            direction="row"
          >
            <Grid
              item
              xs={12}
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <AppButton
                greyButton
                onClick={toClose}
                buttonText={'Close'}
              />
              <div className="ml-3">
                <AppButton
                  contained={!isDisabled}
                  greyButton={isDisabled}
                  disabled={isDisabled}
                  buttonIcon={<CheckCircleOutlined />}
                  buttonText={singleTaskData?.is_completed ? 'Re-open task' : 'Mark as Complete'}
                  tooltip={
                    isDisabled ? 'Previous task must be completed first' : 'Mark this task complete'
                  }
                  onClick={handleCompleted}
                />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <DocumentsTemplate
        open={openLibrary}
        card={singleTaskData?.id}
        handleClose={handleToggleLibrary}
      />
    </>
  );
}

export default React.memo(Documents);
