import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Tooltip } from '@mui/material';
import { GetApp } from '@mui/icons-material';
import React from 'react';
import HttpClient from '../../../Api/HttpClient';
import { currencyFormatter, formatDateTime } from '../../Utils';
import Alert from '../../LiteUser/icons/alert';
import { useTenantContext } from '../../../context/TenantContext';

function ClauseLibrary({ data }) {
  const { tenant_locale, currency_symbol } = useTenantContext();
  return (
    <List>
      {'project_name' in (data || {}) && (
        <div className="d-flex">
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={data?.buyer_company_details?.company_image} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <strong>
                  {currencyFormatter(tenant_locale, data?.project_value, currency_symbol)}
                </strong>
              }
              secondary={<p>Q2, 2023</p>}
            />
          </ListItem>
          {data?.approved_by_details !== null ? (
            <ListItem alignItems="flex-end">
              <ListItemAvatar>
                <Avatar src={data?.approved_by_details?.avatar} />
              </ListItemAvatar>
              <ListItemText>
                <strong>
                  {data?.approved_by_details?.first_name +
                    ' ' +
                    data?.approved_by_details?.last_name}
                </strong>
              </ListItemText>
            </ListItem>
          ) : (
            <ListItem
              className="flex align-centre"
              alignItems="flex-end"
            >
              <Alert className="w-6 text-danger" />
              <strong>Not approved yet!</strong>
            </ListItem>
          )}
        </div>
      )}
      <ListItem>
        <ListItemText
          secondary={
            <div className="d-flex-column">
              {'project_name' in (data || {}) ? (
                <>
                  <div className="d-flex justify-space-between">
                    <strong>{data?.approved_comment}</strong>
                    <Tooltip
                      title="Get this Document"
                      placement="bottom"
                    >
                      <a
                        href={data?.linked_document?.document_url + `/${HttpClient?.api_token}/`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <GetApp style={{ color: '#222222' }} />
                      </a>
                    </Tooltip>
                  </div>
                  <h3>{data?.clause_index + ' ' + data?.clause_name}</h3>
                </>
              ) : (
                <div className="d-flex justify-space-between">
                  <strong style={{ fontSize: 22, color: '#222222' }}>
                    v
                    {data?.linked_document?.version +
                      ' on ' +
                      formatDateTime(new Date(data?.created_at), 'ddd h:mmtt d MMM yyyy') +
                      ' by ' +
                      data?.created_by_details?.first_name +
                      ' ' +
                      data?.created_by_details?.last_name}
                  </strong>
                  <Tooltip
                    title="Get this Document"
                    placement="bottom"
                  >
                    <a
                      href={data?.linked_document?.document_url + `/${HttpClient?.api_token}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <GetApp style={{ color: '#222222' }} />
                    </a>
                  </Tooltip>
                </div>
              )}
              <p
                dangerouslySetInnerHTML={{
                  __html: data?.clause_text,
                }}
              />
            </div>
          }
        />
      </ListItem>
    </List>
  );
}

export default React.memo(ClauseLibrary);
