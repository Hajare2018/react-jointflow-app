import { Avatar, Card, CardContent, CardHeader, Divider, Tooltip } from '@mui/material';
import {
  CalendarTodayOutlined,
  Edit,
  ImportExportRounded,
  MessageSharp,
  MonetizationOnOutlined,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { FaCalendarAlt, FaFileAlt, FaUserFriends } from 'react-icons/fa';
import { createImageFromInitials, currencyFormatter, dateFormat, getTaskStatus } from '../Utils';
import newTab from '../../assets/icons/OpenNewTabIconBlue.png';
import { Link } from 'react-router-dom';
import { Assignees } from '../MyTasksTable';
import AttachFile from '../../pages/Legal/AttachFile';
import { useDispatch } from 'react-redux';
import { handleTabsChange } from '../../Redux/Actions/tab-values';
import AddToCalendarModal from '../AddToCalendarModal';
import getSingleTask from '../../Redux/Actions/single-task';
import { requestDocumentsType } from '../../Redux/Actions/documents-type';
import { useTenantContext } from '../../context/TenantContext';

function QueuesTaskCard({ cardData, handleForm, showTaskTypes, taskFilter }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const { tenant_locale, currency_symbol } = useTenantContext();
  const dispatch = useDispatch();
  const handleEditTask = (e, tabIndex) => {
    dispatch(handleTabsChange(tabIndex));
    handleForm(e, true);
  };
  const handleOpen = (e) => {
    dispatch(requestDocumentsType());
    dispatch(
      getSingleTask({
        card_id: e?.taskId,
        board_id: e?.boardId,
        task_info: true,
      }),
    );
    setFormData(e);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Card
        style={{ borderRadius: 8 }}
        elevation={2}
      >
        <CardContent style={{ padding: 0 }}>
          <CardHeader
            style={{ padding: 6 }}
            avatar={
              <Tooltip
                title={cardData?.company?.name}
                placement="top"
                arrow
              >
                <Avatar
                  style={{ height: 40, width: 40 }}
                  src={
                    cardData?.company?.company_image === null
                      ? createImageFromInitials(300, cardData?.company?.name, '#627daf')
                      : cardData?.company?.company_image
                  }
                />
              </Tooltip>
            }
            title={
              <div className="d-flex p-0">
                <div className="flex-7">
                  <Tooltip
                    title={cardData?.task_name}
                    placement="top"
                    arrow
                  >
                    <strong
                      style={{
                        cursor: 'pointer',
                        fontWeight: 'bolder',
                        color: '#627daf',
                      }}
                      onClick={() =>
                        handleEditTask(
                          {
                            taskName: cardData?.task_name,
                            taskType: cardData?.task_type,
                            taskTypeName: cardData?.task_type_name,
                            start_date: cardData?.start_date,
                            end_date: cardData?.end_date,
                            description: cardData?.description,
                            edit: true,
                            taskId: cardData?.task_id,
                            boardId: cardData?.board_id,
                            isCompleted: cardData?.task_status,
                            attachments: cardData?.attachments,
                            doc_count: cardData?.attachment_count,
                            comments: cardData?.comments,
                            company_id: cardData?.company,
                            target_close_date: cardData?.target_close_date,
                            assignee_pic: cardData?.assignee_pic,
                            internal_assignee: cardData?.internal_assignee,
                            external_assignee: cardData?.external_assignee,
                            buyer_company: cardData?.company?.name,
                            color: cardData?.taskColor,
                            owner: cardData?.owner,
                            board_name: cardData?.board_name,
                            show_board: true,
                            my_task: {
                              allCards: taskFilter === 'all',
                              completed: taskFilter === 'completed',
                              upcoming: taskFilter === 'upcoming',
                            },
                          },
                          0,
                        )
                      }
                    >
                      {cardData?.task_name?.length > 18
                        ? (cardData?.task_name).substring(0, 18 - 3) + '...'
                        : cardData?.task_name}
                    </strong>
                  </Tooltip>
                </div>
                <div className="d-flex flex-2 justify-end">
                  <Link
                    to={`/board/?id=${cardData.board_id}&navbars=True&actions=True&card=${cardData.task_id}`}
                    target="_blank"
                  >
                    <img
                      alt=""
                      src={newTab}
                      style={{ height: 15, width: 15 }}
                    />
                  </Link>
                </div>
                <div
                  onClick={() =>
                    handleEditTask(
                      {
                        taskName: cardData?.task_name,
                        taskType: cardData?.task_type,
                        taskTypeName: cardData?.task_type_name,
                        start_date: cardData?.start_date,
                        end_date: cardData?.end_date,
                        description: cardData?.description,
                        edit: true,
                        taskId: cardData?.task_id,
                        boardId: cardData?.board_id,
                        isCompleted: cardData?.task_status,
                        attachments: cardData?.attachments,
                        doc_count: cardData?.attachment_count,
                        comments: cardData?.comments,
                        company_id: cardData?.company,
                        target_close_date: cardData?.target_close_date,
                        assignee_pic: cardData?.assignee_pic,
                        internal_assignee: cardData?.internal_assignee,
                        external_assignee: cardData?.external_assignee,
                        buyer_company: cardData?.company?.name,
                        color: cardData?.taskColor,
                        owner: cardData?.owner,
                        show_board: true,
                        board_name: cardData?.board_name,
                        my_task: {
                          allCards: taskFilter === 'all',
                          completed: taskFilter === 'completed',
                          upcoming: taskFilter === 'upcoming',
                        },
                      },
                      0,
                    )
                  }
                  style={{ cursor: 'pointer' }}
                  className="d-flex flex-1 justify-end"
                >
                  <Edit style={{ color: '#627daf' }} />
                </div>
              </div>
            }
            subheader={
              <div className="d-flex">
                <div className="d-flex-column flex-7">
                  {showTaskTypes && (
                    <div className="d-flex">
                      <FaFileAlt style={{ color: '#627daf', width: 18, height: 18 }} />{' '}
                      <p style={{ marginLeft: 10 }}>
                        {cardData?.task_type_name?.length > 25
                          ? (cardData?.task_type_name).substring(0, 25 - 3) + '...'
                          : cardData?.task_type_name}
                      </p>
                    </div>
                  )}
                  <div className="d-flex">
                    <FaUserFriends
                      style={{
                        color: '#627daf',
                        marginRight: 5,
                        width: 18,
                        height: 18,
                      }}
                    />
                    <Assignees
                      external={cardData?.external_assignee}
                      card={cardData?.task_id}
                    />
                    <MonetizationOnOutlined
                      style={{
                        color: '#627daf',
                        margin: '0px 5px 0px 5px',
                        width: 18,
                        height: 18,
                      }}
                    />
                    <p>
                      {currencyFormatter(
                        tenant_locale,
                        cardData?.project_value,
                        currency_symbol === null ? 'GBP' : currency_symbol,
                      )}
                    </p>
                    <ImportExportRounded style={{ color: '#627daf', margin: '0px 0px 0px 5px' }} />
                    <p>{cardData?.board_priority}</p>
                  </div>
                </div>
                <div className="d-flex flex-2 justify-end mt-10">
                  {cardData?.attachment_count == undefined || cardData?.attachment_count === 0 ? (
                    <AttachFile add />
                  ) : (
                    <AttachFile data={cardData?.attachments[0]} />
                  )}
                </div>
                <div className="d-flex flex-1 justify-end mt-10">
                  {getTaskStatus(cardData?.task_status, cardData?.start_date, cardData?.end_date)}
                </div>
              </div>
            }
          />
          <div style={{ padding: `0px 5px 0px 5px` }}>
            <Divider style={{ backgroundColor: '#627daf' }} />
          </div>
          <div className="d-flex-row p-5">
            <div
              style={{
                display: 'flex',
                flex: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FaCalendarAlt
                style={{
                  color: '#627daf',
                  marginRight: 2,
                  width: 18,
                  height: 18,
                }}
              />
              <p style={{ fontSize: '10px !important' }}>
                {dateFormat(new Date(cardData?.start_date)) +
                  ' - ' +
                  dateFormat(new Date(cardData?.end_date))}
              </p>
            </div>
            <div className="d-flex flex-1 justify-space-between">
              <div
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleOpen({
                    title: cardData?.task_name,
                    id: cardData?.task_id,
                    board: cardData?.board_id,
                  })
                }
              >
                <CalendarTodayOutlined style={{ color: '#627daf', width: 18, height: 18 }} />
              </div>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleEditTask(
                    {
                      taskName: cardData?.task_name,
                      taskType: cardData?.task_type,
                      taskTypeName: cardData?.task_type_name,
                      start_date: cardData?.start_date,
                      end_date: cardData?.end_date,
                      description: cardData?.description,
                      edit: true,
                      taskId: cardData?.task_id,
                      boardId: cardData?.board_id,
                      isCompleted: cardData?.task_status,
                      attachments: cardData?.attachments,
                      doc_count: cardData?.attachment_count,
                      comments: cardData?.comments,
                      company_id: cardData?.company,
                      target_close_date: cardData?.target_close_date,
                      assignee_pic: cardData?.assignee_pic,
                      internal_assignee: cardData?.internal_assignee,
                      external_assignee: cardData?.external_assignee,
                      buyer_company: cardData?.company?.name,
                      color: cardData?.taskColor,
                      owner: cardData?.owner,
                      board_name: cardData?.board_name,
                      show_board: true,
                      my_task: {
                        allCards: taskFilter === 'all',
                        completed: taskFilter === 'completed',
                        upcoming: taskFilter === 'upcoming',
                      },
                    },
                    2,
                  )
                }
              >
                <MessageSharp style={{ color: '#627daf', width: 18, height: 18 }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AddToCalendarModal
        open={open}
        data={formData}
        handleClose={handleClose}
      />
    </>
  );
}

export default React.memo(QueuesTaskCard);
