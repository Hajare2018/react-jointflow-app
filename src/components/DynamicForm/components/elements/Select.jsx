import React, { useContext } from 'react';
import { FormContext } from '../../FormContext';
import { Tooltip } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
const Select = ({
  field_id,
  field_label,
  readonly,
  field_value,
  field_options,
  field_type,
  field_hidden,
  field_tooltip,
}) => {
  const { handleChange, handleBlur } = useContext(FormContext);

  return (
    !field_hidden && (
      <div>
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
        <select
          className="form-select"
          value={field_value}
          onChange={(event) => handleChange(field_id, event, field_type)}
          onBlur={(event) => handleBlur(field_id, event.target.value)}
          disabled={readonly}
        >
          {field_options.length > 0 &&
            field_options.map((option, i) => (
              <option
                value={option.option_label}
                key={i}
              >
                {option.option_label}
              </option>
            ))}
        </select>
      </div>
    )
  );
};

export default Select;
