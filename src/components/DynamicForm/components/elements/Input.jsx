import React, { useContext } from 'react';
import { FormContext } from '../../FormContext';
import { Tooltip } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

const Input = ({
  field_id,
  field_label,
  field_placeholder,
  field_value,
  field_type,
  field_length,
  readonly,
  field_hidden,
  field_tooltip,
}) => {
  const { handleChange, handleBlur } = useContext(FormContext);
  return (
    !field_hidden && (
      <div className="mb-3">
        <label
          htmlFor="exampleInputEmail1"
          className="form-label"
        >
          {field_label}
          <span className="ml-1">
            {field_tooltip !== undefined && field_tooltip !== '' ? (
              <Tooltip title={field_tooltip}>
                <InfoOutlined className="h-4 w-4" />
              </Tooltip>
            ) : null}
          </span>
        </label>
        <input
          type="text"
          className="text-input"
          id="exampleInputEmail1"
          placeholder={field_placeholder ? field_placeholder : ''}
          value={field_value}
          onChange={(event) => handleChange(field_id, event, field_type)}
          onBlur={(event) => {
            handleBlur(field_id, event.target.value);
          }}
          maxLength={field_length}
          readOnly={readonly}
        />
      </div>
    )
  );
};

export default Input;
