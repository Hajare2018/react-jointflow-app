import { Tooltip } from '@mui/material';
import React from 'react';
import { DealPoliceIcons } from './ProjectForm/Components/DealPoliceIcons';

function AssigneeDealPolice({ dealPolice }) {
  const data = DealPoliceIcons(dealPolice, false);
  const filtered = data?.map(({ actions, ...rest }) => ({ ...rest })); //Filtered array by removing object name
  return (
    <div className="d-flex justify-centre">
      {filtered?.map((police) => (
        <Tooltip
          key={police.id}
          title={police.name}
        >
          <div
            className="d-flex justify-centre"
            style={{
              height: 27,
              width: 27,
              borderRadius: '50%',
              margin: 5,
              color: '#627daf',
              backgroundColor:
                police.deal_police == undefined
                  ? '#cccccc'
                  : police.deal_police?.unchecked
                    ? '#cccccc'
                    : police.deal_police?.checkedok
                      ? 'lightgreen'
                      : police.deal_police?.checkedissue
                        ? 'lightcoral'
                        : '',
            }}
          >
            {police.icon}
          </div>
        </Tooltip>
      ))}
    </div>
  );
}

export default React.memo(AssigneeDealPolice);
