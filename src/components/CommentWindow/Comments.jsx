import { Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./comments.css";
import TimelineComments from "./TimelineComments";
import {
  editBoardComments,
  editComments,
  postComments,
  saveBoardComments,
} from "../../Redux/Actions/comments";
import { replaceCumulative, saveDataToLocalStorage } from "../Utils";
import ConfirmDialog from "../ProjectForm/Components/ConfirmDialog";
import {
  NotificationsActive,
  NotificationsOffOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { showWarningSnackbar } from "../../Redux/Actions/snackbar";
import { EditorState, convertToRaw } from "draft-js";
import RichTextEditor from "../RichTextEditor/RichTextEditor";
import { convertFromHTML, convertToHTML } from "../RichTextEditor/converters";
import SlackMessages from "../SlackStuffs/SlackMessages";
import { saveSlackMessage } from "../../Redux/Actions/slack-stuffs";
import Loader from "../Loader";
import { useUserContext } from "../../context/UserContext";
//----------------------------------------------------------------
import { requestNotifications } from "../../Redux/Actions/login";

///////////////////start
import { Modifier } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./RichTextEditor.css";
////////////////////////end

function Comments({
  comments,
  timelineComments,
  events,
  taskData,
  buyersComment,
  forBoards,
  forSlack,
  channel,
  clientVisible,
}) {
  const [page, setPage] = useState(1);
  const [newComments, setNewComments] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const [editorStyle, setEditorStyle] = useState("65px");
  const { user: parsedData } = useUserContext();
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [open, setOpen] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [postingComment, setPostingComment] = useState(false);

  ///////////////////////////start
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  ////////////////////////////end

  const onEditorStateChange = (state) => {
    // Convert the editor content to HTML
    const htmlData = convertToHTML(editorState.getCurrentContent());
    // If there's a URL, add it to the htmlData
    if (url) {
      // Example: just appending the URL at the end of the HTML string
      const updatedHtmlData = `${htmlData} <a href="${url}" target="_blank">${url}</a>`;
      setNewComments(updatedHtmlData);
      setUrl(""); // Clear the URL input after appending
    } else {
      setNewComments(htmlData); // If no URL, just update with regular HTML
    }

    setEditorState(state);
  };

  // const onEditorStateChange = (state) => {
  //   // console.log("URLLLLLLL:::::", state);

  //   setEditorState(state);
  //   const htmlData = convertToHTML(state.getCurrentContent());
  //   console.log("newComments-----",newComments)
  //   setNewComments(htmlData);
  // };
  let boardComments = useSelector((state) => state.boardCommentsData);
  let commentResponse = useSelector((state) => state.commentsData);
  let allComments = commentResponse?.data?.events_and_comments;
  let board_comments = boardComments?.data;

  const commentData = forBoards ? board_comments : allComments;
  //----------------------------------------------------------------
  //----------------------------------------------------------------
  const all_notifications = useSelector((state) => state.notificationsData);

  const getNotifsDataByLocalstoarge =
    JSON.parse(localStorage.getItem("read_notifs")) || []; // Parse existing data

  const handleMatchingIds = useCallback(() => {
    if (!commentData || !all_notifications?.data) return;

    const matchedData = commentData.reduce((acc, comment) => {
      const matchingNotification = all_notifications?.data?.find(
        (notification) => comment.object_id === notification?.object_id
      );
      if (matchingNotification) {
        acc.push({
          object_id: comment.object_id,
          read_status: true,
        });
      }
      return acc;
    }, []);

    // Update existing data in localStorage: check if object_id exists and update read_status
    const updatedData = getNotifsDataByLocalstoarge.map((existingItem) => {
      const matchedItem = matchedData.find(
        (newItem) => newItem.object_id === existingItem.object_id
      );
      if (matchedItem && existingItem.read_status === false) {
        return { ...existingItem, read_status: true }; // Update read_status to true
      }
      return existingItem; // Keep existing item unchanged
    });
    // Add new items to the localStorage data if they don't exist
    const newData = matchedData.filter(
      (newItem) =>
        !getNotifsDataByLocalstoarge.some(
          (existingItem) => existingItem.object_id === newItem.object_id
        )
    );
    // Combine updated data with new data
    const finalData = [...updatedData, ...newData];

    // Check if any data has been modified (read_status updated)
    const dataChanged = updatedData.some(
      (item, index) =>
        item.read_status !== getNotifsDataByLocalstoarge[index]?.read_status
    );

    // Only update localStorage if there is a change
    if (dataChanged) {
      localStorage.setItem("read_notifs", JSON.stringify(finalData));
    }
  }, [commentData, all_notifications, getNotifsDataByLocalstoarge]);

  useEffect(() => {
    handleMatchingIds();
  }, [handleMatchingIds, dispatch]);
  useEffect(() => {
    dispatch(requestNotifications());
  }, []);

  const loadMore = () => {
    setPage((page) => page + 1);
  };

  useEffect(() => {
    setPostingComment(false);
    setEditorStyle("65px");
  }, [allComments, board_comments]);

  const loader = useSelector((state) => state.showLoader);
  const lightUsers = useSelector((state) => state.allLightUsersData);
  const light_users_data = lightUsers?.data?.length > 0 ? lightUsers?.data : [];
  const users_data = useSelector((state) => state.allUsersData);
  const staffs_data = users_data?.data?.length > 0 ? users_data?.data : [];
  const allUsers = forBoards
    ? staffs_data
    : staffs_data?.concat(light_users_data);
  const userMentionData =
    allUsers?.length > 0
      ? allUsers?.map((user) => ({
          text: user?.first_name + " " + user?.last_name,
          value: user?.first_name + "_" + user?.last_name,
          url: user?.id,
        }))
      : [];

  const createComments = () => {
    setPostingComment(true);
    const entityMap = convertToRaw(editorState.getCurrentContent()).entityMap;
    const mentions = [];
    const mentioned_users_id = [];
    Object.values(entityMap).forEach((entity) => {
      if (entity.type === "MENTION") {
        mentions.push(entity.data);
      }
    });
    mentions?.forEach((element) => {
      mentioned_users_id.push({ id: element.url });
    });
    if (newComments === "<p></p>") {
      dispatch(showWarningSnackbar("Please Enter Your Comment!"));
      return;
    } else {
      let newContent = newComments;
      let str = "";
      str = newContent.split("@").join("<strong>@");
      let splitted = str.split(" ");
      let filtered = splitted.filter((split) => split.startsWith("<strong>@"));
      let newArr = [];
      filtered.forEach((element) => {
        newArr.push(element.concat("</strong>"));
      });
      const formData = new FormData();
      console.log("formData", formData);

      if (forSlack) {
        formData.append("board_id", (taskData || {})?.board_id);
        formData.append("channel", channel);
        formData.append(
          "html_message",
          replaceCumulative(str, filtered, newArr)
        );
        dispatch(
          saveSlackMessage({
            data: formData,
            slack_channel_id: channel,
          })
        );
      }
      if (forBoards) {
        dispatch(
          saveBoardComments({
            data: {
              board: (taskData || {})?.board_id,
              comment: replaceCumulative(str, filtered, newArr),
              mentions: getMentionedUsersId(editorState),
              comment_type: "BoardComment",
            },
            board_id: (taskData || {})?.board_id,
          })
        );
      }
      if (timelineComments) {
        dispatch(
          postComments({
            card: (taskData || {}).taskId,
            owner: parsedData?.id,
            comment: replaceCumulative(str, filtered, newArr),
            coaching: true,
            client_visible: clientVisible,
            mentions: getMentionedUsersId(editorState),
            client_facing: isChecked,
            notify_buyer: isNotify,
            created_at: new Date().toISOString(),
          })
        );
      }
      if (!loader.show) {
        const contentState = convertFromHTML("<p></p>");
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        setNewComments("<p></p>");
        if (isChecked) {
          setIsChecked(!isChecked);
        }
        if (isNotify) {
          setIsNotify(false);
        }
        setPage(1);
      }
    }
  };

  const doEditComments = (e) => {
    if (e.forBuyer) {
      setOpen(true);
      setEditData(e.data);
    } else {
      if (e.comment.includes("@")) {
        let splitted = e.comment.split("<strong>").join("");
        let finalComment = splitted.split("</strong>").join("");
        setEditData(e);
        const contentState = convertFromHTML(finalComment);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        const htmlData = convertToHTML(editorState.getCurrentContent());
        setNewComments(htmlData);
        setEdit(true);
        setIsChecked(e.client_facing);
        setIsNotify(e.notify_buyer);
      } else {
        setEditData(e);
        setEdit(true);
        const contentState = convertFromHTML(e.comment);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        const htmlData = convertToHTML(editorState.getCurrentContent());
        setNewComments(htmlData);
        setIsChecked(e.client_facing);
        setIsNotify(e.notify_buyer);
      }
    }
  };

  const handleUpdate = () => {
    setPostingComment(true);
    const formData = new FormData();
    let newContent = newComments;
    let str = "";
    str = newContent.split("@").join("<strong>@");
    let splitted = str.split(" ");
    let filtered = splitted.filter((split) => split.startsWith("<strong>@"));
    let newArr = [];
    filtered.forEach((element) => {
      newArr.push(element.concat("</strong>"));
    });
    if (timelineComments) {
      const requestBody = {
        comment: replaceCumulative(str, filtered, newArr),
        card: editData?.card,
        owner: editData?.owner_id,
        coaching: editData?.coaching,
        client_visible: clientVisible,
        mentions: getMentionedUsersId(editorState),
        client_facing: isChecked,
        notify_buyer: isNotify,
        modified_at: new Date().toISOString(),
      };
      dispatch(
        editComments({ id: editData?.id, page: page, data: requestBody })
      );
    }
    if (forBoards) {
      formData.append("board", (taskData || {})?.board_id);
      formData.append("comment", replaceCumulative(str, filtered, newArr));
      dispatch(
        editBoardComments({
          data: formData,
          board_id: (taskData || {})?.board_id,
          comment_id: editData?.id,
        })
      );
    }
    if (!loader.show) {
      const contentState = convertFromHTML("<p></p>");
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
      setNewComments("<p></p>");
      if (isChecked) {
        setIsChecked(!isChecked);
      }
      if (isNotify) {
        setIsNotify(false);
      }
      setPage(1);
      setNewComments("");
      setEdit(false);
    }
  };

  const handleClientFacing = (e) => {
    if (e.close) {
      const requestBody = {
        comment: editData?.comment,
        card: editData?.card,
        owner: editData?.owner_id,
        coaching: editData?.coaching,
        client_facing: false,
        modified_at: new Date().toISOString(),
      };
      dispatch(
        editComments({ id: editData?.id, page: page, data: requestBody })
      );
      if (!loader.show) {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };
  const path = window.location.href;
  const isUrlIncludesTasks = path.includes("tasks");

  //////////////////////////
  // Open Modal to Add Link
  const openLinkModal = () => {
    setIsModalOpen(true);
  };

  // Handle Adding the Link
  const addLink = () => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // Create a new link entity
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    // Apply the link to the selected text
    const contentStateWithLink = Modifier.applyEntity(
      contentStateWithEntity,
      selection,
      entityKey
    );

    const newEditorState = EditorState.push(
      editorState,
      contentStateWithLink,
      "apply-entity"
    );
    onEditorStateChange();
    setEditorState(newEditorState);
    setUrl("");
    setIsModalOpen(false);
  };

  // Custom Toolbar Configuration
  const toolbar = {
    options: ["inline", "list", "emoji", "link"],
    inline: {
      inDropdown: false,
      component: undefined,
      dropdownClassName: undefined,
      options: ["bold", "italic", "underline", "strikethrough"],
      italic: { className: undefined },
      underline: { className: undefined },
    },
    link: {
      options: ["link"],
      component: () => (
        <button
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={openLinkModal} 
        >
          
          <i
            className="fa fa-link"
            style={{ fontSize: "24px", cursor: "pointer" }}
          ></i>
        </button>
      ),
    },
  };
  /////////////////////////

  return (
    <>
      <div
        className={`mt-2 ${isUrlIncludesTasks ? "page-comment" : "comment"}`}
      >
        <div
          style={{
            display: postingComment ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
          }}
        >
          <p style={{ color: "white", marginBottom: 8 }}>Posting comment...</p>
          <Loader />
        </div>
        <div
          className={
            comments
              ? "receiver"
              : forBoards || forSlack
                ? "timeline-board"
                : editorStyle == "65px"
                  ? "timeline"
                  : "timeline-less-height"
          }
        >
          {forSlack ? (
            <div className="m-2">
              <SlackMessages
                user={parsedData?.id}
                slack_id={parsedData?.slack_id}
              />
            </div>
          ) : (
            <div>
              {commentData?.length > 0 ? (
                <div className={`${forBoards} ? m-2 : ''`}>
                  <TimelineComments
                    comments={commentData}
                    showComments={timelineComments || forBoards}
                    showEvents={events}
                    isBuyersComment={buyersComment}
                    page={page}
                    mentionArr={userMentionData}
                    editComment={doEditComments}
                    forBoards={forBoards}
                  />
                </div>
              ) : (
                <div className="d-flex justify-centre">
                  <h4
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: "#3edab7",
                    }}
                  >
                    No Comments to display!
                  </h4>
                </div>
              )}
              {commentResponse?.data?.next ? (
                <div className="d-flex justify-centre">
                  <button
                    type="button"
                    onClick={loadMore}
                    style={{
                      backgroundColor: "#627daf",
                      color: "#ffffff",
                      fontSize: 16,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    Load more
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
        <div className="d-flex-column editorContainer">
          {/* ///////////// */}
          <div>
            {/* <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={toolbar}
            /> */}

            {/* Modal for Adding Link */}
            {isModalOpen && (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "white",
                  padding: "20px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  zIndex: 1000,
                }}
              >
                <h3>Add Link</h3>

                <input
                  type="text"
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                />
                <button
                  onClick={addLink}
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "10px 15px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Background Overlay */}
            {isModalOpen && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.5)",
                  zIndex: 999,
                }}
                onClick={() => setIsModalOpen(false)}
              />
            )}
          </div>
          {/* /////////////////// */}
          <div className="editors">
            <RichTextEditor
              editorState={editorState}
              placeholder="Type your comment here..."
              editorStyle={{
                height: editorStyle,
                overflowY: "auto",
                marginLeft: 5,
              }}
              onFocus={() => setEditorStyle("150px")}
              onBlur={(event) => {
                if (event.relatedTarget?.className !== "btn-comment") {
                  setEditorStyle("65px");
                }
              }}
              editorClassName="comment-editor"
              onEditorStateChange={onEditorStateChange}
              spellCheck
              mention={{
                separator: " ",
                trigger: "@",
                suggestions: userMentionData,
              }}
              hashtag={{
                separator: " ",
                trigger: "#",
              }}
              toolbar={toolbar}
            />

            <div
              style={{
                borderTop: `1px solid #D3D3D3`,
                borderTopRightRadius: "0.3rem",
                borderTopLeftRadius: "0.3rem",
              }}
              className={`d-flex ${
                forSlack || forBoards ? "justify-end" : "justify-space-between"
              } p-1`}
            >
              {!forSlack && !forBoards && (
                <div className="d-flex-wrap">
                  {isChecked ? (
                    <button onClick={() => setIsChecked(false)}>
                      <Tooltip
                        title={<strong>visible to buyers</strong>}
                        placement={"top"}
                        arrow
                      >
                        <Visibility style={{ color: "#627daf" }} />
                      </Tooltip>
                    </button>
                  ) : (
                    <button onClick={() => setIsChecked(true)}>
                      <Tooltip
                        title={<strong>Not visible to buyers</strong>}
                        placement={"top"}
                        arrow
                      >
                        <VisibilityOff style={{ color: "#aeaeae" }} />
                      </Tooltip>
                    </button>
                  )}
                  {isNotify ? (
                    <button
                      onClick={() => (setIsNotify(false), setIsChecked(false))}
                    >
                      <Tooltip
                        title={<strong>Notifications On</strong>}
                        placement={"top"}
                        arrow
                      >
                        <NotificationsActive style={{ color: "#627daf" }} />
                      </Tooltip>
                    </button>
                  ) : (
                    <button
                      onClick={() => (setIsNotify(true), setIsChecked(true))}
                    >
                      <Tooltip
                        title={<strong>Notification Off</strong>}
                        placement={"top"}
                        arrow
                      >
                        <NotificationsOffOutlined
                          style={{ color: "#aeaeae" }}
                        />
                      </Tooltip>
                    </button>
                  )}
                </div>
              )}
              <div>
                {edit ? (
                  <button className="btn-comment" onClick={handleUpdate}>
                    Update
                  </button>
                ) : forSlack || forBoards ? (
                  <button className="btn-comment" onClick={createComments}>
                    Save
                  </button>
                ) : (
                  <button className="btn-comment" onClick={createComments}>
                    {!isChecked && !isNotify
                      ? "Save"
                      : isChecked && !isNotify
                        ? "Post"
                        : !isChecked && isNotify
                          ? "Notify"
                          : isChecked && isNotify
                            ? "Notify"
                            : ""}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {open && (
        <ConfirmDialog
          open={open}
          handleClose={handleClientFacing}
          dialogContent={"Do you want to make this comment internal only?"}
          dialogTitle={"Buyer visible"}
        />
      )}
    </>
  );
}

export function getMentionedUsersId(state) {
  const entityMap = convertToRaw(state.getCurrentContent()).entityMap;
  const mentions = [];
  const mentioned_users_id = [];
  Object.values(entityMap).forEach((entity) => {
    if (entity.type === "MENTION") {
      mentions.push(entity.data);
    }
  });
  mentions?.forEach((element) => {
    mentioned_users_id.push({ id: element.url });
  });
  return mentioned_users_id?.length ? mentioned_users_id : [];
}

export default React.memo(Comments);
