import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import DocumentsTable from '../../ProjectForm/Components/DocumentsTable';
import DocumentsTemplate from '../../Documents/DocumentsLibrary/DocumentsTemplate';
import Loader from '../../Loader';
import OptionsModal from '../../Documents/TemplatesLibrary/OptionsModal';

function Documents({ id, forTaskTypes }) {
  const [openLibrary, setOpenLibrary] = useState(false);
  const showPrompt = useSelector((state) => state.dialog);
  const prompt_data = useSelector((state) => state.populatedFromType);
  const loader = useSelector((state) => state.showLoader);
  const allDocuments = useSelector((state) => state.uploadedDocs);
  const singleTask = useSelector((state) => state.singleCardData);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data?.[0] : [];
  const handleToggleLibrary = () => {
    setOpenLibrary(!openLibrary);
  };
  return (
    <div className="d-flex-column">
      <div className="d-flex justify-end p-3">
        <Button
          onClick={handleToggleLibrary}
          variant="outlined"
        >
          + Add from library
        </Button>
      </div>
      <div className="p-3">
        {loader.show ? (
          <Loader />
        ) : (
          <DocumentsTable
            table_data={forTaskTypes ? allDocuments?.data : singleTaskData?.attachments}
          />
        )}
      </div>
      <DocumentsTemplate
        forTaskTypes={forTaskTypes}
        open={openLibrary}
        card={forTaskTypes ? id : singleTaskData?.id}
        handleClose={handleToggleLibrary}
      />
      <OptionsModal
        open={showPrompt?.show}
        cardData={singleTaskData}
        optionData={prompt_data?.data}
        doNothing
      />
    </div>
  );
}

export default React.memo(Documents);
