import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HttpClient from '../Api/HttpClient';
import Loader from '../components/Loader';
import BoardPriorities from '../components/Workload/BoardPriorities';
import { requestProjectsInLiteView } from '../Redux/Actions/documents-data';
import { show } from '../Redux/Actions/loader';
import { useUserContext } from '../context/UserContext';

function BoardWorkload() {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state?.liteViewProjectsData);
  const boards_data = boards?.data?.length > 0 ? boards?.data : [];
  const { user } = useUserContext();

  useEffect(() => {
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Board Priorities',
      },
      account: { id: HttpClient.tenant() },
    });
    dispatch(show(true));
    dispatch(requestProjectsInLiteView({ closedBoards: false }));
  }, []);

  return (
    <main
      id="page"
      className="panel-view"
    >
      {boards?.data?.length > 0 ? (
        <div className="mt-2">
          <BoardPriorities data={boards_data} />
        </div>
      ) : (
        <Loader />
      )}
    </main>
  );
}

export default React.memo(BoardWorkload);
