import React from 'react';
import CompanyLogo from '../icons/cmpny-logo.png';
import { useSelector } from 'react-redux';

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

const Header = ({ data, vendor }) => {
  const liteData = useSelector((state) => state.dashboardLiteData);
  let project = liteData?.data?.length > 0 ? liteData?.data?.[0] : [];
  return (
    <header className="card xl:mb-6 mb-4">
      <div className="flex sm:justify-center md:gap-8">
        <HeaderItem
          title={vendor?.company_name}
          logo={vendor?.company_logo}
          rightLogo
        />
        <div className="border-l border-black md:block hidden opacity-50" />
        <HeaderItem
          title={
            project?.buyer_company_details_light == null
              ? 'NA'
              : project?.buyer_company_details_light?.name
          }
          logo={
            project?.buyer_company_details_light == null
              ? CompanyLogo
              : project?.buyer_company_details_light?.company_image
          }
          leftLogo
        />
      </div>
      <strong className="text-center block font-bold-24 mt-4">{data?.name}</strong>
    </header>
  );
};

export default React.memo(Header);
