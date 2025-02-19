import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { ViewComfy, Equalizer } from '@mui/icons-material';
import { FaListUl } from 'react-icons/fa';
import clsx from 'clsx';

export default function ViewOptions(props) {
  const labels = {
    list_view: 'Show list view',
    grid_view: 'Show grid view',
    gantt_view: 'Show Gantt view',
  };

  const icons = {
    list_view: FaListUl,
    grid_view: ViewComfy,
    gantt_view: Equalizer,
  };

  const { options = ['list_view', 'grid_view'], value, handleChange } = props;

  if (!handleChange) {
    return null;
  }

  return (
    <div className="d-flex">
      {options.map((option, index, array) => {
        const Icon = icons[option];

        const classes = clsx('d-flex', 'justify-center', {
          'left-btn': index === 0,
          'right-btn': index === array.length - 1,
        });

        return (
          <div
            key={option}
            className={classes}
            style={{
              backgroundColor: value === option ? '#6385b7' : '#dadde9',
              height: 40,
              width: 40,
            }}
          >
            <Tooltip
              title={labels[option]}
              placement="top"
              arrow
            >
              <IconButton onClick={() => handleChange(option)}>
                <Icon
                  style={{
                    color: value === option ? '#fff' : '#6385b7',
                    transform: option === 'gantt_view' ? 'rotate(90deg)' : '',
                  }}
                />
              </IconButton>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
