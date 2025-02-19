import {
  Add,
  AssignmentIndOutlined,
  Close,
  Edit,
  LocalBarOutlined,
  MobileFriendlyOutlined,
  SettingsBackupRestoreOutlined,
  SwapVertOutlined,
} from '@mui/icons-material';

function isString(value) {
  return typeof value === 'string';
}

export const DealPoliceIcons = (data, add) => {
  const dataArr = [
    {
      id: 0,
      icon: <MobileFriendlyOutlined />,
      name: `Mobile contact${
        isFinite(data?.mobile?.mobile_number) ? ': ' + data?.mobile?.mobile_number : ''
      }`,
      deal_police: data?.mobile,
      actions: [
        {
          icon: <MobileFriendlyOutlined />,
          background: '#cccccc',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'in_touch_mobile',
          value: 'unchecked',
          name: 'Not Checked',
        },
        {
          icon: <MobileFriendlyOutlined />,
          background: 'lightgreen',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'in_touch_mobile',
          value: 'checkedok',
          name: 'Checked and OK',
        },
        {
          icon: <MobileFriendlyOutlined />,
          background: 'lightcoral',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'in_touch_mobile',
          value: 'checkedissue',
          name: 'Checked and Issue',
        },
        {
          icon: !add ? <Edit /> : <Close />,
          background: 'rgba(98,125, 175, 1.7)',
          color: '#ffffff',
          key: 'mobile_number',
          value: 'details_for_mobile',
          name: 'Edit Details',
        },
      ],
    },
    {
      id: 1,
      icon: <SettingsBackupRestoreOutlined />,
      name: `Recurring Meet${
        isString(data?.meeting?.recurring_meeting_details)
          ? ': ' + data?.meeting?.recurring_meeting_details
          : ''
      }`,
      deal_police: data?.meeting,
      actions: [
        {
          icon: <SettingsBackupRestoreOutlined />,
          background: '#cccccc',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'recurring_meeting_setup',
          value: 'unchecked',
          name: 'Not Checked',
        },
        {
          icon: <SettingsBackupRestoreOutlined />,
          background: 'lightgreen',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'recurring_meeting_setup',
          value: 'checkedok',
          name: 'Checked and OK',
        },
        {
          icon: <SettingsBackupRestoreOutlined />,
          background: 'lightcoral',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'recurring_meeting_setup',
          value: 'checkedissue',
          name: 'Checked and Issue',
        },
        {
          icon: !add ? <Add /> : <Close />,
          background: 'rgba(98,125, 175, 1.7)',
          color: '#ffffff',
          key: 'recurring_meeting_details',
          value: 'details_for_recurring_meeting',
          name: 'Edit Details',
        },
      ],
    },
    {
      id: 2,
      icon: <LocalBarOutlined />,
      name: `Holidays${
        isString(data?.holiday?.checked_holidays_details)
          ? ': ' + data?.holiday?.checked_holidays_details
          : ''
      }`,
      deal_police: data?.holiday,
      actions: [
        {
          icon: <LocalBarOutlined />,
          background: '#cccccc',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'checked_holidays',
          value: 'unchecked',
          name: 'Not Checked',
        },
        {
          icon: <LocalBarOutlined />,
          background: 'lightgreen',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'checked_holidays',
          value: 'checkedok',
          name: 'Checked and OK',
        },
        {
          icon: <LocalBarOutlined />,
          background: 'lightcoral',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'checked_holidays',
          value: 'checkedissue',
          name: 'Checked and Issue',
        },
        {
          icon: !add ? <Add /> : <Close />,
          background: 'rgba(98,125, 175, 1.7)',
          color: '#ffffff',
          key: 'checked_holidays_details',
          value: 'details_for_holidays',
          name: 'Edit Details',
        },
      ],
    },
    {
      id: 3,
      icon: <SwapVertOutlined />,
      name: `Fall-back contact${
        isString(data?.fallback?.fallback_contact) ? ': ' + data?.fallback?.fallback_contact : ''
      }`,
      deal_police: data?.fallback,
      actions: [
        {
          icon: <SwapVertOutlined />,
          background: '#cccccc',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'has_fall_back_contact',
          value: 'unchecked',
          name: 'Not Checked',
        },
        {
          icon: <SwapVertOutlined />,
          background: 'lightgreen',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'has_fall_back_contact',
          value: 'checkedok',
          name: 'Checked and OK',
        },
        {
          icon: <SwapVertOutlined />,
          background: 'lightcoral',
          color: 'rgba(98,125, 175, 1.7)',
          key: 'has_fall_back_contact',
          value: 'checkedissue',
          name: 'Checked and Issue',
        },
        {
          icon: !add ? <AssignmentIndOutlined /> : <Close />,
          background: 'rgba(98,125, 175, 1.7)',
          color: '#ffffff',
          key: 'fallback_contact',
          value: 'details_for_fall_back_contact',
          name: 'Edit Details',
        },
      ],
    },
  ];
  return dataArr;
};
