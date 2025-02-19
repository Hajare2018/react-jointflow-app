import React, { useEffect, useState } from 'react';
import AppSwitch from '../../AppSwicth';
import ChangesList from './ChangesList';
import { useSelector } from 'react-redux';

function Changes() {
  const [insertionSwitch, setInsertionSwitch] = useState(true);
  const [deletionSwitch, setDeletionSwitch] = useState(true);
  const [listData, setListData] = useState(null);
  const doc_data = useSelector((state) => state.storedData);
  const doc_properties =
    Object.keys(doc_data?.data || {})?.length > 0 ? doc_data?.data?.document_properties : [];
  let inserted_text =
    'inserted_text' in (doc_properties || {}) ? doc_properties?.inserted_text : [];
  inserted_text?.length > 0 &&
    inserted_text?.forEach((element) => {
      element.inserted = true;
    });
  const deleted_text = 'deleted_text' in (doc_properties || {}) ? doc_properties?.deleted_text : [];
  deleted_text?.length > 0 &&
    deleted_text?.forEach((element) => {
      element.deleted = true;
    });
  const all_changes = inserted_text?.concat(deleted_text);
  const handleInsertionSwitch = (event) => {
    setInsertionSwitch(event.target.checked);
  };

  const handleDeletionSwitch = (event) => {
    setDeletionSwitch(event.target.checked);
  };

  useEffect(() => {
    setListData(all_changes);
  }, [doc_data]);

  useEffect(() => {
    if (insertionSwitch && !deletionSwitch) {
      setListData(inserted_text);
    } else if (deletionSwitch && !insertionSwitch) {
      setListData(deleted_text);
    } else if (insertionSwitch && deletionSwitch) {
      setListData(all_changes);
    } else if (!insertionSwitch && !deletionSwitch) {
      setListData(null);
    }
  }, [insertionSwitch, deletionSwitch]);

  return (
    <div>
      <div className="d-flex width-33 ml-3 p-0">
        <AppSwitch
          switchLabel="All Insertions"
          switchedValue={insertionSwitch}
          handleSwitch={handleInsertionSwitch}
          switchedName={'insertions'}
        />
        <AppSwitch
          switchLabel="All Deletions"
          switchedValue={deletionSwitch}
          handleSwitch={handleDeletionSwitch}
          switchedName={'deletions'}
        />
      </div>
      {listData === null || !listData.length ? (
        <div className="text-centre mt-3">
          <strong>No Tracked changes found!</strong>
        </div>
      ) : (
        <ChangesList
          data={listData}
          textOnly={doc_data?.data?.text_only}
        />
      )}
    </div>
  );
}

export default React.memo(Changes);
