import React, { useEffect, useState } from 'react';
import HttpClient from '../Api/HttpClient';
import { useUserContext } from './UserContext';
import Loader from '../components/Loader';

const TenantContext = React.createContext({});

// TODO do we want to limit to these items only?
// const tenantDataKeys = [
//   'activate_deal_police',
//   'activate_notifications',
//   'activate_steplist',
//   'company_logo',
//   'company_name',
//   'crm_integrated',
//   'crm_system',
//   'currency_symbol',
//   'departments_list',
//   'enable_maap_link',
//   'hubspot_import_stage',
//   'hubspot_pipeline_id',
//   'meddpicc_enabled',
//   'mscrm_import_stage',
//   'project_type_list',
//   'sfdc_import_stage',
//   'slack_integrated',
//   'smtp_server',
//   'tag_categories',
//   'tenant_locale',
//   'year_end_month',
// ];

function transformValue(attribute) {
  switch (attribute.type) {
    case 'Text': {
      if (attribute.name === 'project_type_list' || attribute.name === 'departments_list') {
        return attribute.value_text.split(', ');
      }

      if (attribute.name === 'tag_categories') {
        return attribute.value_text.split(',');
      }
      return attribute.value_text;
    }
    case 'Bool':
      return attribute.value_bool;
    case 'Integer':
      return attribute.value_int;
    default:
      return attribute;
  }
}

export function TenantContextProvider({ children }) {
  const { isAuthenticated, isTenantUser } = useUserContext();
  const [tenant] = useState(() => {
    const tenantName = window.location.hostname.split('.').shift();

    return tenantName === 'localhost' ? 'tinyclues' : tenantName;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tenantAttributes, setTenantAttributes] = useState({
    activate_deal_police: undefined,
    activate_notifications: undefined,
    activate_steplist: undefined,
    company_logo: undefined,
    company_name: undefined,
    crm_integrated: undefined,
    crm_system: undefined,
    currency_symbol: undefined,
    departments_list: [],
    enable_maap_link: undefined,
    hubspot_import_stage: undefined,
    hubspot_pipeline_id: undefined,
    meddpicc_enabled: undefined,
    mscrm_import_stage: undefined,
    project_type_list: [],
    sfdc_import_stage: undefined,
    slack_integrated: undefined,
    smtp_server: undefined,
    tag_categories: undefined,
    tenant_locale: undefined,
    year_end_month: undefined,
    pandadoc_api_key: undefined,
    internal_lock_activated: undefined,
  });

  const contextValue = {
    tenant,
    isLoading,
    ...tenantAttributes,
  };

  useEffect(() => {
    async function loadTenantData() {
      try {
        const { data } = await HttpClient.fetchTenantAttributes();

        const loadedTenantAttributes = data
          // .filter((attribute) => {
          //   tenantDataKeys.includes(attribute.name);
          // })
          .map((attribute) => [attribute.name, transformValue(attribute)]);

        setTenantAttributes((current) => {
          return {
            ...current,
            ...Object.fromEntries(loadedTenantAttributes),
          };
        });
        setIsLoading(false);
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        /* empty */
      }
    }

    if (tenant && isAuthenticated && isTenantUser) {
      setIsLoading(true);
      loadTenantData();
    }
  }, [tenant, isAuthenticated, isTenantUser]);

  return (
    <TenantContext.Provider value={contextValue}>
      {isLoading ? <Loader fullscreen /> : children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const contextValue = React.useContext(TenantContext);

  return contextValue;
}
