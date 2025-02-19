import React from 'react';
import { get_meddpicc_status } from './Utils';

function MeddpiccStatus({ score }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className={`meddpicc-button ${get_meddpicc_status(score?.m_score)}`}>
          <strong className="text-white">M</strong>
        </div>
        <div className={`meddpicc-button ${get_meddpicc_status(score?.e_score)}`}>
          <strong className="text-white">E</strong>
        </div>
        <div className={`meddpicc-button ${get_meddpicc_status(score?.dc_score)}`}>
          <strong className="text-white">D</strong>
        </div>
        <div className={`meddpicc-button ${get_meddpicc_status(score?.dp_score)}`}>
          <strong className="text-white">D</strong>
        </div>
      </div>
      <div className="flex flex-row">
        <div className={`meddpicc-button ${get_meddpicc_status(score?.p_score)}`}>
          <strong className="text-white">P</strong>
        </div>
        <div className={`meddpicc-button ${get_meddpicc_status(score?.i_score)}`}>
          <strong className="text-white">I</strong>
        </div>
        <div className={`meddpicc-button ${get_meddpicc_status(score?.ch_score)}`}>
          <strong className="text-white">C</strong>
        </div>
        <div className={`meddpicc-button ${get_meddpicc_status(score?.co_score)}`}>
          <strong className="text-white">C</strong>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MeddpiccStatus);
