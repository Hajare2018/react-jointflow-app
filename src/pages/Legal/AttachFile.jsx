import { withStyles } from '@mui/styles';
import { Badge, Tooltip } from '@mui/material';
import HttpClient from '../../Api/HttpClient';
import { timeAgo } from '../../components/Utils';
import attachImg from '../../assets/icons/Attached.png';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 20,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 2px',
    fontSize: 10,
  },
}))(Badge);

export default function AttachFile({ add, data, count }) {
  const openLink = (link) => {
    window.open(link, '_blank');
  };
  return (
    <>
      {add ? (
        <Tooltip
          title={<strong>No Documents available!</strong>}
          placement={'right'}
          arrow
        >
          <StyledBadge
            badgeContent={'0'}
            style={{ fontSize: 18, color: '#999' }}
          >
            <img
              src={attachImg}
              style={{ height: 20, width: 20 }}
            />
          </StyledBadge>
        </Tooltip>
      ) : (
        <Tooltip
          title={
            <div style={{ padding: 10 }}>
              <h4>
                <strong>Document Name:</strong> {data?.name}
              </h4>
              <h4>
                <strong>Created:</strong> {timeAgo(new Date(data?.created_at).getTime())}
              </h4>
            </div>
          }
          placement={'right'}
          arrow
        >
          <Badge
            onClick={() => openLink(data?.document_url + `/${HttpClient.api_token()}/`)}
            badgeContent={count}
            style={{ fontSize: 12 }}
            color={'secondary'}
          >
            <img
              src={attachImg}
              style={{ height: 20, width: 20 }}
            />
          </Badge>
        </Tooltip>
      )}
    </>
  );
}
