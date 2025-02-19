import React, { useEffect, useState } from 'react';
import { cleanData } from '../components/ChartComponent/SunburstChart/clean-data';
import { buildTree } from '../components/ChartComponent/SunburstChart/build-tree';
import Sunburst from 'sunburst-chart';
import HttpClient from '../Api/HttpClient';
import { useDispatch, useSelector } from 'react-redux';
import requestDocumentsData from '../Redux/Actions/documents-data';
import { show } from '../Redux/Actions/loader';
import { CircularProgress } from '@mui/material';
import { getAllUsers } from '../Redux/Actions/user-info';
import { useUserContext } from '../context/UserContext';
import { useTenantContext } from '../context/TenantContext';

function AnalyticsPage() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.sunburstData);
  const message = useSelector((state) => state.messageData);
  const loader = useSelector((state) => state.showLoader);
  const { user } = useUserContext();
  const [selectedUser, setSelectedUser] = useState(user?.id);
  const [selectedType, setSelectedType] = useState(null);
  const { project_type_list: projectTypeList } = useTenantContext();
  const allUsers = useSelector((state) => state.allUsersData);
  const usersData = allUsers?.data?.length > 0 ? allUsers?.data : [];
  usersData?.sort((a, b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
      return -1;
    }
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  const myChart = Sunburst();

  useEffect(() => {
    dispatch(show(true));
    dispatch(
      requestDocumentsData({
        fetch_sunburst_data: true,
        filterByTemplate: false,
      }),
    );
    dispatch(getAllUsers({ onlyStaff: true }));
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Analytics Page',
      },
      account: { id: HttpClient.tenant() },
    });
  }, []);

  useEffect(() => {
    const data = buildTree(cleanData(projects?.data?.length > 0 ? projects?.data : []));
    myChart
      .data(data)
      .label((node) => node.cards[0]?.task_type_details.custom_label || 'all')
      .color((node) => {
        if (node.cards[0]?.task_type_details.color === '#ffffff') {
          return '#dddddd';
        }

        return node.cards[0]?.task_type_details.color || '#37a4e6';
      })
      .size((node) => {
        if (node.children.length === 0) {
          return node.boards.length;
        }

        return undefined;
      })
      .excludeRoot(true)
      .showTooltip(() => true)
      .tooltipTitle((node) => node.cards[0]?.task_type_details.custom_label || 'all')
      .tooltipContent((node) => {
        const boardCount = node.boards.length;
        const closedBoards = node.boards.filter((b) => b.closed);
        const closedBoardCount = closedBoards.length;
        const closedBoardValue = closedBoards.reduce((pre, curr) => pre + curr.project_value, 0);
        return projects?.data?.length > 0
          ? `Nb Project: ${boardCount}<br>Nb Closed Projects: ${closedBoardCount}<br>Closed Projects Value: ${closedBoardValue}`
          : message.message;
      })(document.getElementById('chart'));
  }, [projects]);

  const handleSelectUser = (event) => {
    dispatch(show(true));
    setSelectedUser(event.target.value);
    if (event.target.value === 'my_team_boards') {
      dispatch(
        requestDocumentsData({
          fetch_sunburst_data: true,
          filterByTemplate: false,
          closedBoards: false,
          my_team_boards: true,
          project_type: selectedType,
        }),
      );
    } else if (event.target.value === 'all') {
      dispatch(
        requestDocumentsData({
          fetch_sunburst_data: true,
          filterByTemplate: false,
          closedBoards: false,
          project_type: selectedType,
        }),
      );
    } else {
      dispatch(
        requestDocumentsData({
          fetch_sunburst_data: true,
          filterByTemplate: false,
          closedBoards: false,
          owner: event.target.value,
          project_type: selectedType,
        }),
      );
    }
  };

  const handleSelectType = (event) => {
    dispatch(show(true));
    setSelectedType(event.target.value);
    dispatch(
      requestDocumentsData({
        fetch_sunburst_data: true,
        filterByTemplate: false,
        closedBoards: false,
        my_team_boards: selectedUser === 'my_team_boards' ? true : false,
        owner: selectedUser,
        project_type: event.target.value,
      }),
    );
  };

  return !loader.show ? (
    <div className="flex flex-col">
      <div
        className="d-flex selectbox selectbox-m"
        style={{ width: '40%' }}
      >
        <label
          className="form-label"
          style={{ width: '45%', color: '#222', marginLeft: 20 }}
        >
          Filter by:
        </label>
        <select
          className="text-input task-type mr-3"
          style={{ color: '#000000' }}
          value={selectedUser}
          onChange={handleSelectUser}
        >
          <option value={user?.id}>{`<My Projects>`}</option>
          <option value="all">{`<All>`}</option>
          <option value="my_team_boards">{`<My Team>`}</option>
          {(usersData || [])?.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >
              {user.first_name + ' ' + user.last_name}
            </option>
          ))}
        </select>
        {(projectTypeList || []).length > 0 && (
          <select
            className="text-input task-type mr-3"
            style={{ color: '#000000' }}
            value={selectedType}
            onChange={handleSelectType}
          >
            <option>Select</option>
            {(projectTypeList || [])?.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        )}
      </div>
      <div
        id="chart"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50%',
          transform: '50%',
          margin: '0 auto',
          textAlign: 'center',
        }}
      ></div>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        transform: '50%',
        margin: '250px auto',
        textAlign: 'center',
      }}
    >
      <CircularProgress />
    </div>
  );
}

export default React.memo(AnalyticsPage);
