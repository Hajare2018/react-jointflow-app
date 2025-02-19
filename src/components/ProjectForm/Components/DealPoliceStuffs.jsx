import { makeStyles } from '@mui/styles';
import { CloseOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editDealPolice } from '../../../Redux/Actions/deal-police';
import { getSingleUser } from '../../../Redux/Actions/user-info';
import QuickDial from '../../QuickDial';
import AddNewUser from '../../Users/AddNewUser';
import DealPoliceDetails from './DealPoliceDetails';
import { DealPoliceIcons } from './DealPoliceIcons';
import { useUserContext } from '../../../context/UserContext';

const useStyles = makeStyles(() => ({
  allFab: {
    margin: 12,
    bottom: 35,
    right: -7,
    zIndex: 9,
    position: 'absolute',
  },
  details: {
    margin: 12,
    bottom: 37,
    right: 182,
    zIndex: 9,
    position: 'absolute',
  },
}));

function DealPoliceStuffs({ showAssignees }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState('');
  const [editUser, setEditUser] = useState(false);
  const singleTask = useSelector((state) => state.singleCardData);
  const user_data = useSelector((state) => state.singleUserData);
  const singleTaskData = singleTask?.data?.length > 0 ? singleTask?.data[0] : [];
  const isExternalData =
    singleTaskData?.external_assignee_details != null &&
    singleTaskData?.external_assignee_deal_police?.deal_police !== null;
  const dealPoliceData =
    singleTaskData?.external_assignee_deal_police !== null
      ? singleTaskData?.external_assignee_deal_police?.deal_police?.[0]
      : [];
  const dataArr = DealPoliceIcons(dealPoliceData, show);
  const { user: parsedUser } = useUserContext();
  const classes = useStyles();
  const doQuickDial = (e) => {
    const formData = new FormData();
    formData.append('board', singleTaskData?.board);
    formData.append('user', parsedUser?.id);
    formData.append(e.key, e.value);
    return e.name === 'Edit Details'
      ? handleDealPoliceDetails(e)
      : dispatch(
          editDealPolice({
            deal_police_id: dealPoliceData?.id,
            data: formData,
            card_id: singleTaskData?.id,
            board: singleTaskData?.board,
          }),
        );
  };

  const handleShow = () => {
    setShow(!show);
  };

  const handleEditUser = () => {
    setEditUser(!editUser);
  };

  const handleDealPoliceDetails = (e) => {
    if (e.value == 'details_for_recurring_meeting' || e.value == 'details_for_holidays') {
      setDetail({
        key: e.key,
        value:
          e.value == 'details_for_recurring_meeting'
            ? dealPoliceData?.meeting?.recurring_meeting_details
            : dealPoliceData?.holiday?.checked_holidays_details,
      });
      handleShow();
    }
    if (e.value == 'details_for_fall_back_contact') {
      showAssignees();
    }
    if (e.value == 'details_for_mobile') {
      handleEditUser();
    }
  };

  useEffect(() => {}, [user_data]);

  useEffect(() => {
    if (singleTask?.data?.[0]?.external_assignee_details?.id !== undefined) {
      dispatch(
        getSingleUser({
          id: singleTask?.data[0]?.external_assignee_details?.id,
        }),
      );
    }
  }, [singleTask]);

  const userData = {
    edit: true,
    id: user_data?.data?.id,
    first_name: user_data?.data?.first_name,
    last_name: user_data?.data?.last_name,
    email: user_data?.data?.email,
    company_name: user_data?.data?.buyer_company_details?.name,
    role: user_data?.data?.role,
    is_staff: user_data?.data?.is_staff,
    is_active: user_data?.data?.is_active,
    user_type: user_data?.data?.user_type,
    data_joined: user_data?.data?.date_joined,
    company_id: user_data?.data?.buyer_company_details?.id,
    linkedin_url: user_data?.data?.linkedin_url,
    phone_number: user_data?.data?.phone_number,
    avatar: user_data?.data?.avatar,
    disabled: true,
    reports_to: user_data?.data?.reports_to,
    access_group: user_data?.data?.user_access_group,
    target: user_data?.data?.target_value,
    card_id: singleTaskData?.id,
    deal_police_id: dealPoliceData?.id,
  };

  return isExternalData ? (
    <div
      className="d-flex justify-centre"
      style={{ position: 'relative' }}
    >
      {show ? (
        <div className={classes.details}>
          <DealPoliceDetails
            close={handleShow}
            placeholder={detail}
            id={{
              deal_police_id: dealPoliceData?.id,
              card_id: singleTaskData?.id,
            }}
          />
        </div>
      ) : (
        ''
      )}
      {dataArr.map((item) => (
        <div
          className="m-1 d-flex justify-centre"
          key={item.id}
        >
          <QuickDial
            openIcon={item.icon}
            closeIcon={<CloseOutlined />}
            actions={item.actions}
            handleQuickDial={doQuickDial}
            justify={'flex-end'}
            direction={'row-reverse'}
            buttonName={item.id}
            toggleName={item.name}
            toggleButtonStyles={{
              background:
                item.deal_police == undefined
                  ? '#cccccc'
                  : item.deal_police?.unchecked
                    ? '#cccccc'
                    : item.deal_police?.checkedok
                      ? 'lightgreen'
                      : item.deal_police?.checkedissue
                        ? 'lightcoral'
                        : '',
              color: 'rgba(98,125, 175, 1.7)',
            }}
            styles={{
              secondary: classes.allFab,
            }}
            forDealPolice
          />
        </div>
      ))}
      <AddNewUser
        open={editUser}
        handleClose={handleEditUser}
        forEdit={userData}
        forDealPolice
      />
    </div>
  ) : (
    ''
  );
}

export default React.memo(DealPoliceStuffs);
