import { Tooltip } from '@mui/material';
import React from 'react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { currencyFormatter, findPercentage, getPlurals } from '../../Utils';
import { useTenantContext } from '../../../context/TenantContext';

function ProgressGraph({
  value,
  percent,
  pathColor,
  name,
  board,
  closedValue,
  onTrackValue,
  target,
}) {
  const { tenant_locale, currency_symbol } = useTenantContext();

  const tooltipText = (status, deal) => {
    return status === 'Calling'
      ? `${status}: 
            ${currencyFormatter(tenant_locale, closedValue, currency_symbol)} closed + 
            ${currencyFormatter(tenant_locale, onTrackValue, currency_symbol)} on track`
      : `${status}: ${getPlurals(deal, 'deal')}`;
  };
  return (
    <div
      className="mb-3"
      style={{ height: 150, width: 150 }}
    >
      <CircularProgressbarWithChildren
        styles={{
          path: {
            stroke: name === 'Calling' ? '#91cf51' : pathColor,
          },
        }}
        strokeWidth={10}
        value={
          name === 'Calling' ? findPercentage(onTrackValue, target) : isNaN(percent) ? 0 : percent
        }
      >
        <Tooltip
          title={tooltipText(name, board)}
          placement="top"
          arrow
        >
          {name === 'Calling' ? (
            <div style={{ width: '80%' }}>
              <CircularProgressbarWithChildren
                styles={{
                  path: {
                    stroke: pathColor,
                  },
                }}
                strokeWidth={10}
                value={findPercentage(closedValue, target)}
              >
                <div
                  style={{
                    color: pathColor,
                    textAlign: 'center',
                    wordBreak: 'break-word',
                  }}
                >
                  <strong>
                    {name}
                    <span className="text-weight-copy">
                      {currencyFormatter(tenant_locale, value, currency_symbol)}
                    </span>
                    {!isNaN(percent) && isFinite(percent) ? percent + '%' : 0 + '%'}
                  </strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          ) : (
            <div
              style={{
                color: pathColor,
                textAlign: 'center',
                wordBreak: 'break-word',
              }}
            >
              <strong>
                {name}
                <span className="text-weight">
                  {currencyFormatter(tenant_locale, value, currency_symbol)}
                </span>
                {!isNaN(percent) && isFinite(percent) ? percent + '%' : 0 + '%'}
              </strong>
            </div>
          )}
        </Tooltip>
      </CircularProgressbarWithChildren>
    </div>
  );
}

export default ProgressGraph;
