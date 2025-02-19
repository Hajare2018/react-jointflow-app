import { Avatar, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { createImageFromInitials } from '../../components/Utils';

const tooltipStyles = makeStyles(() => ({
  customWidth: {
    maxWidth: 1200,
  },
}));

export default function TaskAssignees({ internal, external, handleAssignment }) {
  const classes = tooltipStyles();
  return (
    <div className="d-flex-row">
      <Tooltip
        classes={{ tooltip: classes.customWidth }}
        title={
          internal === null ? (
            <div className="p-1">
              <h4>
                <strong>This task is not assigned yet, click to assign!</strong>
              </h4>
            </div>
          ) : (
            <div className="d-flex justify-centre p-3">
              <div>
                <Avatar
                  src={
                    (internal?.avatar === null ||
                      internal?.avatar?.split('/')?.[4] == 'undefined') &&
                    internal?.first_name !== 'undefined'
                      ? createImageFromInitials(
                          200,
                          internal?.first_name + ' ' + internal?.last_name,
                          '#6385b7',
                        )
                      : internal?.first_name == 'undefined'
                        ? ''
                        : internal?.avatar
                  }
                  style={{ height: 80, width: 80 }}
                />
              </div>
              <div
                style={{
                  height: 80,
                  width: 2,
                  backgroundColor: '#ffffff',
                  margin: 10,
                }}
              />
              <div>
                <h4>
                  <strong>Name:</strong> {internal?.first_name + internal?.last_name}
                </h4>
                <h4>
                  <strong>Email:</strong> {internal?.email}
                </h4>
                <h4>
                  <strong>Phone:</strong>
                  {internal?.phone_number === 'false' ||
                  internal?.phone_number === '' ||
                  internal?.phone_number == 'undefined'
                    ? 'Unknown'
                    : internal?.phone_number}
                </h4>
              </div>
            </div>
          )
        }
        placement={'bottom'}
        arrow
      >
        {internal === null ? (
          <Avatar style={{ height: 20, width: 20, marginRight: 7 }}>
            <strong
              onClick={handleAssignment}
              style={{ color: '#6385b7' }}
            >
              +
            </strong>
          </Avatar>
        ) : (
          <Avatar
            src={
              (internal?.avatar === null || internal?.avatar?.split('/')?.[4] == 'undefined') &&
              internal?.first_name !== 'undefined'
                ? createImageFromInitials(
                    200,
                    internal?.first_name + ' ' + internal?.last_name,
                    '#6385b7',
                  )
                : internal?.first_name == 'undefined'
                  ? ''
                  : internal?.avatar
            }
            style={{ height: 20, width: 20, marginRight: 7 }}
          />
        )}
      </Tooltip>
      <Tooltip
        classes={{ tooltip: classes.customWidth }}
        title={
          external === null ? (
            <div className="p-1">
              <strong>This task is not assigned yet!</strong>
            </div>
          ) : (
            <div className="d-flex justify-centre p-3">
              <div>
                <Avatar
                  src={
                    external?.avatar === null
                      ? createImageFromInitials(
                          200,
                          external?.first_name + ' ' + external?.last_name,
                          '#6385b7',
                        )
                      : internal?.first_name == 'undefined'
                        ? ''
                        : external?.avatar
                  }
                  style={{ height: 80, width: 80 }}
                />
              </div>
              <div
                style={{
                  height: 80,
                  width: 2,
                  backgroundColor: '#ffffff',
                  margin: 10,
                }}
              />
              <div>
                <h4>
                  <strong>Name:</strong> {external?.first_name + external?.last_name}
                </h4>
                <h4>
                  <strong>Email:</strong> {external?.email}
                </h4>
                <h4>
                  <strong>Phone:</strong>
                  {external?.phone_number === 'false' ||
                  external?.phone_number === '' ||
                  external?.phone_number == 'undefined'
                    ? 'Unknown'
                    : external?.phone_number}
                </h4>
              </div>
            </div>
          )
        }
        placement={'bottom'}
        arrow
      >
        <Avatar
          src={
            external?.avatar === null
              ? createImageFromInitials(
                  200,
                  external?.first_name + ' ' + external?.last_name,
                  '#6385b7',
                )
              : internal?.first_name == 'undefined'
                ? ''
                : external?.avatar
          }
          style={{ height: 20, width: 20 }}
        />
      </Tooltip>
    </div>
  );
}
