import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  createImageFromInitials,
  extract_after_texts,
  extract_before_texts,
  formatDateTime,
} from '../../../../Utils';
import '../../doc-comments.css';

function Comments() {
  const doc_data = useSelector((state) => state.storedData);
  const allComments =
    Object?.keys(doc_data?.data)?.length > 0 ? doc_data?.data?.extracted_comments : [];
  const textOnly = Object?.keys(doc_data?.data)?.length > 0 ? doc_data?.data?.text_only : [];
  return (
    <>
      {allComments?.length > 0 ? (
        <List className="list-height">
          {(allComments || [])?.map((comment) => (
            <>
              <div className="d-flex">
                <ListItem
                  style={{ maxWidth: '65%' }}
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar src={createImageFromInitials(200, comment?.author, '#da5d60')} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={<strong>{comment.author}</strong>}
                    secondary={
                      <React.Fragment>
                        <p>{new Date(comment.date).toLocaleDateString()}</p>
                        <div className="dark-color">
                          <span>
                            {'...' + extract_before_texts(textOnly, comment?.commented_on)}
                          </span>
                          <span className="comment-text">{comment?.commented_on}</span>
                          <span>
                            {extract_after_texts(textOnly, comment?.commented_on) + '...'}
                          </span>
                        </div>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <ListItem
                  className="comment-div"
                  alignItems="flex-end"
                >
                  <div style={{ position: 'absolute', left: '-16px' }}>
                    <Avatar
                      src={createImageFromInitials(200, comment?.author, '#c786cf')}
                      style={{ height: 28, width: 28 }}
                    />
                  </div>
                  <ListItemText
                    primary={<strong className="ml-3">{comment.text}</strong>}
                    secondary={
                      <p className="ml-3">
                        {formatDateTime(new Date(comment.date), 'd MMM yyyy hh:mmtt')}
                      </p>
                    }
                  />
                </ListItem>
              </div>
              <Divider variant="fullWidth" />
            </>
          ))}
        </List>
      ) : (
        <div className="div-center mt-3">
          <strong>No comments were found in this document</strong>
        </div>
      )}
    </>
  );
}

export default React.memo(Comments);
