import {
  AppBar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  FormControlLabel,
  Grid,
  IconButton,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Close, LaunchOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveContent, updateContent } from '../../Redux/Actions/dashboard-data';
import { EditorState } from 'draft-js';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import { convertToHTML } from '../RichTextEditor/converters';
import ConfirmDialog from '../ProjectForm/Components/ConfirmDialog';
import { showErrorSnackbar } from '../../Redux/Actions/snackbar';
import { defaultStyles, FileIcon } from 'react-file-icon';
import SingleContentPreview from './ContentCard/SingleContentPreview';

const useStyles = makeStyles((_theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
}));

function ContentForm({ open, handleClose, isAdd, id, isImport, selected_id }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: '',
    url: '',
    link: '',
    type: 'CANVAS',
    caption: '',
    tab_name: '',
  });
  const [file, setFile] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isHide, setIsHide] = useState(true);
  const [preview, setPreview] = useState(false);
  const [isHideHeader, setIsHideHeader] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const loader = useSelector((state) => state.showLoader);
  const classes = useStyles();
  const contentData = useSelector((state) => state.singleContentData);
  const content = contentData?.data?.cblocks?.[0];
  const allContents = useSelector((state) => state.contentsData);
  const tabs = allContents?.data?.tab_names;
  const board = useSelector((state) => state.singleProjectData);
  const boardData = board?.data?.length > 0 ? board?.data?.[0] : [];

  useEffect(() => {
    if (isAdd) {
      setForm({
        title: '',
        url: '',
        type: 'CANVAS',
        caption: '',
        custom_content: '',
        tab_name: '',
      });
      setIsVisible(true);
      setIsHide(true);
      setIsHideHeader(true);
      setFile(null);
    } else {
      setForm({
        title: content?.title,
        url: content?.url,
        type: content?.type,
        caption: content?.caption,
        custom_content: content?.custom_content,
        tab_name: content?.tab_name,
      });
      setIsVisible(content?.client_visible ? true : false);
      setIsHide(content?.hide_title ? true : false);
      setIsHideHeader(content?.hide_header ? true : false);
      setFile(content?.linked_document);
    }
  }, [contentData, isAdd]);

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };
  const handleVisible = () => {
    setIsVisible(!isVisible);
  };
  const handleHide = () => {
    setIsHide(!isHide);
  };
  const handleHideHeader = () => {
    setIsHideHeader(!isHideHeader);
  };
  const handleClear = () => {
    setForm({
      title: '',
      url: '',
      type: 'CANVAS',
      caption: '',
      tab_name: '',
    });
    setIsHide(true);
    setFile(null);
    setIsVisible(true);
    setIsHideHeader(true);
    handleClose();
  };
  const handleSaveContents = () => {
    if (form.title === '') {
      dispatch(showErrorSnackbar('Content Title is required!'));
    } else if (form.tab_name === '') {
      dispatch(showErrorSnackbar('Tab Name is required!'));
    } else if (form.type === 'FILE' && form.type === 'PDF' && file == null) {
      dispatch(showErrorSnackbar('Please Upload a File!'));
    } else {
      const formData = new FormData();
      formData.append('title', form.title);
      id !== null && formData.append('board', boardData?.id);
      isImport && formData.append('template_cblock', selected_id);
      formData.append('type', form.type);
      formData.append('caption', form.caption);
      formData.append('custom_content', form.custom_content);
      formData.append(
        'order_number',
        allContents?.data?.cblocks?.length > 0 ? allContents?.data?.cblocks?.length + 1 : 1,
      );
      formData.append('client_visible', isVisible);
      formData.append('hide_title', isHide);
      formData.append('hide_header', isHideHeader);
      formData.append('archived', false);
      formData.append('tab_name', form.tab_name);
      if (
        form.type === 'VIMEO' ||
        form.type === 'IMAGE' ||
        form.type === 'LINK' ||
        form.type === 'EMBED_LINK'
      ) {
        formData.append('url', form.url);
      }

      if (form.type === 'YOUTUBE') {
        const id = form.url.split('?v=')[1];
        formData.append('url', `https://www.youtube.com/embed/${id}`);
      }

      if (
        (form.type === 'FILE' || form.type === 'PDF') &&
        isImport &&
        file.name === content?.linked_document?.name
      ) {
        formData.append('url', content?.linked_document?.document_url);
      } else {
        if (file !== null) {
          formData.append('file', file);
        }
      }

      dispatch(
        saveContent({
          data: formData,
          board: id == null ? null : boardData?.id,
        }),
      );
      if (!loader.show) {
        handleClear();
      }
    }
  };

  const handleUpdateContent = () => {
    const formData = new FormData();
    formData.append('title', form.title);
    id !== null && formData.append('board', boardData?.id);
    formData.append('type', form.type);
    formData.append('caption', form.caption);
    formData.append('custom_content', form.custom_content);
    formData.append(
      'order_number',
      allContents?.data?.cblocks?.length > 0 ? allContents?.data?.cblocks?.length + 1 : 1,
    );
    formData.append('client_visible', isVisible);
    formData.append('hide_title', isHide);
    formData.append('hide_header', isHideHeader);
    formData.append('archived', false);
    formData.append('tab_name', form.tab_name);
    if (
      form.type === 'VIMEO' ||
      form.type === 'IMAGE' ||
      form.type === 'LINK' ||
      form.type === 'EMBED_LINK'
    ) {
      formData.append('url', form.url);
    }

    if (form.type === 'YOUTUBE') {
      const id = form.url.split('?v=')[1];
      formData.append('url', `https://www.youtube.com/embed/${id}`);
    }

    if (
      (form.type === 'FILE' || form.type === 'PDF') &&
      file.name === content?.linked_document?.name
    ) {
      formData.append('url', content?.linked_document?.document_url);
    } else {
      if (file !== null) {
        formData.append('file', file);
      }
    }

    dispatch(
      updateContent({
        data: formData,
        id: content?.id,
        board: content?.board,
        updateOrder: false,
      }),
    );
    if (!loader.show) {
      handleClear();
    }
  };

  const handleDetachContent = () => {
    const formData = new FormData();
    formData.append('template_cblock', '');
    dispatch(
      updateContent({
        data: formData,
        id: content?.id,
        board: content?.board,
        updateOrder: false,
        detach: true,
      }),
    );
  };

  const onEditorStateChange = (state) => {
    setEditorState(state);
    const htmlData = convertToHTML(state.getCurrentContent());
    setForm({ ...form, ['custom_content']: htmlData });
  };

  const handleConfirmation = (e) => {
    setConfirm(false);
    if (e.close) {
      handleClear();
    }
  };

  const openFile = () => {
    window.open(file.document_url, '_blank');
  };

  const handleDialog = () => {
    if (
      (form.title !== content?.title ||
        form.url !== content?.url ||
        form.type !== content?.type ||
        form.caption !== content?.caption ||
        form.custom_content !== content?.custom_content ||
        form.link !== content?.linked_document?.name ||
        form.tab_name !== content?.tab_name) &&
      !isAdd
    ) {
      setConfirm(true);
    } else {
      handleClear();
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleDialog}
      style={{ height: 'auto' }}
      aria-labelledby="form-dialog-title"
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="justify-space-between">
          <strong>
            {content?.content_read_only && isImport
              ? 'Content Block - Library Reference'
              : 'Content Block'}
          </strong>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDialog}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid
        container
        className="p-3"
      >
        <Grid
          item
          sm={12}
          md={12}
          lg={12}
        >
          <div className="mb-3">
            <label
              className="form-label"
              style={{
                color: form.title === '' ? 'red' : '#999',
              }}
            >
              Title
            </label>
            <input
              type="text"
              placeholder={'Enter Title here...'}
              name="title"
              style={{
                border: form.title === '' ? '2px red solid' : '2px #999 solid',
              }}
              className={'text-input'}
              value={form.title}
              onChange={handleForm}
            />
          </div>
          <div className="mb-3">
            <label
              style={{ color: '#aeaeae' }}
              className="form-label"
            >
              Type {!isAdd && (content?.content_read_only || isImport) && '(Read-only)'}
            </label>
            <select
              value={form.type}
              name="type"
              onChange={handleForm}
              className="text-input"
              disabled={!isAdd && (content?.content_read_only || isImport)}
            >
              <option value={'CANVAS'}>CANVAS</option>
              <option value={'EMBED'}>EMBED</option>
              <option value={'EMBED_LINK'}>EMBED_LINK</option>
              <option value={'FILE'}>FILE</option>
              <option value={'IMAGE'}>IMAGE</option>
              <option value={'LINK'}>LINK</option>
              <option value={'PDF'}>PDF</option>
              <option value={'TEXT'}>TEXT</option>
              <option value={'VIMEO'}>VIMEO</option>
              <option value={'YOUTUBE'}>YOUTUBE</option>
            </select>
          </div>
          <>
            {form.type === 'YOUTUBE' ||
            form.type === 'VIMEO' ||
            form.type === 'IMAGE' ||
            form.type === 'LINK' ||
            form.type === 'EMBED_LINK' ? (
              <div>
                <label className="form-label">
                  Url {!isAdd && (content?.content_read_only || isImport) && '(Read-only)'}
                </label>
                <input
                  type="text"
                  placeholder={'Enter url here...'}
                  name="url"
                  className={'text-input'}
                  style={{ color: !isAdd && (content?.content_read_only || isImport) && '#aeaeae' }}
                  value={form.url}
                  disabled={!isAdd && (content?.content_read_only || isImport)}
                  onChange={handleForm}
                />
              </div>
            ) : form.type === 'FILE' || form.type === 'PDF' ? (
              file == null ? (
                <div>
                  <label className="form-label">Upload a File</label>
                  <input
                    type="file"
                    accept={form.type === 'PDF' ? '.pdf' : '*'}
                    onChange={handleFile}
                    disabled={form.type === 'FILE' && content?.content_read_only}
                    className="text-input"
                  />
                </div>
              ) : (
                <div className="d-flex">
                  {!isAdd && !isImport && (
                    <div>
                      {!content?.content_read_only && (
                        <input
                          type="file"
                          accept={form.type === 'PDF' ? '.pdf' : '*'}
                          onChange={handleFile}
                          className="file-input customFileInput"
                        />
                      )}
                    </div>
                  )}
                  <div className="file-icons">
                    <div className="file-icon">
                      <FileIcon
                        size={15}
                        extension={file?.extension}
                        {...defaultStyles[file?.extension]}
                      />
                    </div>
                    <strong>{file?.name}</strong>
                    <IconButton onClick={openFile}>
                      <LaunchOutlined className="app-color" />
                    </IconButton>
                  </div>
                </div>
              )
            ) : (
              ''
            )}
          </>
          {(form.type === 'EMBED' || form.type === 'CANVAS') && (
            <div className="mb-3">
              <label className="form-label">
                Content {!isAdd && (content?.content_read_only || isImport) && '(Read-only)'}
              </label>
              <textarea
                type="text"
                placeholder={'Enter your content here...'}
                name="custom_content"
                rows={3}
                className={'form-control-input'}
                disabled={!isAdd && (content?.content_read_only || isImport)}
                value={form.custom_content}
                onChange={handleForm}
              />
            </div>
          )}
          {form.type === 'TEXT' && (
            <div className="mb-3">
              <label className="form-label">Content</label>
              <div className="d-flex-column editorContainer">
                <div className="board-editor">
                  <RichTextEditor
                    editorState={editorState}
                    placeholder="Type your description here..."
                    editorStyle={{
                      height: '10vh',
                      width: 'auto',
                      overflowY: 'auto',
                      marginLeft: 5,
                    }}
                    readOnly={!isAdd && (content?.content_read_only || isImport)}
                    editorClassName="comment-editor"
                    onEditorStateChange={onEditorStateChange}
                    spellCheck
                    toolbar={{
                      options: ['inline', 'emoji', 'link'],
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
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Caption</label>
            <textarea
              type="text"
              placeholder={'Enter caption...'}
              name="caption"
              rows={3}
              className={'form-control-input'}
              value={form.caption}
              onChange={handleForm}
            />
          </div>
          <div className="mb-3">
            <label
              style={{
                color: form.tab_name === '' ? 'red' : '#999',
              }}
              className="form-label"
            >
              Tab Name
            </label>
            <input
              type="text"
              // autoComplete="off"
              placeholder={'Enter a Tab name'}
              list="data"
              className="text-input"
              style={{
                border: form.tab_name === '' ? '2px red solid' : '2px #999 solid',
              }}
              value={form.tab_name}
              name="tab_name"
              onChange={handleForm}
              maxLength={20}
            />
            <datalist id="data">
              {tabs?.map((item, key) => (
                <option
                  key={key}
                  value={item?.tab_name}
                />
              ))}
            </datalist>
          </div>
          <>
            <FormControlLabel
              label={<strong>Client visible</strong>}
              control={
                <Checkbox
                  checked={isVisible}
                  onChange={handleVisible}
                />
              }
            />
            <FormControlLabel
              label={<strong>Hide Title</strong>}
              control={
                <Checkbox
                  checked={isHide}
                  onChange={handleHide}
                />
              }
            />
            <FormControlLabel
              label={<strong>Hide Header</strong>}
              control={
                <Checkbox
                  checked={isHideHeader}
                  onChange={handleHideHeader}
                />
              }
            />
          </>
        </Grid>
      </Grid>
      <DialogActions>
        {!isAdd && (
          <Button
            variant="outlined"
            style={{
              backgroundColor: '#6385b7',
              color: '#ffffff',
              fontSize: 16,
              marginRight: 5,
            }}
            onClick={handlePreview}
          >
            Preview
          </Button>
        )}
        {!isAdd && content?.content_read_only && (
          <Button
            variant="outlined"
            style={{
              backgroundColor: '#6385b7',
              color: '#ffffff',
              fontSize: 16,
              marginRight: 5,
            }}
            onClick={handleDetachContent}
          >
            Detach
          </Button>
        )}
        {isAdd ? (
          <Button
            variant="outlined"
            // disabled={form.type === "FILE" && file == null}
            style={{
              backgroundColor: '#6385b7',
              color: '#ffffff',
              fontSize: 16,
              marginRight: 5,
            }}
            onClick={handleSaveContents}
          >
            Save
          </Button>
        ) : isImport ? (
          <Button
            variant="outlined"
            style={{
              backgroundColor: '#6385b7',
              color: '#ffffff',
              fontSize: 16,
              marginRight: 5,
            }}
            onClick={handleSaveContents}
          >
            Import
          </Button>
        ) : (
          <Button
            variant="outlined"
            style={{
              backgroundColor: '#6385b7',
              color: '#ffffff',
              fontSize: 16,
              marginRight: 5,
            }}
            onClick={handleUpdateContent}
          >
            Update
          </Button>
        )}
      </DialogActions>
      {confirm && (
        <ConfirmDialog
          dialogTitle={'Confirmation'}
          dialogContent={'Are you sure on close the form, The form data you filled will be lost?'}
          open={confirm}
          handleClose={handleConfirmation}
        />
      )}
      <SingleContentPreview
        open={preview}
        handleClose={handlePreview}
        content={content}
      />
    </Dialog>
  );
}

export default React.memo(ContentForm);
