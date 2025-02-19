import { AppBar, CircularProgress, Dialog, IconButton, Toolbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close, Telegram } from '@mui/icons-material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showWarningSnackbar } from '../../Redux/Actions/snackbar';
import { EditorState, convertToRaw } from 'draft-js';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import { convertToHTML } from '../RichTextEditor/converters';
import { getMentionedUsersId } from './Comments';
import { replaceCumulative } from '../Utils';
import { show } from '../../Redux/Actions/loader';
import { useUserContext } from '../../context/UserContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
  marginLeft: theme.spacing(2),
  flex: 1,
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
  '& > *': {
    root: {
      margin: theme.spacing(0),
      fontWeight: '600',
      color: '#999',
    },
  },
  '& .MuiAutocomplete-input': {
    fontSize: 16,
  },
}));

function EditComment({ open, handleClose, forEdit, is_client_facing, forAssignees }) {
  const [comment, setComment] = useState('');
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const users_data = useSelector((state) => state.allUsersData);
  const userMentionData =
    users_data?.data?.length > 0
      ? users_data?.data?.map((user) => ({
          text: user?.first_name + ' ' + user?.last_name,
          value: user?.first_name + '_' + user?.last_name,
          url: user?.id,
        }))
      : [];
  const { user: parsed_user } = useUserContext();
  const dispatch = useDispatch();
  const onEditorStateChange = (state) => {
    setEditorState(state);
    const htmlData = convertToHTML(state.getCurrentContent());
    setComment(htmlData);
  };

  const handleClear = () => {
    setComment('');
    handleClose({ close: false });
  };

  const loader = useSelector((state) => state.showLoader);

  const handleNewComment = (isNotify) => {
    const entityMap = convertToRaw(editorState.getCurrentContent()).entityMap;
    const comment_block = convertToRaw(editorState.getCurrentContent()).blocks;
    const mentions = [];
    const mentioned_users_id = [];
    let linkUrls = [];
    Object.values(entityMap).forEach((entity) => {
      if (entity.type === 'MENTION') {
        mentions.push(entity.data);
      }
    });
    mentions?.forEach((element) => {
      mentioned_users_id.push({ id: element.url });
    });
    comment_block.forEach((_element) => {
      linkUrls.push({});
    });
    if (comment.length >= 3) {
      dispatch(show(true));
      let newContent = comment;
      let str = '';
      str = newContent.split('@').join('<strong>@');
      let splitted = str.split(' ');
      let filtered = splitted.filter((split) => split.startsWith('<strong>@'));
      let newArr = [];
      filtered.forEach((element) => {
        newArr.push(element.concat('</strong>'));
      });
      const reqBody = {
        comment: replaceCumulative(str, filtered, newArr),
        card: forEdit?.card_id,
        board: forEdit?.board,
        owner: parsed_user?.id,
        coaching: true,
        mentions: getMentionedUsersId(editorState),
        client_facing: is_client_facing,
        modified_at: new Date().toISOString(),
        comment_type: is_client_facing ? 'AssignmentExt' : 'AssignmentInt',
        noRefresh: forAssignees,
      };
      const reqBodyForSave = {
        comment: replaceCumulative(str, filtered, newArr),
        card: forEdit?.card_id,
        board: forEdit?.board,
        owner: parsed_user?.id,
        coaching: true,
        mentions: getMentionedUsersId(editorState),
        client_facing: is_client_facing,
        comment_type: 'CardComment',
        modified_at: new Date().toISOString(),
        noRefresh: forAssignees,
      };
      handleClose({
        close: true,
        comment_data: !isNotify ? reqBodyForSave : reqBody,
      });
    } else {
      dispatch(showWarningSnackbar('Please type in a short message for the assignee!'));
    }
  };
  const classes = useStyles();
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>Add a Message</strong>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={handleClear}
          >
            <Close style={{ fontSize: 30 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'auto',
          margin: 10,
        }}
      >
        <div
          style={{
            flex: 8,
            marginBottom: 10,
          }}
        >
          <div className="d-flex-column editorContainer">
            <div className="board-editor">
              <RichTextEditor
                editorState={editorState}
                placeholder="For your information..."
                editorStyle={{
                  height: '57vh',
                  overflowY: 'auto',
                  marginLeft: 5,
                }}
                editorClassName="comment-editor"
                onEditorStateChange={onEditorStateChange}
                spellCheck
                mention={{
                  separator: ' ',
                  trigger: '@',
                  suggestions: userMentionData,
                }}
                hashtag={{
                  separator: ' ',
                  trigger: '#',
                }}
                toolbar={{
                  options: [
                    'inline',
                    'emoji',
                    'list',
                    'textAlign',
                    'link',
                    // "embedded",
                    'image',
                  ],
                  inline: {
                    component: undefined,
                    dropdownClassName: undefined,
                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                    italic: { className: undefined },
                    underline: { className: undefined },
                  },
                  image: {
                    className: undefined,
                    component: undefined,
                    popupClassName: undefined,
                    urlEnabled: true,
                    alignmentEnabled: true,
                    defaultSize: {
                      height: 'auto',
                      width: 'auto',
                    },
                  },
                  // link: {
                  //   inDropdown: false,
                  //   className: undefined,
                  //   component: undefined,
                  //   popupClassName: undefined,
                  //   dropdownClassName: undefined,
                  //   showOpenOptionOnHover: true,
                  //   defaultTargetOption: "_self",
                  //   // linkCallback: { handleLink },
                  // },
                }}
              />
              <div
                style={{
                  borderTop: `1px solid #D3D3D3`,
                  borderTopRightRadius: '0.3rem',
                  borderTopLeftRadius: '0.3rem',
                }}
                className={'d-flex justify-end p-1'}
              >
                <div className="mr-1">
                  <button
                    style={{
                      width: 'auto',
                      float: 'right',
                      backgroundColor: '#627daf',
                      color: '#ffffff',
                      padding: 7,
                      borderRadius: 6,
                    }}
                    className="send-btn"
                    onClick={() => handleNewComment(true)}
                  >
                    {loader.show ? (
                      <CircularProgress
                        size={20}
                        color={'Inherit'}
                      />
                    ) : (
                      <>
                        <Telegram className="mr-1" />
                        Notify & Assign
                      </>
                    )}
                  </button>
                </div>
                <button
                  style={{
                    width: 'auto',
                    float: 'right',
                    backgroundColor: '#627daf',
                    color: '#ffffff',
                    padding: 7,
                    borderRadius: 6,
                  }}
                  className="send-btn"
                  onClick={() => handleNewComment(false)}
                >
                  {loader.show ? (
                    <CircularProgress
                      size={20}
                      color={'Inherit'}
                    />
                  ) : (
                    'Save & Assign'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default React.memo(EditComment);
