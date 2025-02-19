import { Avatar, Card, CardContent, CardHeader, Divider, Tooltip } from '@mui/material';
import {
  CalendarTodayOutlined,
  CheckCircle,
  Edit,
  MonetizationOnOutlined,
} from '@mui/icons-material';
import React from 'react';
import { FaCalendarAlt, FaFileAlt, FaUserFriends } from 'react-icons/fa';
import { createImageFromInitials, currencyFormatter, dateFormat } from './Utils';
import newTab from '../assets/icons/OpenNewTabIconBlue.png';
import { Link } from 'react-router-dom';
import { Assignees } from './TableComponent';
import progressIcon from '../assets/icons/progress.png';
import bellIcon from '../assets/icons/Bell_Orange32.gif';
import calendarIcon from '../assets/icons/Calendar32.png';
import AttachFile from '../pages/Legal/AttachFile';

function TasksCard({
  cardData,
  openCalendar,
  locale,
  currency,
  handleForm,
  withCalendarIcon,
  legalFilter,
}) {
  const handleOpen = (e) => {
    openCalendar(e);
  };
  return (
    <>
      <Card
        style={{ borderRadius: 8 }}
        elevation={2}
      >
        <CardContent style={{ padding: 0 }}>
          <CardHeader
            style={{ padding: 5 }}
            avatar={
              withCalendarIcon && (
                <Avatar
                  className="liteprofileImg"
                  src={
                    cardData?.buyer_company?.company_image === null
                      ? createImageFromInitials(300, cardData?.buyer_company?.name, '#627daf')
                      : cardData?.buyer_company?.company_image
                  }
                />
              )
            }
            title={
              <div className="d-flex p-0">
                <div style={{ flex: 7 }}>
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
                        handleForm({
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
                          buyer_company: cardData?.buyer_company,
                          color: cardData?.taskColor,
                          owner: cardData?.owner,
                          show_board: withCalendarIcon,
                          board_name: withCalendarIcon && cardData?.board_name,
                          is_legal: {
                            isLegal: legalFilter === 'all',
                            isLegal__completed: legalFilter === 'completed',
                            isLegal__upcoming: legalFilter === 'upcoming',
                          },
                        })
                      }
                    >
                      {cardData?.task_name?.length > 25
                        ? (cardData?.task_name).substring(0, 25 - 3) + '...'
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
                      style={{ height: 12, width: 12, marginLeft: 10 }}
                    />
                  </Link>
                </div>
                {/* <div style={{flex:1}}/> */}
                <div
                  onClick={() =>
                    handleForm({
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
                      buyer_company: cardData?.buyer_company,
                      color: cardData?.taskColor,
                      owner: cardData?.owner,
                      show_board: withCalendarIcon,
                      board_name: withCalendarIcon && cardData?.board_name,
                      is_legal: {
                        isLegal: legalFilter === 'all',
                        isLegal__completed: legalFilter === 'completed',
                        isLegal__upcoming: legalFilter === 'upcoming',
                      },
                    })
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
                  <div className="d-flex">
                    <FaFileAlt style={{ color: '#627daf', width: 18, height: 18 }} />{' '}
                    <p style={{ marginLeft: 5 }}>
                      {cardData?.task_type_name?.length > 15
                        ? (cardData?.task_type_name).substring(0, 15 - 3) + '...'
                        : cardData?.task_type_name}
                    </p>
                  </div>
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
                      internal={cardData?.internal_assignee}
                      external={cardData?.external_assignee}
                      card={cardData?.task_id}
                    />
                    {withCalendarIcon && (
                      <>
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
                            locale,
                            cardData?.project_value === null ? 0 : cardData?.project_value,
                            currency,
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-2 justify-end mt-10">
                  {cardData?.attachment_count === undefined || cardData?.attachment_count === 0 ? (
                    <AttachFile add />
                  ) : (
                    <AttachFile
                      data={cardData?.attachments}
                      count={cardData?.attachment_count}
                    />
                  )}
                </div>
                <div className="d-flex flex-1 justify-end mt-10">
                  {cardData?.task_status ? (
                    <CheckCircle style={{ height: 20, width: 20, color: '#3edab7' }} />
                  ) : cardData?.start_date > new Date().toJSON().slice(0, 10).replace(/-/g, '-') ? (
                    <img
                      src={calendarIcon}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : cardData?.start_date <= new Date().toJSON().slice(0, 10).replace(/-/g, '-') &&
                    new Date().toJSON().slice(0, 10).replace(/-/g, '-') < cardData?.end_date ? (
                    <img
                      src={progressIcon}
                      style={{ height: 20, width: 20 }}
                    />
                  ) : (
                    new Date().toJSON().slice(0, 10).replace(/-/g, '-') >= cardData?.end_date && (
                      <img
                        src={bellIcon}
                        style={{ height: 20, width: 20 }}
                      />
                    )
                  )}
                </div>
              </div>
            }
          />
          <div style={{ padding: `0px 5px 0px 5px` }}>
            <Divider style={{ backgroundColor: '#627daf' }} />
          </div>
          <div className="d-flex p-5">
            <div className="d-flex-row flex-2">
              <FaCalendarAlt
                style={{
                  color: '#627daf',
                  marginRight: 5,
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
            {withCalendarIcon && (
              <div
                className="d-flex flex-1 justify-end"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  handleOpen({
                    title: cardData?.task_name,
                    id: cardData?.task_id,
                    board: cardData?.board_id,
                    internal_assignee: cardData?.internal_assignee?.email,
                    external_assignee: cardData?.external_assignee?.email,
                    owner: cardData?.owner?.email,
                  })
                }
              >
                <CalendarTodayOutlined style={{ color: '#627daf', width: 18, height: 18 }} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default React.memo(TasksCard);
