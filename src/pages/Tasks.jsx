import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormTabs from '../components/ProjectForm/FormTabs';
import { requestDocumentsType } from '../Redux/Actions/documents-type';
import getSingleTask from '../Redux/Actions/single-task';

function Tasks() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState([]);
  const taskData = useSelector((state) => state.singleCardData);
  useEffect(() => {
    let url = new URL(window.location.href);
    let board_id = new URLSearchParams(url.search).get('board');
    let card_id = new URLSearchParams(url.search).get('card');
    setFormData({
      edit: true,
      taskId: card_id,
      boardId: board_id,
      buyer_company: taskData?.data?.[0]?.buyer_company_details?.id,
    });
    dispatch(requestDocumentsType());
    dispatch(
      getSingleTask({
        card_id: card_id,
        board_id: board_id,
        task_info: true,
      }),
    );
  }, []);
  const doNothing = () => {
    return;
  };
  return (
    <main
      id="page"
      className="panel-view"
    >
      <div className="mt-3">
        {taskData?.data?.length > 0 ? (
          <FormTabs
            onClose={doNothing}
            formData={formData}
          />
        ) : (
          <div className="text-centre">
            <strong>Sorry this entry is not available. It might have been archived.</strong>
          </div>
        )}
      </div>
    </main>
  );
}

export default React.memo(Tasks);
