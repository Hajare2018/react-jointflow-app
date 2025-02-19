import React from 'react';
import Checkbox from './elements/Checkbox.jsx';
import Input from './elements/Input.jsx';
import Select from './elements/Select.jsx';
import DatePicker from './elements/DatePicker.jsx';
import LinkField from './elements/LinkField.jsx';
import MultiSelect from './elements/MultiSelect.jsx';
const Element = ({
  field: {
    field_type,
    field_id,
    field_label,
    field_placeholder,
    field_value,
    field_options,
    field_length,
    readonly,
    field_hidden,
    field_tooltip,
  },
}) => {
  switch (field_type) {
    case 'text':
      return (
        <Input
          field_id={field_id}
          field_label={field_label}
          field_placeholder={field_placeholder}
          field_value={field_value}
          field_type={field_type}
          field_length={field_length}
          readonly={readonly}
          field_hidden={field_hidden}
          field_tooltip={field_tooltip}
        />
      );
    case 'select':
      return (
        <Select
          field_id={field_id}
          field_label={field_label}
          field_placeholder={field_placeholder}
          field_value={field_value}
          field_options={field_options}
          field_type={field_type}
          readonly={readonly}
          field_hidden={field_hidden}
          field_tooltip={field_tooltip}
        />
      );
    case 'multiselect':
      return (
        <MultiSelect
          field_id={field_id}
          field_label={field_label}
          field_placeholder={field_placeholder}
          field_value={field_value}
          field_options={field_options}
          field_type={field_type}
          readonly={readonly}
          field_hidden={field_hidden}
          field_tooltip={field_tooltip}
        />
      );
    case 'checkbox':
      return (
        <Checkbox
          field_id={field_id}
          field_label={field_label}
          field_value={field_value}
          field_type={field_type}
          readonly={readonly}
          field_hidden={field_hidden}
          field_tooltip={field_tooltip}
        />
      );
    case 'date':
      return (
        <DatePicker
          field_id={field_id}
          field_label={field_label}
          field_value={field_value}
          field_type={field_type}
          readonly={readonly}
          field_hidden={field_hidden}
          field_tooltip={field_tooltip}
        />
      );
    case 'link':
      return (
        <LinkField
          field_id={field_id}
          field_label={field_label}
          field_placeholder={field_placeholder}
          field_value={field_value}
          field_type={field_type}
          readonly={readonly}
          field_hidden={field_hidden}
          field_tooltip={field_tooltip}
        />
      );
    default:
      return (
        <Input
          field_id={field_id}
          field_label={field_label}
          field_placeholder={field_placeholder}
          field_value={field_value}
          field_type={field_type}
          readonly={readonly}
          field_hidden={field_hidden}
          field_tooltip={field_tooltip}
        />
      );
  }
};

export default Element;
