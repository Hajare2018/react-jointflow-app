import React, { useEffect } from 'react';
import TemplatesLibrary from '../components/Documents/TemplatesLibrary/TemplatesLibrary';
import { useDispatch } from 'react-redux';
import { fetchSingleCrmDeal } from '../Redux/Actions/crm-data';
import { getUser } from '../Redux/Actions/user-info';
import { useTenantContext } from '../context/TenantContext';

function CreateProject() {
  const dispatch = useDispatch();
  const path = new URL(window.location.href);
  const deal_id = new URLSearchParams(path.search).get('crm_id');
  const crm_name = new URLSearchParams(path.search).get('crm_system');
  const isNavbar = new URLSearchParams(path.search).get('navbars');
  const { crm_system } = useTenantContext();

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        getUser({
          fetchPermissions: true,
          isLightUser: false,
          fetchSingleUser: true,
        }),
      );
      if (crm_system !== undefined) {
        dispatch(
          fetchSingleCrmDeal({
            crm: crm_system,
            deal: deal_id,
          }),
        );
      }
    }, 3000);
  }, [crm_system]);

  return (
    <div
      className="d-flex-column"
      style={{
        width: '100%',
        marginTop: isNavbar === 'True' ? '5%' : 'auto',
        padding: 10,
      }}
    >
      <TemplatesLibrary
        selectedCompany={crm_name}
        clone
        isCrm={true}
      />
    </div>
  );
}

export default React.memo(CreateProject);
