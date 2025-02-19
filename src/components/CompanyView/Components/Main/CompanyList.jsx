import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../Loader';
import { fetchData } from '../../../../Redux/Actions/store-data';

const StyledListItem = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f5f5f5',
      borderRadius: '0.5rem',
    },
  },
}))(ListItem);

function CompanyList() {
  const dispatch = useDispatch();
  const companyData = useSelector((state) => state.groupViewData);
  const handleId = (id) => {
    const filteredData = companyData?.data?.group_projects?.filter(
      (item) => item.buyer_company_details_light.id === id,
    );
    dispatch(fetchData(filteredData));
  };

  return companyData?.data?.group_companies?.length > 0 ? (
    <List>
      {(companyData?.data?.group_companies || [])?.map((company) => (
        <StyledListItem
          key={company.id}
          onClick={() => handleId(company.id)}
        >
          <ListItemText>
            <strong className="text-lg">{company.name}</strong>
          </ListItemText>
          <ListItemAvatar>
            <Avatar src={company.company_image} />
          </ListItemAvatar>
        </StyledListItem>
      ))}
    </List>
  ) : (
    <Loader />
  );
}

export default React.memo(CompanyList);
