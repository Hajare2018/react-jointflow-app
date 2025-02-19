import JFTableActions from '../../component-lib/JFTableActions/JFTableActions';
import { Tooltip } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';

export default function QueuesTableActions(props) {
  const {
    searched,
    requestSearch,
    cancelSearch,
    display,
    toggleDisplay,
    handleTaskTypeSelection,
    handleStatusSelection,
    handleAssigneeSelection,
    handleDepartmentSelection,
    selectedTaskType,
    selectedStatus,
    selectedAssignee,
    selectedDepartment,
    taskTypes,
    assignees,
    departments,
    exportData,
    handleSaveFilters,
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
      id: 'assignee',
      value: selectedAssignee,
      onSelectionChange: handleAssigneeSelection,
      options: [
        {
          value: 'none',
          label: '<None>',
        },
        {
          value: 0,
          label: '<Unassigned>',
        },
        ...assignees?.map((assignee) => ({
          value: assignee.id,
          label: `${assignee.first_name} ${assignee.last_name}`,
        })),
      ],
    },
    {
      id: 'department',
      value: selectedDepartment,
      onSelectionChange: handleDepartmentSelection,
      options: [
        {
          value: 'none',
          label: '<None>',
        },
        ...departments?.map((department) => ({
          value: `${department}`,
          label: department,
        })),
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
      viewOptions={['list_view', 'gantt_view', 'grid_view']}
      exportData={exportData}
      otherActions={
        <Tooltip
          title="Save current filter settings"
          placement="top"
        >
          <div
            style={{
              borderRadius: '50%',
              backgroundColor: '#6385b7',
              padding: 8,
              cursor: 'pointer',
            }}
            onClick={handleSaveFilters}
          >
            <SaveOutlined className="white-color h-7 w-7" />
          </div>
        </Tooltip>
      }
    />
  );
}
