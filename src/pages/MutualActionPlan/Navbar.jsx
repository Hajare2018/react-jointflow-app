import clsx from 'clsx';
import { Navbar, NavbarItem, NavbarSection } from '../../component-lib/catalyst/navbar';

export default function MaapNavigation({ tabs, selectedTabIndex, onTabSelect }) {
  const tabsToDisplay = tabs.filter((tab) => tab.display);

  return (
    <Navbar className="overflow-x-auto">
      <NavbarSection className={clsx('flex-1', tabsToDisplay.length > 3 ? 'justify-between' : '')}>
        <NavbarItem
          current={selectedTabIndex === 0}
          onClick={() => onTabSelect(0)}
        >
          Your Task
        </NavbarItem>
        <NavbarItem
          current={selectedTabIndex === 1}
          onClick={() => onTabSelect(1)}
        >
          Project
        </NavbarItem>
        {tabsToDisplay.map((tab, index) => (
          <NavbarItem
            current={selectedTabIndex === index + 2}
            onClick={() => onTabSelect(index + 2)}
            key={tab.tab_name}
          >
            {tab.tab_name}
          </NavbarItem>
        ))}
      </NavbarSection>
    </Navbar>
  );
}
