import JFTableActions from '../../component-lib/JFTableActions/JFTableActions';
import { IconButton } from '@mui/material';
import { RefreshOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function MyTasksTableActions(props) {
  const {
    searched,
    requestSearch,
    cancelSearch,
    display,
    toggleDisplay,
    handleTaskTypeSelection,
    handleStatusSelection,
    selectedTaskType,
    selectedStatus,
    taskTypes,
    refresh,
    onHome,
  } = props;

  const filters = [
    {
      id: 'task_type',
      value: selectedTaskType,
      onSelectionChange: handleTaskTypeSelection,
      options: [
        { label: '<None>', value: 'none' },
        ...taskTypes.map(([department, options]) => {
          return {
            isGroup: true,
            id: department,
            label: department,
            options: options.map((o) => ({
              label: o.custom_label,
              value: o.value,
            })),
          };
        }),
      ],
    },
    {
      id: 'status',
      value: selectedStatus,
      onSelectionChange: handleStatusSelection,
      placeholder: 'Select status',
      options: [
        {
          label: '<None>',
          value: 'none',
        },
        {
          label: 'Scheduled',
          value: 'scheduled',
        },
        {
          label: 'Ongoing',
          value: 'ongoing',
        },
        {
          label: 'Late',
          value: 'late',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
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
      viewOptions={onHome ? [] : ['list_view', 'grid_view']}
      otherActions={[
        <IconButton
          key="refresh"
          onClick={refresh}
        >
          <RefreshOutlined className="h-7 w-7" />
        </IconButton>,
        onHome && (
          <Link to="/my_tasks">
            <strong className="app-color p-3">Show Full List</strong>
          </Link>
        ),
      ]}
    />
  );
}
