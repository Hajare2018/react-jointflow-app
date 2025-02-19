import React from 'react';
import OrganizationChart from '@dabeng/react-orgchart';
import { CompanyNode, UserNode } from './CompanyNode';
import { useSelector } from 'react-redux';

function CompanyHierarchy({ forGroup, forContacts }) {
  const hierarchy = useSelector((state) => state.companyHierarchyData);
  const hierarchy_data = hierarchy?.data?.length > 0 ? hierarchy?.data?.[0] : [];
  const user_hierarchy = useSelector((state) => state.userHierarchyData);
  const user_hierarchy_data = user_hierarchy?.data?.length > 0 ? user_hierarchy?.data : [];

  const custom_hierarchy = {
    id: 0,
    first_name: hierarchy_data?.name,
    last_name: '',
    avatar: hierarchy_data?.company_image,
    role: 'Organization',
    children: user_hierarchy_data,
  };

  return (
    <div>
      {forGroup ? (
        <OrganizationChart
          datasource={hierarchy_data}
          chartClass="myChart"
          NodeTemplate={CompanyNode}
        />
      ) : forContacts ? (
        <OrganizationChart
          datasource={custom_hierarchy}
          chartClass="myChart"
          NodeTemplate={UserNode}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export default React.memo(CompanyHierarchy);
