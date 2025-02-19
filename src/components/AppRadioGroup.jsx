import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useTenantContext } from '../context/TenantContext';

const StyledFormControlLabel = withStyles({
  root: {
    margin: '0.18rem',
    borderRadius: `2.5rem`,
    '&$selected': {
      backgroundColor: '#627daf',
      color: '#ffffff',
    },
  },
  selected: {
    backgroundColor: '#627daf',
    color: '#ffffff',
  },
})(FormControlLabel);

const SideRadioButton = ({ isInternalLocked, isAdmin, isSelected, ...muiProps }) => {
  const { checked, value } = muiProps;
  let disabled = isInternalLocked && !isAdmin;

  return (
    <Radio
      disabled={disabled}
      className={`hidden p-[5px] ${isSelected ? 'text-[#ffffff]' : 'text-[#627daf]'}`}
      checked={checked}
      value={value}
    />
  );
};

function AppRadioGroup({ filters, getFilters, startIcon, endIcon, tabId, isBackground, isAdmin }) {
  const [filterId, setFilterId] = useState(0);
  const { internal_lock_activated } = useTenantContext();
  useEffect(() => {
    setFilterId(tabId);
  }, [tabId]);
  const handleFilters = (event) => {
    setFilterId(parseInt(event.target.value));
    getFilters(parseInt(event.target.value));
  };

  return (
    <RadioGroup
      aria-labelledby="demo-controlled-radio-buttons-group"
      name="controlled-radio-buttons-group"
      value={filterId}
      onChange={handleFilters}
      className={`border-none rounded-[2rem] ${isBackground ? 'bg-[#eff2f6]' : 'bg-[#ffffff]'}`}
      row
    >
      {filters.map((filter, index) => (
        <StyledFormControlLabel
          key={filter.id}
          style={{
            backgroundColor: filterId === index ? filter.color : '#eff2f6',
            display: filter.display ? '' : 'none',
          }}
          value={filter.id}
          control={
            <SideRadioButton
              isInternalLocked={internal_lock_activated}
              isAdmin={isAdmin}
              isSelected={filterId === index}
            />
          }
          className={filter.class}
          label={
            <div className="flex m-2">
              {startIcon && (filterId === index ? filter.active : filter.icon)}
              <strong
                className={`mr-[5px] ml-[5px] ${filterId === index ? 'text-[#ffffff]' : 'text-[#858581]'}`}
              >
                {filter.name}
                {'counter' in filter ? ' (' + filter.counter + ')' : ''}
              </strong>
              {endIcon && (filterId === index ? filter.active : filter.icon)}
            </div>
          }
          checked={filterId === filter.id}
        />
      ))}
    </RadioGroup>
  );
}

export default AppRadioGroup;
