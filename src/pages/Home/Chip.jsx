import { Avatar, Chip } from '@mui/material';
import { TuneOutlined } from '@mui/icons-material';

export default function ChipSelector({ onClick, isMobile, label, user }) {
  return (
    <Chip
      onClick={onClick}
      size={isMobile && 'small'}
      avatar={<Avatar src={user} />}
      label={<strong>{label}</strong>}
      variant="outlined"
      className="app-color app-border-color"
      clickable
      deleteIcon={<TuneOutlined />}
    />
  );
}
