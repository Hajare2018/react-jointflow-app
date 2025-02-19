import React, { useContext } from 'react';
import { FormContext } from '../../FormContext';
import { FileCopyOutlined, InfoOutlined, LaunchOutlined } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showInfoSnackbar } from '../../../../Redux/Actions/snackbar';

function LinkField({
  field_id,
  field_label,
  field_placeholder,
  field_value,
  field_type,
  readonly,
  field_hidden,
  field_tooltip,
}) {
  const dispatch = useDispatch();
  const { handleChange, handleBlur } = useContext(FormContext);
  const handleCopy = () => {
    navigator.clipboard.writeText(field_value);
    dispatch(showInfoSnackbar('Copied to clipboard!'));
  };
  return (
    !field_hidden && (
      <div>
        <label
          htmlFor="link"
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
        <div className="d-flex">
          <input
            type="text"
            className="text-input"
            id="link"
            placeholder={field_placeholder ? field_placeholder : ''}
            value={field_value}
            onChange={(event) => handleChange(field_id, event, field_type)}
            onBlur={(event) => {
              handleBlur(field_id, event.target.value);
            }}
            readOnly={readonly}
          />
          <Tooltip
            title={'Copy link to clipboard'}
            placement="top"
          >
            <button
              className="btn-copy linkedin-copy"
              onClick={handleCopy}
              type="button"
            >
              <FileCopyOutlined />
            </button>
          </Tooltip>
          <Tooltip
            title={'Open into New tab'}
            placement="top"
          >
            <a
              href={field_value}
              className="btn-copy new-tab-btn"
              target="_blank"
              type="button"
              rel="noreferrer"
            >
              <LaunchOutlined className="h-4 w-4" />
            </a>
          </Tooltip>
        </div>
      </div>
    )
  );
}

export default React.memo(LinkField);
