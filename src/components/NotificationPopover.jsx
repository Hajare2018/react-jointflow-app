import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Popover from "@mui/material/Popover";
import { Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  LaunchOutlined,
  NotificationsOutlined,
  MarkChatUnreadOutlined,
  MarkChatReadOutlined,
} from "@mui/icons-material";
import {
  mergeArraysById,
  saveDataToLocalStorage,
  timeAgo,
  updateElementInArray,
} from "./Utils";
import { useDispatch, useSelector } from "react-redux";
import { requestNotifications } from "../Redux/Actions/login";
import getSingleTask from "../Redux/Actions/single-task";
import ProjectForm from "./ProjectForm/ProjectForm";
import { requestDocumentsType } from "../Redux/Actions/documents-type";
import { handleTabsChange } from "../Redux/Actions/tab-values";
import { getAllUsers } from "../Redux/Actions/user-info";
import { getComments } from "../Redux/Actions/comments";
import { getSingleCardDocs } from "../Redux/Actions/document-upload";
import { requestTaskSteps } from "../Redux/Actions/task-info";
import { SidebarItem, SidebarLabel } from "../component-lib/catalyst/sidebar";
import { Avatar } from "../component-lib/catalyst/avatar";
import { Badge } from "../component-lib/catalyst/badge";

const useStyles = makeStyles(() => ({
  paper: {
    "& .MuiPopover-paper": {
      borderRadius: ".5rem",
    },
  },
}));

function NotificationPopover() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const all_notifications = useSelector((state) => state.notificationsData);
  const notifData =
    all_notifications?.data?.length > 0
      ? all_notifications?.data
      : JSON.parse(localStorage.getItem("all_notifications")) != null
        ? JSON.parse(localStorage.getItem("all_notifications"))
        : [];
  notifData.forEach((item) => {
    item.read_status = false;
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(null);
  const localArr =
    JSON.parse(localStorage.getItem("read_notifs"))?.length > 0
      ? JSON.parse(localStorage.getItem("read_notifs"))
      : [];
  const finalArr = mergeArraysById(notifData, localArr);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(requestNotifications());
  };

  const handleOpenForm = (data) => {
    dispatch(handleTabsChange(2));
    dispatch(requestDocumentsType());
    dispatch(getAllUsers({ onlyStaff: true }));
    dispatch(getComments({ id: data?.taskId }));
    dispatch(getSingleCardDocs({ doc_id: data?.taskId, archived: false }));
    dispatch(
      requestTaskSteps({
        id: data?.taskId,
        fetchByTaskType: false,
      })
    );
    dispatch(
      getSingleTask({
        card_id: data?.taskId,
        board_id: data?.boardId,
        task_info: true,
      })
    );
    setAnchorEl(null);
    setData(data);
    setShowForm(true);
    if (data.read_status) {
      return;
    } else {
      saveDataToLocalStorage({ object_id: data.id, read_status: true });
    }
  };

  const handleOpenInNewTab = (data) => {
    saveDataToLocalStorage({ object_id: data.object_id, read_status: true });
    setAnchorEl(null);
    return window.open(
      `/board/?id=${data.board_id}&navbars=True&actions=True&card=${data.card_id}`,
      "_blank"
    );
  };

  const handleViewAll = () => {
    let all_read_notifs = [];
    all_notifications?.data?.forEach((element) => {
      all_read_notifs.push({
        object_id: element.object_id,
        read_status: true,
      });
    });
    saveDataToLocalStorage(all_read_notifs);
    dispatch(requestNotifications());
  };

  const unread_notifs = finalArr.filter((item) => item.read_status === false);

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    // Check if "read_notifs" exists in localStorage
    const isStorageMissing = !localStorage.getItem("read_notifs");

    if (isStorageMissing) {
      dispatch(requestNotifications());

      // Generate the array and save to localStorage
      const updatedArr = finalArr.map((value) => ({
        object_id: value.object_id,
        read_status: value.read_status,
      }));
      localStorage.setItem("read_notifs", JSON.stringify(updatedArr));
    }
  }, [dispatch, finalArr]);

  return (
    <>
      <SidebarItem onClick={handleClick}>
        <NotificationsOutlined style={{ width: 20, height: 20 }} />
        <SidebarLabel>Notifications </SidebarLabel>
        {unread_notifs?.length !== 0 && (
          <Badge className="ml-auto" color={"rose"}>
            {unread_notifs.length}
          
          </Badge>
        )}
      </SidebarItem>
      <Popover
        id={id}
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 104, left: 256 }}
        onClose={handleClose}
        className={classes.paper}
      >
        <div className="max-w-xl max-h-full">
          <div className="sticky top-0 z-50 bg-zinc-50 d-flex justify-space-between p-5 border-solid border-b border-zinc-200">
            <h3 className="font-bold text-lg">Notifications</h3>
            {unread_notifs?.length > 0 && (
              <Tooltip title="Mark all as read">
                <button onClick={handleViewAll} className="text-rose-500">
                  <MarkChatReadOutlined />
                </button>
              </Tooltip>
            )}
          </div>
          {finalArr?.length === 0 && (
            <div className="flex justify-center items-center p-5 text-zinc-500 font-bold text-xl min-h-96 min-w-96">
              <div>No notifications yet</div>
            </div>
          )}
          {finalArr?.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {finalArr?.map((notification) => {
                return (
                  <li
                    key={notification.object_id}
                    className={clsx(
                      "flex justify-between gap-x-6 p-5",
                      notification.read_status
                        ? "bg-transparent"
                        : "bg-slate-50"
                    )}
                  >
                    <div>
                      <Avatar
                        className="size-8"
                        initials={`${notification.created_by_details.first_name[0]}${notification.created_by_details.last_name[0]}`}
                        src={notification.created_by_details.avatar}
                      />
                    </div>
                    <div className="text-zinc-500">
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          handleOpenForm({
                            edit: true,
                            taskId: notification.card_id,
                            boardId: notification.board_id,
                            id: notification.object_id,
                            read_status: notification.read_status,
                          })
                        }
                      >
                        <span className="text-gray-950">
                          {notification.created_by_details.first_name}{" "}
                          {notification.created_by_details.last_name}
                        </span>{" "}
                        updated{" "}
                        <span className="text-gray-950">
                          {notification.card_title}
                        </span>{" "}
                        on{" "}
                        <span className="text-gray-950">
                          {notification.project_name}
                        </span>
                      </div>
                      <div className="text-zinc-500 text-xs my-2">
                        <Tooltip
                          title={new Date(
                            notification.receivedTime
                          ).toLocaleString()}
                        >
                          <span>
                            {timeAgo(new Date(notification.receivedTime))}
                          </span>
                        </Tooltip>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="mt-2 p-2 border-solid border-l-2 border-orange-200">
                          {notification.message}
                        </div>
                        <div className="flex">
                          <Tooltip
                            title={
                              notification.read_status
                                ? "Mark as unread"
                                : "Mark as read"
                            }
                          >
                            <button
                              className="bg-transparent text-rose-500 mr-2 pt-1"
                              onClick={(event) => {
                                event.stopPropagation();
                                dispatch(requestNotifications());
                                if (notification.read_status) {
                                  const updatedArr = updateElementInArray(
                                    localArr,
                                    notification.object_id,
                                    {
                                      read_status: false,
                                    }
                                  );

                                  localStorage.setItem(
                                    "read_notifs",
                                    JSON.stringify(updatedArr)
                                  );
                                } else {
                                  saveDataToLocalStorage({
                                    object_id: notification.object_id,
                                    read_status: true,
                                  });
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              {notification.read_status ? (
                                <MarkChatUnreadOutlined
                                  style={{ width: 20, height: 20 }}
                                />
                              ) : (
                                <MarkChatReadOutlined
                                  style={{ width: 20, height: 20 }}
                                />
                              )}
                            </button>
                          </Tooltip>
                          <Tooltip title="Open in new tab">
                            <button
                              className="bg-transparent text-rose-500"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOpenInNewTab(notification);
                              }}
                            >
                              <LaunchOutlined
                                style={{ width: 20, height: 20 }}
                              />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        className={`${clsx("w-2 h-2 rounded", notification.read_status ? "" : "bg-rose-500")}`}
                      >
                        &nbsp;
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Popover>
      {showForm && (
        <ProjectForm
          handleClose={handleCloseForm}
          formData={data}
          open={showForm}
          key={data ? data?.taskId : "NotificationPopover"}
        />
      )}
    </>
  );
}

export default React.memo(NotificationPopover);
