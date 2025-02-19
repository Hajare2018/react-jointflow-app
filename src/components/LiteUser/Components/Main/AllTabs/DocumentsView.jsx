import React from 'react';
import { Chip, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { defaultStyles, FileIcon } from 'react-file-icon';
import { dateFormat, formatDateTime, getDevice, getPlurals } from '../../../../Utils';
import Download from '../../../icons/download';
import { useSelector } from 'react-redux';

const container = makeStyles({
  container: {
    height: '75vh',
    maxHeight: `63vh`,
    overflowY: 'auto',
    '@media(max-height: 2160px)': {
      maxHeight: `83vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `68vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `77vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `61vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `52vh`,
    },
  },
});

function DocumentsView() {
  const classes = container();
  const isMobile = getDevice();
  const documents = useSelector((state) => state.uploadedDocs);
  const data = documents?.data?.length > 0 ? documents?.data : [];
  let url = new URL(window.location.href);
  const api_token = new URLSearchParams(url.search).get('jt');
  return (
    <div
      className={`card ${!isMobile && 'ml-3'}`}
      style={{ height: '100%' }}
    >
      <div className={classes.container}>
        {data?.length > 0 ? (
          <List
            sx={{
              width: '100%',
              maxWidth: '100%',
            }}
            disablePadding
          >
            {data?.map((doc) => (
              <>
                <ListItem className="mt-3 mb-3 list-bg rounded-md">
                  <ListItemAvatar style={{ minWidth: isMobile ? 0 : 56 }}>
                    <div
                      className="file-icon"
                      style={{ WebkitFontSmoothing: 'antialiased' }}
                    >
                      <FileIcon
                        extension={doc?.extension}
                        size={14}
                        {...defaultStyles[doc?.extension]}
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
                              doc?.created_by_details?.first_name +
                              ' ' +
                              doc?.created_by_details?.last_name +
                              ' on ' +
                              formatDateTime(new Date(doc?.created_at), 'dddd h:mmtt d MMM yyyy')
                            }
                            placement="top"
                            arrow
                          >
                            <strong style={{ float: 'left', marginRight: 6 }}>
                              {isMobile ? doc?.name.substring(0, 7 - 3) + '...' : doc?.name}.
                              {doc?.extension}
                              {doc?.version !== 0 &&
                                !isMobile &&
                                ` (V${doc?.version} - ${getPlurals(
                                  doc?.nb_pages == null ? '0' : doc?.nb_pages,
                                  'page',
                                )})`}
                            </strong>
                          </Tooltip>
                          <Chip
                            label={<strong>{doc?.document_type_details?.custom_label}</strong>}
                            size="small"
                            variant="default"
                            style={{
                              color: '#aeaeae',
                              backgroundColor: '#f5f5f5',
                            }}
                          />
                        </div>
                        <div className="flex ml-1">
                          <div>
                            <Tooltip
                              title="Download"
                              placement="top"
                              arrow
                            >
                              <a href={doc?.document_url + `/${api_token}/`}>
                                <Download className="w-4 h-4" />
                              </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    }
                    secondary={
                      <span className="file-size">
                        {Math.round(doc?.size / 1000) + 'KB '}
                        Created- {dateFormat(doc?.created_at)}
                      </span>
                    }
                  />
                </ListItem>
              </>
            ))}
          </List>
        ) : (
          <div className="text-centre app-color font-bold-24">
            <strong>No shared documents</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(DocumentsView);
