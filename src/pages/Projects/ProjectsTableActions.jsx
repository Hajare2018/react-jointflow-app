import React from 'react';
import { Tooltip, Switch, FormControlLabel } from '@mui/material';
import JFTableActions from '../../component-lib/JFTableActions/JFTableActions';
import { useTenantContext } from '../../context/TenantContext';

export default function ProjectsTableActions(props) {
  const {
    searched,
    requestSearch,
    cancelSearch,
    handleSwitch,
    selectedUser,
    handleSelectUser,
    user,
    usersData = [],
    selectedType,
    handleSelectedType,
    newData,
    display,
    toggleDisplay,
    closed,
  } = props;
  const { project_type_list } = useTenantContext();

  const filters = [
    {
      id: 'by-user',
      value: selectedUser,
      onSelectionChange: handleSelectUser,
      options: [
        {
          value: user.id,
          label: '<My Projects>',
        },
        {
          value: 'all',
          label: '<All>',
        },
        {
          value: 'my_team_boards',
          label: '<My Team>',
        },
        {
          value: 'paused',
          label: '<Paused>',
        },
        ...usersData
          .filter((u) => u.id !== user.id)
          .map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name}`,
          })),
      ],
    },
    {
      id: 'by-type',
      value: selectedType,
      onSelectionChange: handleSelectedType,
      options: [
        { value: null, label: 'Select' },
        ...(project_type_list || []).map((type) => ({
          value: type,
          label: type,
        })),
      ],
    },
  ];

  return (
    <JFTableActions
      searchText={searched}
      handleSearchTextChange={requestSearch}
      handleCancelSearch={cancelSearch}
      filters={filters}
      viewOptionValue={display}
      handleViewChange={toggleDisplay}
      exportData={newData}
      otherActions={
        <Tooltip
          title={(closed ? 'Hide' : 'Show') + 'Closed Projects'}
          placement="bottom"
          arrow
        >
          <FormControlLabel
            style={{ float: 'right', marginLeft: 10 }}
            control={
              <Switch
                checked={closed}
                onChange={handleSwitch}
                name="checkedA"
              />
            }
            label={
              <span style={{ fontSize: '1rem' }}>{closed ? 'Hide' : 'Show'} Closed Projects</span>
            }
          />
        </Tooltip>
      }
    />
  );
}
