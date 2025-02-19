import { Tooltip } from '@mui/material';
import { DirectionsBus } from '@mui/icons-material';
import React, { useReducer } from 'react';
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

const TOUR_STEPS = [
  {
    target: '.tour-menu',
    content:
      "Menu linking to key functionality. If you don't see much, ask you admin to modify your access group.",
    disableBeacon: true,
    placement: 'right',
  },
  {
    target: '.tour-settings',
    content:
      'Application Settings, where you can manage User access the Document Library, Project Templates and much more...',
  },
  {
    target: '.tour-profile',
    content:
      'Click here to edit your profile, change password and setup multi-factor authentcation.',
  },
  {
    target: '.tour-logout',
    content: 'Click here to logout, By default you will stay logged-in for 48 hours.',
  },
  {
    target: '.tour-customize-button',
    content: 'This is where you can customize widgets.',
  },
  {
    target: '.tour-project-widget',
    content:
      "This is where you can find Top-5 Projects and By clicking on 'Full List', you will be redirected to access all created projects.",
  },
  {
    target: '.tour-link',
    content: 'This is where you can start the tour again in future.',
  },
];

const PROJECT_TOUR_STEPS = [
  {
    target: '.tour-project-cards',
    content: 'This is where you can find projects summary.',
    disableBeacon: true,
  },
  {
    target: '.tour-project-table',
    content:
      'This dashboard gives you an overview of the ongoing projects. You can click a column header to sort the list.',
  },
  {
    target: '.tour-project-table-header',
    content: 'Search by name and toggle between open and closed projects.',
  },
  {
    target: '.tour-project-add',
    content: 'Click here to create a new project.',
    placement: 'left',
  },
  {
    target: '.tour-crm-table',
    content:
      'Click here to import deal/opportunity from CRM and convert it into a closing project.',
    placement: 'left',
  },
];

const INSIGHTS_TOUR_STEPS = [
  {
    target: '.tour-insight-cards',
    content: 'This is where you can find projects summary.',
    disableBeacon: true,
  },
  {
    target: '.tour-project-header',
    content:
      'This is where you can filter projects by their timescales and show/hide projects with having tasks/No tasks.',
  },
  {
    target: '.tour-project-details',
    content: 'This is where you can find details of the project and gantt chart of each tasks.',
  },
  {
    target: '.tour-project-new',
    content: 'This is where you can create new project.',
    placement: 'left',
  },
];

const url = window.location.href;

const switchSteps = () => {
  if (url.includes('projects')) {
    return PROJECT_TOUR_STEPS;
  }
  if (url.includes('insights')) {
    return INSIGHTS_TOUR_STEPS;
  } else {
    return TOUR_STEPS;
  }
};

const INITIAL_STATE = {
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: switchSteps(),
};

// Reducer will manage updating the local state
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'START':
      return { ...state, run: true };
    case 'RESET':
      return { ...state, stepIndex: 0 };
    case 'STOP':
      return { ...state, run: false };
    case 'NEXT_OR_PREV':
      return { ...state, ...action.payload };
    case 'RESTART':
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
      };
    default:
      return state;
  }
};

// Tour component
const Tour = () => {
  // Tour state is the state which control the JoyRide component
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);

  // useEffect(() => {
  //   // Auto start the tour if the tour is not viewed before
  //   if (!localStorage.getItem("tour")) {
  //     dispatch({ type: "START" });
  //   }
  // }, []);

  // Set once tour is viewed, skipped or closed
  const setTourViewed = () => {
    localStorage.setItem('tour', '1');
  };

  const callback = (data) => {
    const { action, index, type, status } = data;

    if (
      // If close button clicked, then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      setTourViewed();
      dispatch({ type: 'STOP' });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Check whether next or back button click and update the step.
      dispatch({
        type: 'NEXT_OR_PREV',
        payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
      });
    }
  };

  const startTour = () => {
    // Start the tour manually
    dispatch({ type: 'RESTART' });
  };

  return (
    <>
      <li
        style={{ listStyle: 'none' }}
        className="items-center tour-link"
        onClick={startTour}
      >
        <Tooltip
          title="App Tour"
          placement="bottom"
          arrow
        >
          <DirectionsBus style={{ height: 40, width: 40, color: '#95a0b8' }} />
        </Tooltip>
      </li>
      <JoyRide
        {...tourState}
        callback={callback}
        showSkipButton={true}
        styles={{
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonBack: {
            marginRight: 10,
          },
          buttonNext: {
            backgroundColor: '#627daf',
          },
        }}
        locale={{
          last: 'End tour',
        }}
      />
    </>
  );
};

export default Tour;
