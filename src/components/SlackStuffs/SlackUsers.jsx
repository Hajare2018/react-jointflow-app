import {
  AppBar,
  Avatar,
  Chip,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
  Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Check } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inviteToJoinWorkspace, slackUserInvite } from '../../Redux/Actions/slack-stuffs';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'sticky',
    backgroundColor: '#6385b7',
    color: '#ffffff',
  },
}));

function SlackUsers({ open, handleClose, slack_channel_id, board }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.boardMembersData);
  const slackUsers = Object.keys(allUsers?.data).length > 0 ? allUsers?.data?.user_list : [];
  const handleSlackInvitaton = (e) => {
    const formData = new FormData();
    if (e.slack_id === null && !e.in_channel) {
      formData.append('channel_id', slack_channel_id);
      formData.append('email', e.email);
      dispatch(
        inviteToJoinWorkspace({
          data: formData,
          board_id: board,
          slack_channel_id: slack_channel_id,
        }),
      );
    } else if (e.slack_id !== null && !e.in_channel) {
      formData.append('channel_id', slack_channel_id);
      formData.append('user_ids', e.slack_id);
      dispatch(
        slackUserInvite({
          data: formData,
          board_id: board,
          slack_channel_id: slack_channel_id,
        }),
      );
    }
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
    >
      <AppBar className={classes.appBar}>
        <Toolbar className="d-flex justify-space-between">
          <strong>Invite to Slack channel</strong>
          <IconButton onClick={handleClose}>
            <Close style={{ color: '#ffffff' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List
        dense
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      >
        {slackUsers?.length > 0 ? (
          slackUsers.map((user) => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar src={user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div>
                    <strong style={{ marginRight: 5 }}>
                      {user.first_name + ' ' + user.last_name}
                    </strong>
                    {user.in_board && (
                      <span>
                        <Chip
                          size="small"
                          label={
                            user.in_board && user.slack_id == null ? 'Project Team Member' : '#'
                          }
                          style={{
                            color: user.in_board && user.slack_id == null ? '#6385b7' : '#611f69',
                            backgroundColor:
                              user.in_board && user.slack_id == null
                                ? 'rgba(99,133,183, 0.3)'
                                : 'rgba(97,31,105, 0.3)',
                          }}
                        />
                      </span>
                    )}
                  </div>
                }
                secondary={user.role}
              />
              <ListItemSecondaryAction>
                {user.slack_id == null ? (
                  <Tooltip title={user.slack_id === null ? 'Invite to Slack' : 'Invite to channel'}>
                    <div
                      style={{
                        cursor: 'pointer',
                      }}
                      onClick={() => handleSlackInvitaton(user)}
                    >
                      <strong style={{ color: 'green' }}>+ INVITE</strong>
                    </div>
                  </Tooltip>
                ) : (
                  <Chip
                    size="small"
                    label={<strong>In Channel</strong>}
                    icon={<Check style={{ color: '#611f69' }} />}
                    style={{
                      color: '#611f69',
                      backgroundColor: 'rgba(97,31,105, 0.3)',
                    }}
                  />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </List>
    </Dialog>
  );
}

export default React.memo(SlackUsers);
