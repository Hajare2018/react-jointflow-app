import React from 'react';
import { FaPoundSign, FaFileAlt, FaFlag } from 'react-icons/fa';
import { currencyFormatter, getCurrencySymbol } from '../../components/Utils';
import { useTenantContext } from '../../context/TenantContext';

export default function ProjectsOverview(props) {
  const { projectCount, totalRedFlags, totalValue } = props;
  const { tenant_locale, currency_symbol } = useTenantContext();

  return (
    <div
      id="analytics-card"
      className="analytics-card-container tour-project-cards"
    >
      <div className="analytics-card analytics-card__one">
        <div className="analytics-card__content">
          <p>Total Projects</p>
          <h1>{projectCount}</h1>
        </div>
        <div className="analytics-card__icon">
          <FaFileAlt
            size={32}
            color={'#3edab7'}
          />
        </div>
      </div>
      <div className="analytics-card analytics-card__two">
        <div className="analytics-card__content">
          <p>Total Project Value</p>
          <h1>{currencyFormatter(tenant_locale, totalValue, currency_symbol)}</h1>
        </div>
        <div className="analytics-card__icon">
          <strong>
            {currency_symbol === null ? (
              <FaPoundSign size={40} />
            ) : (
              getCurrencySymbol(currency_symbol)
            )}
          </strong>
        </div>
      </div>
      <div className="analytics-card analytics-card__three">
        <div className="analytics-card__content">
          <p>Total Red flags</p>
          <h1>{totalRedFlags}</h1>
        </div>
        <div className="analytics-card__icon">
          <FaFlag
            size={32}
            color={'#fc8c8a'}
          />
        </div>
      </div>
    </div>
  );
}
