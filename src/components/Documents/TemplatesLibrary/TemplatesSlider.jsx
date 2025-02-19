import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import { CheckCircleOutlined } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import Coverflow from 'react-coverflow';
import { useDispatch, useSelector } from 'react-redux';
import { cloneBoard } from '../../../Redux/Actions/clone-data';
import { show } from '../../../Redux/Actions/loader';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import { currencyFormatter, dateFormat, getPlurals } from '../../Utils';
import { useTenantContext } from '../../../context/TenantContext';

function TemplatesSlider({ company_id }) {
  const [selected, setSelected] = useState(null);
  const allProjects = useSelector((state) => state.templatesData);
  const data = useSelector((state) => state.storedData);
  const dispatch = useDispatch();
  const allData = allProjects.data.length > 0 ? allProjects.data : [];
  const { tenant_locale, currency_symbol } = useTenantContext();
  const handleBoard = (e) => {
    if (e.deSelect) {
      setSelected(null);
    } else {
      setSelected(e);
    }
  };
  useEffect(() => {}, [selected]);

  const handleCloningTemplate = () => {
    dispatch(show(true));
    const requestBody = {
      template_id: selected?.id,
      project_name: data?.data?.name,
      buyer_company: data?.data?.buyer_company === '' ? company_id : data?.data?.buyer_company,
      project_value: data?.data?.project_value,
      target_end_date: data?.data?.target_close_date,
      crm_id: data?.data?.crm_id ? data?.data?.crm_id : null,
    };

    dispatch(cloneBoard({ data: requestBody }));
  };
  return (
    <div>
      <Coverflow
        width="900"
        height="500"
        enableHeading={false}
        displayQuantityOfSide={1}
        enableScroll={true}
        active={0}
        media={{
          '@media (max-width: 900px)': {
            width: '325px',
            height: '400px',
          },
          '@media (min-width: 900px)': {
            width: '960px',
            height: '600px',
          },
        }}
      >
        {allData?.map((board) => (
          <Flippy
            key={board.id}
            flipOnHover={true}
            flipOnClick={false}
            flipDirection="vertical"
            // ref={(r) => this.flippy = r}
            style={{ width: '100%', height: '160px' }}
          >
            <FrontSide>
              <img
                src={
                  board?.thumbnail_file !== ''
                    ? board?.thumbnail_file
                    : 'https://via.placeholder.com/1080x800/627daf/ffffff?text=jointflows.com'
                }
                style={{
                  width: '100%',
                  height: '160px',
                }}
              />
              <div
                className="text-centre"
                style={{ color: '#ffffff', backgroundColor: '#6385b7' }}
              >
                <p>{board?.name}</p>
              </div>
            </FrontSide>
            <BackSide
              style={{
                backgroundColor: '#6385b7',
                color: '#ffffff',
              }}
            >
              <div className="flippy-back-div">
                <div
                  className="list-font"
                  style={{ flex: 8 }}
                >
                  <h4>{board?.name}</h4>
                  <li>Tasks: {board?.cards?.filter((card) => card.archived === false)?.length}</li>
                  <li>No. times used: {board?.times_used_as_template}</li>
                  <li>No. of Documents: {board?.docs_count}</li>
                  <li>Duration: {getPlurals(board?.calculated_duration, 'Day')}</li>
                  <li>
                    Average deal value:{' '}
                    <strong>
                      {currencyFormatter(
                        tenant_locale,
                        board?.project_value === null ? '0' : board?.project_value,
                        currency_symbol,
                      )}
                    </strong>
                  </li>
                  <li>Last Updated: {dateFormat(new Date(board?.last_activity_dt))}</li>
                </div>
                <div className="flippy-back-btn">
                  <Tooltip
                    title={
                      selected?.name === board?.name
                        ? `Un select ${board?.name}`
                        : `Select ${board?.name}`
                    }
                    placement="top"
                    arrow
                  >
                    {selected?.name === board?.name ? (
                      <IconButton
                        onClick={() => handleBoard({ deSelect: true })}
                        disableRipple
                      >
                        <CheckCircleOutlined style={{ height: 40, width: 40, color: '#33e0b3' }} />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => handleBoard(board)}
                        disableRipple
                      >
                        <CheckCircleOutlined style={{ height: 40, width: 40, color: '#ffffff' }} />
                      </IconButton>
                    )}
                  </Tooltip>
                </div>
              </div>
            </BackSide>
          </Flippy>
        ))}
      </Coverflow>
      {selected !== null && (
        <div style={{ width: '100%', padding: 10 }}>
          <CheckCircleOutlined style={{ fontSize: 30, float: 'left', color: '#33e0b3' }} />
          <Typography
            style={{ float: 'left' }}
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected?.name} selected
          </Typography>
          <Button
            variant="contained"
            onClick={handleCloningTemplate}
            style={{
              backgroundColor: '#6385b7',
              marginBottom: 10,
              color: '#ffffff',
              fontSize: 16,
              float: 'right',
            }}
          >
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
}

export default React.memo(TemplatesSlider);
