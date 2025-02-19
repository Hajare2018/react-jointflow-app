import { Button, Checkbox, DialogActions, IconButton, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  AddCommentOutlined,
  CheckCircleOutline,
  CommentRounded,
  ImportExport,
  InfoOutlined,
  RadioButtonCheckedOutlined,
  RefreshOutlined,
  ReorderOutlined,
} from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestTaskSteps, updateTaskSteps } from '../../Redux/Actions/task-info';
import AddStepForm from './Components/AddStepForm';
import { ReactInlineEdit, ReactMultilineEdit } from '../ReactEditableComponents';
import { show } from '../../Redux/Actions/loader';
import { formatDateTime } from '../Utils';
import ArchiveIcon from '../../assets/icons/archive.png';
import ArchiveDanger from '../../assets/icons/archive_danger.png';
import { Alert } from '@mui/material';
import ConfirmDialog from './Components/ConfirmDialog';
import OptionsModal from '../Documents/TemplatesLibrary/OptionsModal';
import AppButton from './Components/AppButton';
import editTaskData from '../../Redux/Actions/update-task-info';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { reorder } from '../Workload/helper';
import { useUserContext } from '../../context/UserContext';

const useStyles = makeStyles({
  draggingListItem: {
    background: 'rgb(235,235,235)',
  },
});

function Steps({ forTemplates, forTaskType, taskTypeId, toClose, fromTaskEditor }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const showPrompt = useSelector((state) => state.dialog);
  const prompt_data = useSelector((state) => state.populatedFromType);
  const loader = useSelector((state) => state.showLoader);
  const singleTask = useSelector((state) => state.singleCardData);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data?.[0] : [];
  const taskSteps = useSelector((state) => state.taskStepData);
  let steps_data = taskSteps?.data?.length > 0 ? taskSteps?.data : [];
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [addItem, setAddItem] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const { user: currentUser } = useUserContext();
  const [steps, setSteps] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!fromTaskEditor) {
      doRefresh();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (steps_data?.length > 10) {
      scrollToBottom();
    }
    if (steps_data?.length > 0) {
      setSteps(steps_data);
    } else {
      setSteps(null);
    }
  }, [taskSteps]);

  const doRefresh = () => {
    dispatch(
      requestTaskSteps({
        id: forTaskType ? taskTypeId : singleTaskData?.id,
        fetchByTaskType: forTaskType,
      }),
    );
  };

  const handleItemClick = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };
  const handleCheck = (event, card) => {
    dispatch(show(true));
    const formData = new FormData();
    formData.append('check', event.target.checked ? 'True' : 'False');
    event.target.checked && formData.append('completed_at', new Date().toISOString());
    event.target.checked && formData.append('completed_by', currentUser?.id);
    dispatch(
      updateTaskSteps({
        data: formData,
        id: card,
        card: forTaskType ? taskTypeId : singleTaskData?.id,
        board: singleTaskData?.board,
        isType: forTaskType,
      }),
    );
  };
  const handleAddStep = () => {
    setAddItem(!addItem);
  };
  const handleInlineValue = (value, id) => {
    dispatch(show(true));
    const formData = new FormData();
    formData.append(
      forTaskType ? 'task_type' : 'card',
      forTaskType ? taskTypeId : singleTaskData?.id,
    );
    formData.append('label', value);
    dispatch(
      updateTaskSteps({
        data: formData,
        id: id,
        card: forTaskType ? taskTypeId : singleTaskData?.id,
        isType: forTaskType,
      }),
    );
  };
  const handleMultiLineValue = (value, id) => {
    dispatch(show(true));
    const formData = new FormData();
    formData.append(
      forTaskType ? 'task_type' : 'card',
      forTaskType ? taskTypeId : singleTaskData?.id,
    );
    formData.append('comment', value);
    dispatch(
      updateTaskSteps({
        data: formData,
        id: id,
        card: forTaskType ? taskTypeId : singleTaskData?.id,
        isType: forTaskType,
      }),
    );
  };

  const handleOpen = (step) => {
    setData(step);
    setOpen(true);
  };

  const handleConfirmDialog = (e) => {
    if (e.close) {
      handleArchive(data?.archived ? 'False' : 'True', data?.id);
    } else {
      setOpen(false);
    }
  };

  const handleArchive = (value, id) => {
    dispatch(show(true));
    const formData = new FormData();
    formData.append(
      forTaskType ? 'task_type' : 'card',
      forTaskType ? taskTypeId : singleTaskData?.id,
    );
    formData.append('archived', value);
    dispatch(
      updateTaskSteps({
        data: formData,
        id: id,
        card: forTaskType ? taskTypeId : singleTaskData?.id,
        isType: forTaskType,
      }),
    );
    if (!loader.show) {
      setOpen(false);
    }
  };
  const { user: parsedData } = useUserContext();
  const handleCompleted = () => {
    dispatch(
      editTaskData({
        id: singleTaskData?.id,
        board: singleTaskData?.board,
        owner: parsedData?.id,
        is_completed: singleTaskData?.is_completed ? 'False' : 'True',
        actual_completion_date: singleTaskData?.is_completed
          ? null
          : new Date()?.toJSON()?.slice(0, 10)?.replace(/-/g, '-'),
        last_update_type: singleTaskData?.is_completed ? 'Task re-opened' : 'Task Approved',
        task_info: true,
      }),
    );
  };

  const onDragEnd = ({ destination, source }) => {
    if (!destination) return;
    const newItems = reorder(steps, source.index, destination.index);
    setSteps(newItems.result);
  };

  const savePriorities = () => {
    let priorities = [];
    let final = Object.keys(steps_data)
      .filter((index) => steps_data[index] !== steps[index])
      .map((index) => steps[index]);
    final?.forEach((element) => {
      let finalIndices = steps.map((x) => x.id).indexOf(element.id);
      priorities.push({
        step_id: element.id,
        order_number: finalIndices + 1,
      });
    });
    dispatch(
      updateTaskSteps({
        steps: priorities,
        card: forTaskType ? taskTypeId : singleTaskData?.id,
        reorderSteps: true,
        isType: forTaskType,
      }),
    );
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
    <div className="taskWrap">
      <div
        className="inner-div-step p-3"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-table">
            {(provided) => (
              <>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {(steps || [])?.map((step, index) => (
                    <Draggable
                      draggableId={step.id.toString()}
                      index={index}
                      key={step.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={step?.id}
                          className={
                            snapshot.isDragging
                              ? `${classes.draggingListItem} d-flex-column hover-bg`
                              : 'd-flex-column hover-bg'
                          }
                        >
                          <div className="d-flex justify-space-between">
                            <div className="d-flex flex-8">
                              {!forTemplates ? (
                                <Checkbox
                                  checked={step?.check}
                                  onChange={(event) => {
                                    handleCheck(event, step?.id);
                                  }}
                                  style={{ color: '#627daf' }}
                                />
                              ) : (
                                <RadioButtonCheckedOutlined className="ml-3" />
                              )}
                              <ReactInlineEdit
                                value={step?.label}
                                setValue={(value) => handleInlineValue(value, step?.id)}
                                checked={step?.check}
                                charLength="355"
                                useTextArea
                              />
                            </div>
                            <div className="justify-centre">
                              {!forTemplates && (
                                <>
                                  {step?.comment == '' ? (
                                    <Tooltip
                                      title="Add comment"
                                      placement="top"
                                    >
                                      <IconButton onClick={() => handleItemClick(index)}>
                                        <AddCommentOutlined />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip
                                      title="Show comment"
                                      placement="top"
                                    >
                                      <IconButton onClick={() => handleItemClick(index)}>
                                        <CommentRounded />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  <Tooltip
                                    placement="left"
                                    title={
                                      <Alert severity={'info'}>
                                        <ul>
                                          <li>
                                            <strong>Created by:</strong>{' '}
                                            {step?.created_by_details?.first_name +
                                              ' ' +
                                              step?.created_by_details?.last_name +
                                              ' at ' +
                                              formatDateTime(
                                                new Date(step.created_at),
                                                'ddd h:mmtt d MMM yyyy',
                                              )}
                                          </li>
                                          <li>
                                            <strong>Last Modified by:</strong>{' '}
                                            {step?.last_modified_by_details?.first_name +
                                              ' ' +
                                              step?.last_modified_by_details?.last_name +
                                              ' at ' +
                                              formatDateTime(
                                                new Date(step.modified_at),
                                                'ddd h:mmtt d MMM yyyy',
                                              )}
                                          </li>
                                          {step?.completed_by_details !== null && (
                                            <li>
                                              <strong>Completed by:</strong>{' '}
                                              {step?.completed_by_details?.first_name +
                                                ' ' +
                                                step?.completed_by_details?.last_name +
                                                ' at ' +
                                                formatDateTime(
                                                  new Date(step.completed_at),
                                                  'ddd h:mmtt d MMM yyyy',
                                                )}
                                            </li>
                                          )}
                                        </ul>
                                      </Alert>
                                    }
                                  >
                                    <InfoOutlined />
                                  </Tooltip>
                                </>
                              )}
                              <Tooltip title="Archive">
                                <IconButton onClick={() => handleOpen(step)}>
                                  <img
                                    src={ArchiveIcon}
                                    onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                                    onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                                    style={{ width: 20, height: 20 }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <ReorderOutlined className="mr-3" />
                            </div>
                          </div>
                          {!forTemplates && (
                            <div>
                              {expandedIndex === index && (
                                <ReactMultilineEdit
                                  value={step?.comment}
                                  text={'Type comment here...'}
                                  setValue={(value) => handleMultiLineValue(value, step?.id)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </>
            )}
          </Droppable>
        </DragDropContext>
        <div className="d-flex justify-space-between">
          <strong />
          {!addItem && (
            <div>
              <IconButton onClick={doRefresh}>
                <RefreshOutlined />
              </IconButton>
              <Button
                variant="text"
                style={{
                  backgroundColor: '#f2f2f2',
                  color: '#222222',
                  textTransform: 'none',
                }}
                onClick={handleAddStep}
              >
                + Add an Item
              </Button>
              <Button
                variant="text"
                style={{
                  backgroundColor: '#627daf',
                  color: '#f2f2f2',
                  textTransform: 'none',
                  marginLeft: 10,
                }}
                onClick={savePriorities}
              >
                <ImportExport color="inherit" />
                Save Priorities
              </Button>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
        {addItem && (
          <AddStepForm
            card={forTaskType ? taskTypeId : singleTaskData?.id}
            hideForm={handleAddStep}
            forTaskType={forTaskType}
            steps_count={steps?.length}
          />
        )}
      </div>
      {!forTemplates && !forTaskType && (
        <div className="footerBar">
          <DialogActions>
            <AppButton
              onClick={toClose}
              greyButton
              buttonText={'Close'}
              className={'close'}
            />
            <AppButton
              onClick={handleCompleted}
              contained={!isDisabled}
              greyButton={isDisabled}
              disabled={isDisabled}
              buttonIcon={<CheckCircleOutline />}
              buttonText={singleTaskData?.is_completed ? 'Re-open task' : 'Mark as Complete'}
              tooltip={
                isDisabled ? 'Previous task must be completed first' : 'Mark this task complete'
              }
              className={'mark-as-complete'}
            />
          </DialogActions>
        </div>
      )}
      {open && (
        <ConfirmDialog
          open={open}
          handleClose={handleConfirmDialog}
          dialogTitle={'Archive Step'}
          dialogContent={'Are you sure you want to remove this Step?'}
        />
      )}
      <OptionsModal
        open={showPrompt?.show}
        cardData={singleTaskData}
        optionData={prompt_data?.data}
        doNothing
      />
    </div>
  );
}

export default React.memo(Steps);
