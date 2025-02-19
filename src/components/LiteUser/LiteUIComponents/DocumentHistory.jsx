import { Chip, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import React from 'react';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { dateFormat, formatDateTime, getDevice, getPlurals } from '../../Utils';
import Download from '../icons/download';

function DocumentHistory({ documents }) {
  let url = new URL(window.location.href);
  const api_token = new URLSearchParams(url.search).get('jt');
  const isMobile = getDevice();
  return (
    <div>
      <b className="text-lg block m-3">Documents</b>
      <List
        sx={{
          width: '100%',
          maxWidth: '100%',
        }}
        disablePadding
      >
        {documents?.map((doc) => (
          <>
            <ListItem className="mt-3 mb-3 list-bg rounded-md">
              <ListItemAvatar style={{ minWidth: isMobile ? 0 : 56 }}>
                <div
                  className="file-icon"
                  style={{ WebkitFontSmoothing: 'antialiased' }}
                >
                  <FileIcon
                    extension={doc?.[0]?.extension}
                    size={14}
                    {...defaultStyles[doc?.[0]?.extension]}
                  />
                </div>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div className="d-flex justify-space-between">
                    <div className="d-flex">
                      <Tooltip
                        title={
                          'Uploaded by ' +
                          doc?.[0]?.created_by_details?.first_name +
                          ' ' +
                          doc?.[0]?.created_by_details?.last_name +
                          ' on ' +
                          formatDateTime(new Date(doc?.[0]?.created_at), 'dddd h:mmtt d MMM yyyy')
                        }
                        placement="top"
                        arrow
                      >
                        <strong style={{ float: 'left', marginRight: 6 }}>
                          {isMobile ? doc?.[0]?.name.substring(0, 7 - 3) + '...' : doc?.[0]?.name}.
                          {doc?.[0]?.extension}
                          {doc?.[0]?.version !== 0 &&
                            !isMobile &&
                            ` (V${doc?.[0]?.version} - ${getPlurals(
                              doc?.[0]?.nb_pages == null ? '0' : doc?.[0]?.nb_pages,
                              'page',
                            )})`}
                        </strong>
                      </Tooltip>
                      {doc?.[0]?.document_type_details !== null && (
                        <Chip
                          label={<strong>{doc?.[0]?.document_type_details?.custom_label}</strong>}
                          size="small"
                          variant="default"
                          style={{
                            color: '#aeaeae',
                            backgroundColor: '#f5f5f5',
                          }}
                        />
                      )}
                    </div>
                    <div className="flex ml-1">
                      <div>
                        <Tooltip
                          title="Download"
                          placement="top"
                          arrow
                        >
                          <a href={doc?.[0]?.document_url + `/${api_token}/`}>
                            <Download className="w-4 h-4" />
                          </a>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                }
                secondary={
                  <span className="file-size">
                    {Math.round(doc?.[0]?.size / 1000) + 'KB '}
                    Created- {dateFormat(doc?.[0]?.created_at)}
                  </span>
                }
              />
            </ListItem>
          </>
        ))}
      </List>
    </div>
  );
}

export default React.memo(DocumentHistory);
