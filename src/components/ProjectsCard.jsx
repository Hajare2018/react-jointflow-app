import { Avatar, Card, CardContent, CardHeader, Divider, Tooltip } from '@mui/material';
import { CheckCircleOutline, MonetizationOnOutlined } from '@mui/icons-material';
import React from 'react';
import { FaCalendarAlt, FaCrown, FaIndustry, FaTasks } from 'react-icons/fa';
import AppProgressbar from './AppProgressbar';
import { createImageFromInitials, currencyFormatter, dateFormat, findPercentage } from './Utils';
import newTab from '../assets/icons/OpenNewTabIconBlue.png';
import { Link } from 'react-router-dom';
import { useTenantContext } from '../context/TenantContext';

export default function ProjectsCard({ cardData, openBoard }) {
  const { tenant_locale, currency_symbol } = useTenantContext();

  return (
    <Card
      style={{ borderRadius: 8 }}
      elevation={2}
    >
      <CardContent style={{ padding: 0 }}>
        <CardHeader
          className="p-1"
          avatar={
            <Avatar
              style={{ height: 40, width: 40 }}
              src={
                cardData?.buyer_company_details_light?.company_image === null
                  ? createImageFromInitials(
                      300,
                      cardData?.buyer_company_details_light?.name,
                      '#627daf',
                    )
                  : cardData?.buyer_company_details_light?.company_image
              }
            />
          }
          title={
            <div className="d-flex">
              <Tooltip
                title={cardData?.name}
                placement="top"
                arrow
              >
                <strong
                  onClick={() => openBoard(cardData?.id)}
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bolder',
                    color: '#627daf',
                  }}
                >
                  {cardData?.name?.length > 25
                    ? (cardData?.name).substring(0, 25 - 3) + '...'
                    : cardData?.name}
                </strong>
              </Tooltip>
              <Link
                to={`/board/?id=${cardData?.id}&navbars=True&actions=True`}
                target="_blank"
              >
                <img
                  alt=""
                  src={newTab}
                  style={{ height: 15, width: 15, marginLeft: 10 }}
                />
              </Link>
            </div>
          }
          subheader={
            <div className="d-flex-row">
              <div className="d-flex-column flex-8">
                <div className="d-flex">
                  <FaIndustry style={{ color: '#627daf', width: 15, height: 15 }} />{' '}
                  <p className="ml-2">
                    {cardData?.company?.length > 25
                      ? (cardData?.company).substring(0, 25 - 3) + '...'
                      : cardData?.company}
                  </p>
                </div>
                <div className="d-flex">
                  <FaCrown style={{ color: '#627daf', width: 15, height: 15 }} />{' '}
                  <p className="ml-2">{cardData?.owner_name}</p>
                </div>
              </div>
              {cardData?.total_closed_cards == cardData?.total_cards ? (
                <div className="d-flex flex-2">
                  <CheckCircleOutline style={{ color: '#3edab7' }} />
                </div>
              ) : null}
            </div>
          }
        />
        <div style={{ padding: `0px 7px 0px 7px` }}>
          <Divider style={{ backgroundColor: '#627daf' }} />
        </div>
        <div style={{ display: 'flex', padding: 7 }}>
          <div className="d-flex flex-4">
            <FaCalendarAlt
              style={{
                color: '#627daf',
                width: 15,
                height: 15,
                marginRight: 5,
              }}
            />
            <p className="font-size">{dateFormat(new Date(cardData?.target_close_date))}</p>
          </div>
          <div className="d-flex flex-3 mr-10">
            <MonetizationOnOutlined
              style={{
                color: '#627daf',
                width: 18,
                height: 18,
                marginRight: 5,
              }}
            />
            <p className="font-size">
              {currencyFormatter(
                tenant_locale,
                cardData?.project_value === null ? 0 : cardData?.project_value,
                currency_symbol,
              )}
            </p>
          </div>
          <div className="d-flex flex-3">
            <FaTasks
              style={{
                color: '#627daf',
                width: 15,
                height: 15,
                marginRight: 5,
              }}
            />
            <Tooltip
              title={`${findPercentage(
                cardData?.total_closed_cards,
                cardData?.total_cards,
              )}% completed`}
              placement="top"
              arrow
            >
              <p className="font-size mr-3">
                {cardData?.left_cards}/{cardData?.total_cards}
              </p>
            </Tooltip>
            <AppProgressbar
              value={findPercentage(cardData?.total_closed_cards, cardData?.total_cards)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
