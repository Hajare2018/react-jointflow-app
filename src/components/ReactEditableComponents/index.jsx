import React, { useEffect, useLayoutEffect, useRef } from 'react';
// import './editable.css';
import { convertLinks } from '../Utils';

export const ReactInlineEdit = ({
  value,
  setValue,
  checked,
  charLength,
  isDisabled,
  useTextArea,
}) => {
  const [editingValue, setEditingValue] = React.useState(null);
  const [textAreaDisabled, setTextAreaDisabled] = React.useState(false);
  const textbox = useRef();

  function adjustHeight() {
    textbox.current.style.height = 'inherit';
    textbox.current.style.height = `${textbox.current.scrollHeight}px`;
  }

  const onChange = (event) => {
    adjustHeight();
    setEditingValue(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.target.blur();
    }
  };

  useLayoutEffect(adjustHeight, []);

  useEffect(() => {
    adjustHeight();
  }, [editingValue]);

  useEffect(() => {
    let text = convertLinks(value);
    setEditingValue(text);
  }, [value]);

  const onBlur = (event) => {
    setValue(event.target.innerHTML);
    if (event.target.innerHTML.trim() === '') {
      setEditingValue(value);
    } else {
      setValue(event.target.innerHTML);
    }
  };

  const handleDisabled = (event) => {
    if (event?.target?.children?.[0]?.nodeName === 'A') {
      setTextAreaDisabled(true);
    } else {
      return;
    }
  };

  const handleEnabled = () => {
    setTextAreaDisabled(false);
  };

  return useTextArea ? (
    <div
      contentEditable={textAreaDisabled ? false : true}
      ref={textbox}
      type="text"
      aria-label="Field name"
      // value={editingValue}
      dangerouslySetInnerHTML={{ __html: editingValue }}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onMouseEnter={handleDisabled}
      onMouseLeave={handleEnabled}
      onBlur={onBlur}
      style={{
        textDecoration: checked ? 'line-through' : 'none',
        resize: 'none',
      }}
      rows={editingValue?.length > 75 ? 2 : 1}
      maxLength={charLength}
      // disabled={isDisabled}
      className="input-no-border"
    />
  ) : (
    <input
      ref={textbox}
      type="text"
      aria-label="Field name"
      value={editingValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      style={{
        textDecoration: checked ? 'line-through' : 'none',
        resize: 'none',
      }}
      maxLength={charLength}
      disabled={isDisabled}
    />
  );
};

export const ReactMultilineEdit = ({ value, setValue, text, isDisabled }) => {
  const [editingValue, setEditingValue] = React.useState(null);

  const onChange = (event) => setEditingValue(event.target.value);

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.target.blur();
    }
  };

  useEffect(() => {
    setEditingValue(value);
  }, [value]);

  const onBlur = (event) => {
    setValue(event.target.value);
    if (event.target.value.trim() === '') {
      setEditingValue(value);
    } else {
      setValue(event.target.value);
    }
  };

  const textareaRef = React.useRef();
  return (
    <textarea
      rows={1}
      aria-label="Field name"
      value={editingValue}
      onBlur={onBlur}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={'textarea'}
      placeholder={text}
      ref={textareaRef}
      disabled={isDisabled}
      style={{ resize: 'none' }}
    />
  );
};
