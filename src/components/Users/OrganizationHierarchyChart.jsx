import React, { useEffect } from 'react';
import OrganizationChart from '@dabeng/react-orgchart';
import { useDispatch, useSelector } from 'react-redux';
import { requestOrgHierarchy } from '../../Redux/Actions/user-access';
import MyNode from './MyNode';
import { useTenantContext } from '../../context/TenantContext';

function OrganizationHierarchyChart() {
  const dispatch = useDispatch();
  const hierarchy_data = useSelector((state) => state.orgHierarchyData);
  const { company_logo, company_name } = useTenantContext();
  const hierarchy = hierarchy_data?.data?.length > 0 ? hierarchy_data?.data : '';
  const custom_hierarchy = {
    id: 0,
    first_name: company_name,
    last_name: '',
    avatar: company_logo,
    role: 'Organization',
    children: hierarchy,
  };
  useEffect(() => {
    dispatch(requestOrgHierarchy());
  }, []);

  return (
    <div style={{ width: 'auto', maxWidth: 'calc(100vw - 210px)' }}>
      <OrganizationChart
        datasource={custom_hierarchy}
        chartClass="myChart"
        NodeTemplate={MyNode}
      />
    </div>
  );
}

export default React.memo(OrganizationHierarchyChart);
