import React, { useEffect, useState } from 'react';
import AppRadioGroup from '../../../../AppRadioGroup';
import { useDispatch, useSelector } from 'react-redux';
import NegotiationsList from './NegotiationsList';
import { requestClauseList } from '../../../../../Redux/Actions/document-upload';
import { Star, VisibilityOffOutlined } from '@mui/icons-material';
import { setMessage } from '../../../../../Redux/Actions/loader';
import Check from '../../../../LiteUser/icons/check';

function Negotiations() {
  const dispatch = useDispatch();
  const [listData, setListData] = useState(null);
  const doc_data = useSelector((state) => state.storedData);
  const clauses = useSelector((state) => state.clausesData);
  const noDataMessage = useSelector((state) => state.messageData);
  const clauseData = clauses?.data?.length > 0 ? clauses?.data : [];
  const [filterId, setFilterId] = useState(0);

  const legalFiltersArr = [
    {
      id: 0,
      name: 'All',
      counter: doc_data?.data?.clauses_counts?.clause_count,
      icon: <Check className="w-4 text-blue" />,
      active: <Check className="w-4 text-white" />,
      color: '#33e0b3',
      display: true,
    },
    {
      id: 1,
      name: 'Push Backs',
      counter: doc_data?.data?.clauses_counts?.modified_count,
      icon: <Check className="w-4 text-blue" />,
      active: <Check className="w-4 text-white" />,
      color: '#33e0b3',
      display: true,
    },
    {
      id: 2,
      name: 'Star',
      counter: doc_data?.data?.clauses_counts?.star_count,
      icon: <Star style={{ color: '#FFC300' }} />,
      active: <Star className="w-4 text-white" />,
      color: '#33e0b3',
      display: true,
    },
    {
      id: 3,
      name: 'Hidden',
      icon: <VisibilityOffOutlined style={{ color: '#a2a2a2' }} />,
      active: <VisibilityOffOutlined className="w-4 text-white" />,
      color: '#33e0b3',
      display: true,
    },
  ];

  const handleFilters = (id) => {
    setFilterId(id);
    dispatch(setMessage('Loading...'));
    if (id == 0) {
      dispatch(requestClauseList({ doc_id: doc_data?.data?.id, hidden: false }));
    }
    if (id == 1) {
      dispatch(requestClauseList({ doc_id: doc_data?.data?.id, modified: true }));
    }
    if (id == 2) {
      dispatch(requestClauseList({ doc_id: doc_data?.data?.id, stareClauses: true }));
    }
    if (id == 3) {
      dispatch(requestClauseList({ doc_id: doc_data?.data?.id, hidden: true }));
    }
  };

  useEffect(() => {
    setListData(clauseData);
  }, [clauses]);
  return (
    <div>
      <div
        style={{ width: 490 }}
        className="m-2"
      >
        <AppRadioGroup
          filters={legalFiltersArr}
          getFilters={handleFilters}
          tabId={0}
          startIcon
        />
      </div>
      <div className="list-height">
        {listData?.length > 0 ? (
          <NegotiationsList
            list={listData}
            docData={doc_data?.data}
            filters={filterId}
          />
        ) : (
          <div className="div-center mt-3">
            <strong>{noDataMessage.message}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Negotiations);
