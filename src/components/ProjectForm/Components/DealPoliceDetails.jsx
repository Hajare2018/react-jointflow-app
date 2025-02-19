import { ArrowForward } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editDealPolice } from '../../../Redux/Actions/deal-police';

function DealPoliceDetails({ close, placeholder, id }) {
  const dispatch = useDispatch();
  const [details, setDetails] = useState('');

  useEffect(() => {
    setDetails(placeholder?.value);
  }, [placeholder]);

  const handleDetails = (event) => {
    setDetails(event.target.value);
  };

  const handleUpdateDetails = () => {
    const formData = new FormData();
    formData.append(placeholder.key, details);
    dispatch(
      editDealPolice({
        deal_police_id: id?.deal_police_id,
        data: formData,
        card_id: id?.card_id,
      }),
    );
    close();
  };
  return (
    <div
      style={{
        border: '2px solid #627daf',
        borderRadius: '0.45em',
      }}
      className="d-flex justify-centre"
    >
      <input
        className="police-input-edit"
        placeholder={`Enter details`}
        value={details}
        onChange={handleDetails}
        type="text"
        maxLength={100}
        autoFocus
      />
      <button
        onClick={handleUpdateDetails}
        style={{
          height: 40,
          width: 40,
          backgroundColor: '#627daf',
          color: '#ffffff',
          borderRadius: '10%',
        }}
      >
        <ArrowForward
          style={{
            height: 15,
            width: 15,
            color: '#ffffff',
          }}
        />
      </button>
    </div>
  );
}

export default React.memo(DealPoliceDetails);
