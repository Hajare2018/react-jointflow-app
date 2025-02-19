import React, { useContext, useEffect } from 'react';
import { FormContext } from '../../FormContext';
import { Select, Tooltip, MenuItem, Input, FormControl, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InfoOutlined } from '@mui/icons-material';

const useStyles = makeStyles((_theme) => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 8 + 8,
      width: 250,
    },
  },
};

const MultiSelect = ({
  field_id,
  field_label,
  readonly,
  field_value,
  field_options,
  field_type,
  field_hidden,
  field_tooltip,
}) => {
  const classes = useStyles();
  const { handleChange, handleBlur } = useContext(FormContext);
  useEffect(() => {}, [field_value]);

  return (
    !field_hidden && (
      <div>
        <FormControl style={{ maxWidth: '100%', minWidth: '100%' }}>
          <label className="form-label">
            {field_label}
            <span className="ml-1">
              {field_tooltip !== undefined && field_tooltip !== '' ? (
                <Tooltip title={field_tooltip}>
                  <InfoOutlined className="h-4 w-4" />
                </Tooltip>
              ) : null}
            </span>
          </label>
          <Select
            multiple
            variant="standard"
            value={typeof field_value === 'string' ? JSON.parse(field_value) : field_value}
            onChange={(event) => handleChange(field_id, event, field_type)}
            onBlur={(_event) => handleBlur(field_id, field_value || [])}
            input={<Input />}
            renderValue={(selected) => {
              if (typeof selected?.[0] === 'object') {
                selected?.shift();
                return (
                  <div className={classes.chips}>
                    {(selected || []).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                );
              } else {
                return (
                  <div className={classes.chips}>
                    {(selected || []).map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                      />
                    ))}
                  </div>
                );
              }
            }}
            MenuProps={MenuProps}
            disabled={readonly}
          >
            {field_options.length > 0 &&
              field_options.map((option, i) => (
                <MenuItem
                  key={i}
                  value={option.option_label}
                >
                  {option.option_label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>
    )
  );
};

export default MultiSelect;
