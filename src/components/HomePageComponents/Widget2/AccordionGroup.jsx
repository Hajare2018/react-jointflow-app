import React, { useMemo } from 'react';
import { withStyles } from '@mui/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ArrowForwardIosSharp } from '@mui/icons-material';
import StatusTable from './StausTable';
import { useSelector } from 'react-redux';
import { createData, getFilteredValues } from '../../Utils';
import { useUserContext } from '../../../context/UserContext';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

function AccordionGroup() {
  const [expanded, setExpanded] = React.useState('');
  const { user } = useUserContext();
  const forecast = useSelector((state) => state.forecastData);
  const forecastData = Object.keys(forecast?.data).length > 0 ? forecast?.data?.boards : [];
  const current_view = user?.homepage_view;
  const onTrack = useMemo(
    () => getFilteredValues(forecastData, 'on track', current_view, true),
    [forecast],
  );
  const closed = useMemo(
    () => getFilteredValues(forecastData, 'closed', current_view, true),
    [forecast],
  );
  const upSide = useMemo(
    () => getFilteredValues(forecastData, 'upside', current_view, true),
    [forecast],
  );
  const slipping = useMemo(
    () => getFilteredValues(forecastData, 'slipping', current_view, true),
    [forecast],
  );

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const accordionData = [
    createData('Closed', closed, 'panel1', '#37b7db'),
    createData('On Track', onTrack, 'panel2', '#91cf51'),
    createData('Upside', upSide, 'panel3', '#ffbf00'),
    createData('Slipping', slipping, 'panel4', '#ec7d31'),
  ];

  return (
    <div>
      {accordionData?.map((accordion, index) => (
        <Accordion
          key={index}
          square
          expanded={expanded === accordion.value1}
          onChange={handleChange(accordion.value1)}
        >
          <AccordionSummary
            style={{ backgroundColor: '#ffffff', color: accordion.value2, opacity: 1 }}
            expandIcon={
              <ArrowForwardIosSharp style={{ fontSize: '0.9rem', color: accordion.value2 }} />
            }
            aria-controls="panel1d-content"
            id="panel1d-header"
          >
            <strong>{accordion.name + '(' + accordion.value.length + ')'}</strong>
          </AccordionSummary>
          <AccordionDetails style={{ backgroundColor: '#ffffff' }}>
            {accordion.value.length > 0 ? (
              <StatusTable data={accordion.value} />
            ) : (
              <strong>No Record(s) found!</strong>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default React.memo(AccordionGroup);
