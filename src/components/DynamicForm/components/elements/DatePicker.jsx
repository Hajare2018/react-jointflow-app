import React, { useContext } from 'react';
import { FormContext } from '../../FormContext';
import { InfoOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const DatePicker = ({
  field_id,
  field_label,
  field_value,
  field_type,
  readonly,
  field_hidden,
  field_tooltip,
}) => {
  const { handleChange, handleBlur } = useContext(FormContext);
  return (
    !field_hidden && (
      <div className="mb-3">
        <label
          htmlFor="datePicker"
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
          id="date_picker"
          type="date"
          value={field_value}
          className={'text-input'}
          readOnly={readonly}
          onChange={(date) => {
            handleChange(field_id, date, field_type);
          }}
          onBlur={(event) => {
            handleBlur(field_id, event.target.value);
          }}
        />
      </div>
    )
  );
};

export default React.memo(DatePicker);
