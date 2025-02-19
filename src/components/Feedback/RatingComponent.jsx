import * as React from 'react';
import PropTypes from 'prop-types';
import { Rating } from '@mui/material';
import {
  SentimentDissatisfied,
  SentimentSatisfied,
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfied style={{ width: 50, height: 50 }} />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfied style={{ width: 50, height: 50 }} />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfied style={{ width: 50, height: 50 }} />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAlt style={{ width: 50, height: 50 }} />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfied style={{ width: 50, height: 50 }} />,
    label: 'Very Satisfied',
  },
};

const useStyles = makeStyles({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
  iconFilled: {},
  iconFilled1: { color: 'red' },
  iconFilled2: { color: 'orange' },
  iconFilled3: { color: 'yellow' },
  iconFilled4: { color: '#90EE90' },
  iconFilled5: { color: '#006400' },
  iconHover: {},
  iconHover1: { color: 'red' },
  iconHover2: { color: 'orange' },
  iconHover3: { color: 'yellow' },
  iconHover4: { color: '#90EE90' },
  iconHover5: { color: '#006400' },
});

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

function RatingComponent({ sentimentValue, sentiment }) {
  const classes = useStyles();
  // TODO FIXME this seems strange, value is never used
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = React.useState(0);
  const [iconFilledVar, setIconFilled] = React.useState(classes.iconFilled);
  const [iconHoverVar, setIconHover] = React.useState(classes.iconHover);
  React.useEffect(() => {
    if (sentiment === '') {
      setValue(0);
      setIconFilled(classes.iconFilled);
    }
  }, [sentiment]);
  return (
    <Rating
      name="highlight-selected-only"
      onChange={(event, newValue) => {
        setValue(newValue);
        sentimentValue(newValue);
        switch (true) {
          case newValue <= 1: {
            setIconFilled(classes.iconFilled1);
            break;
          }
          case newValue <= 2 && newValue > 1: {
            setIconFilled(classes.iconFilled2);
            break;
          }
          case newValue <= 3 && newValue > 2: {
            setIconFilled(classes.iconFilled3);
            break;
          }
          case newValue <= 4 && newValue > 3: {
            setIconFilled(classes.iconFilled4);
            break;
          }
          case newValue > 4: {
            setIconFilled(classes.iconFilled5);
            break;
          }
        }
      }}
      onChangeActive={(event, newHover) => {
        switch (true) {
          case newHover <= 1: {
            setIconHover(classes.iconHover1);
            break;
          }
          case newHover <= 2 && newHover > 1: {
            setIconHover(classes.iconHover2);
            break;
          }
          case newHover <= 3 && newHover > 2: {
            setIconHover(classes.iconHover3);
            break;
          }
          case newHover <= 4 && newHover > 3: {
            setIconHover(classes.iconHover4);
            break;
          }
          case newHover > 4: {
            setIconHover(classes.iconHover5);
            break;
          }
        }
      }}
      classes={{
        iconFilled: iconFilledVar,
        iconHover: iconHoverVar,
      }}
      IconContainerComponent={IconContainer}
      highlightselectedOnly={true}
    />
  );
}

export default React.memo(RatingComponent);
