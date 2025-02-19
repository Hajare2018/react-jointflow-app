import { Avatar, Tooltip } from '@mui/material';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { useSelector } from 'react-redux';
import { makePlurals } from '../../../Utils';

function DocumentHeader() {
  const doc_data = useSelector((state) => state.storedData);
  return Object.keys(doc_data?.data || {})?.length > 0 ? (
    <div className="p-more">
      <strong className="header-font">{doc_data?.data?.name}</strong>
      <div className="d-flex justify-space-between">
        <div className="d-flex justify-space-between width-75 font-18 dark-grey mt-3">
          <p>Version {doc_data?.data?.version}</p>
          <p>{new Date(doc_data?.data?.created_at).toLocaleDateString()}</p>
          <div className="d-flex">
            <Avatar src={doc_data?.data?.created_by_details?.avatar} />
            <span className="ml-3">
              Uploaded By{' '}
              {doc_data?.data?.created_by_details?.first_name +
                ' ' +
                doc_data?.data?.created_by_details?.last_name}{' '}
              - {doc_data?.data?.created_by_details?.role}
            </span>
          </div>
        </div>
        <div className="d-flex justify-end width-25">
          <Tooltip
            title={makePlurals(
              doc_data?.data?.nb_pages === null ? '0' : doc_data?.data?.nb_pages,
              'page',
            )}
            placement="top"
            arrow
          >
            <div className="image mr-3">
              <InsertDriveFileOutlined
                className={doc_data?.data?.nb_pages === null ? 'light-grey' : 'app-color'}
                style={{
                  height: 43,
                  width: 43,
                }}
              />
              <p>
                <span>{doc_data?.data?.nb_pages === null ? '0' : doc_data?.data?.nb_pages}</span>
              </p>
            </div>
          </Tooltip>
          <div style={{ height: 40, width: 40 }}>
            <CircularProgressbarWithChildren value={doc_data?.data?.change_percent}>
              <Tooltip
                title={
                  'Changes: ' +
                  (doc_data?.data?.change_percent == null
                    ? '0%'
                    : doc_data?.data?.change_percent + '%')
                }
                placement="top"
                arrow
              >
                <strong style={{ color: '#627daf' }}>
                  {doc_data?.data?.change_percent === null
                    ? '-'
                    : Math.round(doc_data?.data?.change_percent) + '%'}
                </strong>
              </Tooltip>
            </CircularProgressbarWithChildren>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ''
  );
}

export default React.memo(DocumentHeader);
