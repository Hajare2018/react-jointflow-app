import React, { useContext } from 'react';
import { FormContext } from '../../FormContext';
import { InfoOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
const Checkbox = ({
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
      <div className="flex items-center mb-4">
        <input
          id={field_id}
          type="checkbox"
          checked={field_value}
          onChange={(event) => handleChange(field_id, event, field_type)}
          onBlur={(event) => handleBlur(field_id, event.target.checked)}
          readOnly={readonly}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor={field_id}
          className="ms-2 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          {field_label}
          <span className="ml-1">
            {field_tooltip !== undefined && field_tooltip !== '' && (
              <Tooltip title={field_tooltip}>
                <InfoOutlined className="h-4 w-4" />
              </Tooltip>
            )}
          </span>
        </label>
      </div>
    )
  );
};

export default Checkbox;
