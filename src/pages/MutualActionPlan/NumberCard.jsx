import React from 'react';

function NumberCard(props) {
  const { title, value, textColor } = props;
  return (
    <div className="shadow-sm border rounded p-4">
      <div className="text-center lg:text-left">
        <h3 className={`mb-4 text-sm font-light ${textColor}`}>{title}</h3>
        <p className={`text-5xl ${textColor}`}>{value}</p>
      </div>
    </div>
  );
}

export default NumberCard;
