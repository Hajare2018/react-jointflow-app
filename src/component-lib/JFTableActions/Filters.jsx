import React from 'react';

function getOptions(filter) {
  return filter.options.map((option) => {
    if (option.isGroup) {
      return (
        <optgroup
          key={option.id}
          label={option.label}
        >
          {option.options.map((o, i) => (
            <option
              key={`${o.value}_${i}`}
              value={o.value}
            >
              {o.label}
            </option>
          ))}
        </optgroup>
      );
    }

    return (
      <option
        key={option.value}
        value={option.value}
      >
        {option.label}
      </option>
    );
  });
}

export default function Filters(props) {
  const { filters = [] } = props;

  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className="d-flex"
      style={{ gap: 8 }}
    >
      <label
        className="form-label"
        style={{ width: 200, color: '#222', textWrap: 'nowrap' }}
      >
        Filter by:
      </label>
      {filters.map((filter) => (
        <select
          placeholder="Select an option"
          className="text-input task-type mr-3"
          style={{ color: '#000000' }}
          key={filter.id}
          value={filter.value === null ? '' : filter.value}
          onChange={filter.onSelectionChange}
        >
          {getOptions(filter)}
        </select>
      ))}
    </div>
  );
}
