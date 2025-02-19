import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_meddpicc_status } from '../Utils';
import { InfoOutlined } from '@mui/icons-material';
import { requestUpdateMeddpicc } from '../../Redux/Actions/single-project';

function MeddpiccComponent() {
  const dispatch = useDispatch();
  const projectData = useSelector((state) => state.singleProjectData);
  const meddpicc_scores = projectData?.data?.[0]?.meddpicc_scores;
  const meddpicc_status = projectData?.data?.[0]?.meddpicc_status;
  const [selected, setSelected] = useState(0);
  const [form, setForm] = useState({
    m_status: meddpicc_status?.m_status,
    e_status: meddpicc_status?.e_status,
    dc_status: meddpicc_status?.dc_status,
    dp_status: meddpicc_status?.dp_status,
    p_status: meddpicc_status?.p_status,
    i_status: meddpicc_status?.i_status,
    ch_status: meddpicc_status?.ch_status,
    co_status: meddpicc_status?.co_status,
  });
  const [score, setScore] = useState({
    m_score: meddpicc_scores?.m_score,
    e_score: meddpicc_scores?.e_score,
    dc_score: meddpicc_scores?.dc_score,
    dp_score: meddpicc_scores?.dp_score,
    p_score: meddpicc_scores?.p_score,
    i_score: meddpicc_scores?.i_score,
    ch_score: meddpicc_scores?.ch_score,
    co_score: meddpicc_scores?.co_score,
  });

  const meddpiccArray = [
    {
      id: 0,
      letter: 'M',
      name: 'm_status',
      score: score.m_score,
      score_name: 'm_score',
      status: get_meddpicc_status(meddpicc_scores?.m_score),
      description: form?.m_status,
      letter_tooltip:
        'M is for Metrics: The Metrics are the quantifiable measures of value that your solution can provide.',
      placeholder: 'Details about the Metrics…',
      info_tooltip: 'updated on ' + meddpicc_status?.m_last_update_date,
    },
    {
      id: 1,
      letter: 'E',
      name: 'e_status',
      score: score.e_score,
      score_name: 'e_score',
      status: get_meddpicc_status(meddpicc_scores?.e_score),
      description: form?.e_status,
      letter_tooltip:
        'E is for Economic Buyer: The Economic Buyer is the person with the overall authority in the buying decision.',
      placeholder: 'Details about the Economic Buyer…',
      info_tooltip: 'updated on ' + meddpicc_status?.e_last_update_date,
    },
    {
      id: 2,
      letter: 'D',
      name: 'dc_status',
      score: score.dc_score,
      score_name: 'dc_score',
      status: get_meddpicc_status(meddpicc_scores?.dc_score),
      description: form?.dc_status,
      letter_tooltip:
        'D is for Decision Criteria: The Decision Criteria are the various criteria with which a decision to process your solution will be judged.',
      placeholder: 'Details about the Decision Criteria…',
      info_tooltip: 'updated on ' + meddpicc_status?.dc_last_update_date,
    },
    {
      id: 3,
      letter: 'D',
      name: 'dp_status',
      score: score.dp_score,
      score_name: 'dp_score',
      status: get_meddpicc_status(meddpicc_scores?.dp_score),
      description: form?.dp_status,
      letter_tooltip:
        'D is for Decision Process: The Decision Process is the series of steps that form a process that the buyer will follow to make a decision.',
      placeholder: 'Details about the  Decision Process…',
      info_tooltip: 'updated on ' + meddpicc_status?.dp_last_update_date,
    },
    {
      id: 4,
      letter: 'P',
      name: 'p_status',
      score: score.p_score,
      score_name: 'p_score',
      status: get_meddpicc_status(meddpicc_scores?.p_score),
      description: form?.p_status,
      letter_tooltip:
        'P is for Paper Process: The Paper Process is the series of steps that follow the Decision Process in how you will go from Decision to signature.',
      placeholder: 'Details about the Paper Process…',
      info_tooltip: 'updated on ' + meddpicc_status?.p_last_update_date,
    },
    {
      id: 5,
      letter: 'I',
      name: 'i_status',
      score: score.i_score,
      score_name: 'i_score',
      status: get_meddpicc_status(meddpicc_scores?.i_score),
      description: form?.i_status,
      letter_tooltip:
        'I is for Implicate the Pain: Implicating the Pain means you have both Identified, Indicated, and Implicated the Pain your solution solves upon your customer.',
      placeholder: 'Details about how you have Implicated the Pain…',
      info_tooltip: 'updated on ' + meddpicc_status?.i_last_update_date,
    },
    {
      id: 6,
      letter: 'C',
      name: 'ch_status',
      score: score.ch_score,
      score_name: 'ch_score',
      status: get_meddpicc_status(meddpicc_scores?.ch_score),
      description: form.ch_status,
      letter_tooltip:
        'C is for Champion: The Champion is a person who has power, influence, and credibility within the customer’s organization.',
      placeholder: 'Details about the Champion…',
      info_tooltip: 'updated on ' + meddpicc_status?.ch_last_update_date,
    },
    {
      id: 7,
      letter: 'C',
      name: 'co_status',
      score: score.co_score,
      score_name: 'co_score',
      status: get_meddpicc_status(meddpicc_scores?.co_score),
      description: form?.co_status,
      letter_tooltip:
        'C is for Competition: The Competition is any person, vendor, or initiative competing for the same funds or resources you are.',
      placeholder: 'Details about the Competition…',
      info_tooltip: 'updated on ' + meddpicc_status?.co_last_update_date,
    },
  ];

  const handleForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onBlurForm = (event) => {
    const reqBody = {
      attribute_name: event.target.name,
      attribute_value: event.target.value,
    };
    dispatch(requestUpdateMeddpicc({ data: reqBody, id: projectData?.data?.[0]?.id }));
  };

  const handleScore = (event) => {
    setScore({ ...score, [event.target.name]: event.target.value });
  };

  const onBlurScore = (event) => {
    const reqBody = {
      attribute_name: event.target.name,
      attribute_value: parseInt(event.target.value),
    };
    dispatch(requestUpdateMeddpicc({ data: reqBody, id: projectData?.data?.[0]?.id }));
  };
  return meddpiccArray.map((meddpicc) => (
    <div
      className="flex flex-row mb-2 relative"
      key={meddpicc.id}
    >
      <div className="flex flex-col m-2 mt-1">
        <Tooltip
          title={meddpicc.letter_tooltip}
          placement="top"
          arrow
        >
          <div className={`meddpicc-status ${meddpicc.status}`}>
            <strong className="text-white">{meddpicc.letter}</strong>
          </div>
        </Tooltip>
        <div className="meddpicc-status mt-1">
          <select
            value={meddpicc.score}
            name={meddpicc.score_name}
            onBlur={onBlurScore}
            onChange={handleScore}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      </div>
      <textarea
        type="text"
        name={meddpicc.name}
        placeholder={meddpicc.placeholder}
        style={{
          border: selected === meddpicc.id ? '1px solid #6385b7' : '1px solid #aeaeae',
          height: selected === meddpicc.id ? 120 : 60,
          borderRadius: '0.5rem',
          width: '100%',
          resize: 'none',
        }}
        onFocus={() => {
          setSelected(meddpicc.id);
        }}
        value={meddpicc.description}
        onBlur={(event) => {
          setSelected(60);
          if (event.target.value !== '' || event.target.value !== meddpicc.description) {
            onBlurForm(event);
          }
        }}
        onChange={handleForm}
      />
      {!meddpicc.info_tooltip.includes('null') && !meddpicc.info_tooltip.includes('undefined') ? (
        <Tooltip
          title={meddpicc.info_tooltip}
          placement="top"
        >
          <InfoOutlined style={{ position: 'absolute', right: '0.5rem', top: '0.5rem' }} />
        </Tooltip>
      ) : (
        ''
      )}
    </div>
  ));
}

export default React.memo(MeddpiccComponent);
