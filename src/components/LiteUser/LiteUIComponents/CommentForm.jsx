import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postComments } from '../../../Redux/Actions/comments';
import { postDocumentData } from '../../../Redux/Actions/document-upload';
import { keepData } from '../../../Redux/Actions/loader';

export default function CommentForm({ task, comment }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState({});
  const fullUrl = new URL(window.location.href);
  let search_params = fullUrl.searchParams;
  const board = search_params.get('board');

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };
  const loader = useSelector((state) => state.showLoader);
  const clearInput = useSelector((state) => state.keepThis);

  const doCommentWithUpload = () => {
    const formData = new FormData();
    formData.append('name', file?.name?.split('.')?.[0]);
    formData.append('file', file);
    formData.append('board', board);
    formData.append('card', task?.id);
    task?.task_type_details?.id !== undefined &&
      formData.append('document_type', task?.task_type_details?.id);
    formData.append('created_at', new Date().toJSON().slice(0, 10).replace(/-/g, '-'));
    formData.append('change_percent', 0);
    formData.append('size', file?.size);
    formData.append('version', 0);
    formData.append('created_by', task?.owner_details?.id);
    formData.append('is_template', false);
    formData.append('archived', false);
    const comment_req = {
      card: task?.id,
      owner: task?.owner_details?.id,
      comment: comment,
      client_facing: 'True',
      created_at: new Date().toISOString(),
      isLiteUI: true,
    };
    dispatch(keepData(false));
    dispatch(postComments(comment_req));
    if (file?.size > 0) {
      dispatch(
        postDocumentData({
          board_id: board,
          card_id: task?.id,
          data: formData,
          fetchDocList: false,
          liteView: true,
          allDocs: false,
        }),
      );
    }
  };

  useEffect(() => {}, [file, task]);

  useEffect(() => {
    if (!clearInput.show) {
      document.getElementById('attachment').value = '';
    }
  }, [clearInput]);

  const handleSubmit = () => {
    if (comment === '') {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert('Comment is required!');
      return;
    } else {
      doCommentWithUpload();
    }
  };
  return (
    <div className="d-flex-column">
      {task?.is_completed && (
        <strong>
          This task is approved but you can re-open it by clicking on the &quot;Re-open&quot; button
          in Approval tab.
        </strong>
      )}
      <div className="d-flex justify-space-between">
        <input
          type="file"
          className="form-control-file"
          disabled={task?.is_completed}
          style={{
            backgroundColor: task?.is_completed && '#f7f8fb',
            width: '70%',
            border: '1px #aeaeae solid',
          }}
          id="attachment"
          onChange={handleFile}
        />
        <div style={{ display: 'flex', float: 'right' }}>
          <Button
            type="button"
            variant="contained"
            disabled={task?.is_completed || comment === ''}
            style={{
              backgroundColor: task?.is_completed || comment === '' ? '#aeaeae' : '#627daf',
              color: '#ffffff',
              textTransform: 'none',
            }}
            id="comment"
            onClick={handleSubmit}
          >
            {loader.show ? (
              <CircularProgress
                size={15}
                color="#ffffff"
              />
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
