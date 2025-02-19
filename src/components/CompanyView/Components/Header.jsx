import React from 'react';
import { useSelector } from 'react-redux';
import { useUserContext } from '../../../context/UserContext';

const HeaderItem = ({ title, logo, leftLogo, rightLogo }) => (
  <div
    className="d-flex justify-centre"
    style={{ minWidth: 200 }}
  >
    {leftLogo && (
      <img
        src={logo}
        className="sm:h-12 h-12 mr-3"
        alt=""
      />
    )}
    <strong className="block md:mb-1 font-bold-20">{title}</strong>
    {rightLogo && (
      <img
        src={logo}
        className="sm:h-12 h-12 ml-3"
        alt=""
      />
    )}
  </div>
);

const Header = () => {
  const { user } = useUserContext();
  const vendor = useSelector((state) => state.vendorData);
  const pathname = new URL(window.location.href);
  const company_logo = new URLSearchParams(pathname.search).get('logo');
  const company_name = new URLSearchParams(pathname.search).get('name');

  return (
    <header className="card xl:mb-6 mb-4">
      <div className="flex sm:justify-center md:gap-24">
        <HeaderItem
          title={vendor?.data?.company_name}
          logo={vendor?.data?.company_logo}
          leftLogo
        />
        <div className="border-l border-black md:block hidden opacity-50" />
        <HeaderItem
          title={
            user?.light_buyer_company_details == null
              ? company_name
              : user?.light_buyer_company_details?.name
          }
          logo={
            user?.light_buyer_company_details == null
              ? company_logo
              : user?.light_buyer_company_details?.company_image
          }
          leftLogo
        />
      </div>
      <strong className="text-center block font-bold-24 mt-4">Group View</strong>
    </header>
  );
};

export default React.memo(Header);
