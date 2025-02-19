import { Tooltip } from '@mui/material';
import { Check, Close, EmojiObjects, Flag, Warning } from '@mui/icons-material';
import React from 'react';
import AppProgressbar from './AppProgressbar';
import { findPercentage, formatDateTime } from './Utils';

function Alerts({ alert, type, onPress }) {
  return (
    <>
      <div
        style={{
          width: 'auto',
          display: 'flex',
          height: 'auto',
          margin: 5,
          backgroundColor:
            type === 'errors'
              ? '#fef2f3'
              : type === 'alerts'
                ? '#f2f2f2'
                : type === 'green_flags'
                  ? '#ecfaf7'
                  : type === 'warnings'
                    ? ' #FFECC9'
                    : '#ffffff',
          borderRadius: 4,
        }}
        id={
          type === 'errors'
            ? 'errors'
            : type === 'alerts'
              ? 'alerts'
              : type === 'green_flags'
                ? 'green_flags'
                : ''
        }
      >
        <div className="d-flex justify-space-between w-100 p-1 ml-1">
          <div className="d-flex">
            <Tooltip
              title={alert?.rule_code}
              placement="top"
            >
              {type === 'errors' ? (
                <Warning style={{ color: '#fdb3b1' }} />
              ) : type === 'alerts' ? (
                <EmojiObjects style={{ color: '#acacac' }} />
              ) : type === 'green_flags' ? (
                <Flag style={{ color: '#3edab7' }} />
              ) : type === 'warnings' ? (
                <Warning style={{ color: '#FFA500' }} />
              ) : (
                ''
              )}
            </Tooltip>
            <Tooltip
              title={`Last raised on ${formatDateTime(
                new Date(alert.last_raised_at),
                'ddd h:mmtt d MMM yyyy',
              )}`}
              placement="top"
            >
              <h3
                style={{
                  color:
                    type === 'errors'
                      ? '#fdb3b1'
                      : type === 'alerts'
                        ? '#acacac'
                        : type === 'green_flags'
                          ? '#3edab7'
                          : type === 'warnings'
                            ? '#FFA500'
                            : '#000000',
                  fontSize: 16,
                  marginLeft: 5,
                  textDecoration: (type === 'green_flags' || type === 'alerts') && 'line-through',
                }}
              >
                {alert?.rule_friendly_expl}
              </h3>
            </Tooltip>
          </div>
          <div className="d-flex mr-3">
            <div className="mr-3">
              {type !== 'green_flags' && (
                <AppProgressbar value={findPercentage(alert?.weight_indicator, 1.0)} />
              )}
            </div>
            <Tooltip
              title={
                type === 'errors'
                  ? 'Mark as Mitigated.'
                  : type === 'green_flags'
                    ? 'Issue addressed'
                    : type === 'alerts'
                      ? 'Issue obsolete'
                      : type === 'warnings'
                        ? 'Re-activate'
                        : ''
              }
              placement="top"
            >
              <div
                onClick={() => onPress({ data: alert })}
                style={{
                  cursor: 'pointer',
                }}
                className="close-icon"
              >
                {type === 'errors' ? (
                  <Close
                    style={{
                      color: type === 'errors' ? '#fdb3b1' : '#000000',
                    }}
                  />
                ) : (
                  <div className="check-icon">
                    <Check
                      style={{
                        color:
                          type === 'alerts'
                            ? '#acacac'
                            : type === 'green_flags'
                              ? '#3edab7'
                              : type === 'warnings'
                                ? '#FFA500'
                                : '#000000',
                      }}
                    />
                  </div>
                )}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}

export default React.memo(Alerts);
