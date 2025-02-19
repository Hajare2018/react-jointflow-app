import { Divider, List, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { extract_after_texts, extract_before_texts, formatDateTime } from '../../../../Utils';

function ChangesList({ data, textOnly }) {
  return (
    <List className="list-height">
      {data?.map((item, index) => (
        <>
          <ListItem key={index + 1}>
            <ListItemText
              primary={
                <>
                  <p style={{ float: 'left' }}>
                    {'...' + extract_before_texts(textOnly, item?.text)}
                    <strong
                      style={{
                        color: 'red',
                        textDecoration: item.deleted ? 'line-through' : 'none',
                      }}
                    >
                      {item?.text}
                    </strong>
                    {extract_after_texts(textOnly, item?.text) == undefined
                      ? '...'
                      : extract_after_texts(textOnly, item?.text) + '...'}
                  </p>
                  <p style={{ float: 'right' }}>
                    by <strong>{item?.author}</strong> on{' '}
                    {formatDateTime(new Date(item?.date), 'ddd H:mmtt d MMM yyyy', true)}
                  </p>
                </>
              }
            />
          </ListItem>
          <Divider variant="fullWidth" />
        </>
      ))}
    </List>
  );
}

export default React.memo(ChangesList);
