import React, { useEffect, useRef, useState } from 'react';
import uploadCloud from '../../../assets/icons/Upload Cloud.svg';
import fromLibraryIcon from '../../../assets/icons/from_library.png';

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 10000000;

const UploadFile = ({
  label,
  updateFilesCb,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  uploadFromLibrary,
  handleFromLibrary,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    // for (let file of newFiles) {
    if (newFiles.size <= maxFileSizeInBytes) {
      if (!otherProps.multiple) {
        return { newFiles };
      }
      files[newFiles.name] = newFiles;
    } else {
      // TODO FIXME no alert
      // eslint-disable-next-line no-alert
      alert('Sorry but this file is too large to be uploaded!');
    }
    // }
    return { ...files };
  };

  const callUpdateFilesCb = (files) => {
    updateFilesCb(files);
  };

  const handleNewFileUpload = (e) => {
    const newFiles = e.target.files[0];
    if (newFiles) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  // TODO FIXME why?
  useEffect(() => {}, [files]);

  return (
    <>
      <section
        style={{
          position: 'relative',
          top: '50',
          margin: '25px 0 15px',
          border: '2px dashed #627daf',
          padding: '60px 20px',
          borderRadius: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          height: '20vh',
        }}
      >
        <label
          style={{
            top: '-45px',
            fontSize: '14px !important',
            fontWeight: 600,
            color: 'black',
            left: 0,
            position: 'absolute',
            wordBreak: 'unset',
          }}
        >
          {label}
        </label>
        <img
          src={uploadFromLibrary ? fromLibraryIcon : uploadCloud}
          style={{ width: 30, height: 30 }}
        />
        <button
          style={{
            cursor: 'pointer',
            fontSize: '22px !important',
            fontWeight: '700',
          }}
          onClick={uploadFromLibrary ? handleFromLibrary : handleUploadBtnClick}
        >
          {uploadFromLibrary ? 'Select from Library' : 'Upload A File'}
        </button>
        {!uploadFromLibrary && (
          <input
            type="file"
            ref={fileInputField}
            onChange={handleNewFileUpload}
            style={{
              fontSize: '18px',
              display: 'block',
              width: '100%',
              border: 'none',
              textTransform: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0,
              '&:hover': { outline: 'none' },
            }}
            {...otherProps}
          />
        )}
      </section>
    </>
  );
};

export default React.memo(UploadFile);
