import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import React from 'react';

function MenuPopover({ anchorEl, handleClose, getClicked, data, transformValue }) {
  const handleMenuClick = (id) => {
    getClicked(id);
    handleClose();
  };
  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      getContentAnchorEl={null}
      disableAutoFocusItem
      open={Boolean(anchorEl)}
      onClose={handleClose}
      PaperProps={{
        style: {
          // left: "50%",
          transform: transformValue,
        },
      }}
    >
      {data.map((menu) => (
        <MenuItem
          key={menu.id}
          onClick={() => handleMenuClick(menu.id)}
        >
          <ListItemIcon>{menu.icon}</ListItemIcon>
          {menu.label}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default React.memo(MenuPopover);
