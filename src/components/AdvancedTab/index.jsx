import React from 'react';
import FaqTable from './FAQTab/FaqTable';
import TenantAttributesList from './TenantAttributes/TenantAttributesList';
import { useUserContext } from '../../context/UserContext';
 
function AdvancedTab({ view }) {
  const { permissions } = useUserContext();
  const allPermissions = permissions.group.map((access) => access.permission);

  const viewAdvancedTab = allPermissions?.filter(
    (access) => access?.codename === 'view_advanced_settings_tab',
  );
  const viewFaqTab = allPermissions?.filter((access) => access?.codename === 'view_faq_management');
  return view === 'tenants'
    ? viewAdvancedTab?.length > 0 && <TenantAttributesList />
    : view === 'faqs'
      ? viewFaqTab?.length > 0 && <FaqTable />
      : '';
}

export default React.memo(AdvancedTab);
