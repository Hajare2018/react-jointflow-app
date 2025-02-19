import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '../../component-lib/catalyst/dropdown';
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from '../../component-lib/catalyst/navbar';
import { Avatar } from '../../component-lib/catalyst/avatar';
import checkPermission from './check-permission';

export default function JFNavbar({ user, permissions, logoutUser }) {
  return (
    <Navbar>
      <NavbarSpacer />
      <NavbarSection>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <Avatar
              src={user.avatar}
              square
            />
          </DropdownButton>
          <DropdownMenu
            className="min-w-64"
            anchor="bottom end"
          >
            <DropdownItem href="/profile">
              <DropdownLabel>Profile</DropdownLabel>
            </DropdownItem>
            {checkPermission('view_settings_menu')(permissions) && (
              <DropdownItem href="/settings">
                <DropdownLabel>Settings</DropdownLabel>
              </DropdownItem>
            )}
            <DropdownDivider />
            <DropdownItem onClick={logoutUser}>
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
}
