import React from 'react';
import AccessGroupList from './AccessGroups';
import OrganizationHierarchyChart from './OrganizationHierarchyChart';
import UsersTable from './UsersTable';

function UsersTab({ view }) {
  return (
    <div>
      {view === 'full_users' ? (
        <UsersTable />
      ) : view === 'hierarchy_view' ? (
        <OrganizationHierarchyChart />
      ) : (
        <AccessGroupList />
      )}
    </div>
  );
}

export default React.memo(UsersTab);
