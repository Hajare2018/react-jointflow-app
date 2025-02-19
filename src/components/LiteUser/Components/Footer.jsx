import React from 'react';
import { Avatar, Tooltip } from '@mui/material';
import Mail from '../icons/mail';
import Phone from '../icons/phone';
import Star from '../icons/star';
import { createImageFromInitials, getDevice } from '../../Utils';

const isMobile = getDevice();
const Footer = ({ data }) => (
  <footer
    className={`card gap-3 items-center xl:mt-6 mt-4 flex justify-center ${!isMobile && 'mr-3'}`}
  >
    {Object.keys(data).length > 0 ? (
      <>
        <img
          src={
            data?.owner_details?.avatar === null
              ? createImageFromInitials(
                  200,
                  data?.owner_details?.first_name + ' ' + data?.owner_details?.last_name,
                  '#627daf',
                )
              : data?.owner_details?.avatar
          }
          className="rounded-full w-16 h-16 object-cover"
          alt=""
        />
        <div className="flex flex-col">
          <b className="text-lg opacity-90 font-bold-20">
            {data?.owner_details?.first_name + ' ' + data?.owner_details?.last_name}
          </b>
          <p className="opacity-70 mt-auto">{data?.owner_details?.role}</p>
        </div>
        <span className="relative m-2">
          <Star className="w-4 absolute z-50 right-0" />
          <button className="btn-icon active opacity-60">
            <Tooltip
              title={
                data?.owner_details?.phone_number == null ||
                data?.owner_details?.phone_number == 'undefined'
                  ? 'Unknown'
                  : data?.owner_details?.phone_number
              }
            >
              <Avatar className="w-12 h-12">
                {isMobile && data?.owner_details?.phone_number !== null ? (
                  <a
                    href={'tel:' + data?.owner_details?.phone_number}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Phone
                      className="w-8 h-8"
                      alt=""
                    />
                  </a>
                ) : (
                  <Phone
                    className="w-8 h-8"
                    alt=""
                  />
                )}
              </Avatar>
            </Tooltip>
          </button>
        </span>
        <button className="btn-icon active opacity-60">
          <Avatar className="w-12 h-12">
            <a
              href={'mailto:' + data?.owner_details?.email}
              target="_blank"
              rel="noreferrer"
            >
              <Mail className="w-8 h-8" />
            </a>
          </Avatar>
        </button>
      </>
    ) : (
      <div className="text-centre app-color font-bold-24">
        <strong>No Owner details available</strong>
      </div>
    )}
  </footer>
);

export default React.memo(Footer);
