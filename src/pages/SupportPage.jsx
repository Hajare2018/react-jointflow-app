import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  CloseOutlined,
  ConfirmationNumberOutlined,
  FeedbackOutlined,
  KeyboardArrowUp,
  SearchOutlined,
} from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HttpClient from '../Api/HttpClient';
import FAQ from '../components/Feedback/FAQ';
import FeedbackForm from '../components/Feedback/FeedbackForm';
import TicketModal from '../components/Feedback/TicketModal';
import QuickDial from '../components/QuickDial';
import { allFaqs } from '../Redux/Actions/feedback';
import { useUserContext } from '../context/UserContext';

const InjectScriptComp = ({ script }) => {
  const divRef = useRef(null);
  useEffect(() => {
    if (divRef.current === null) {
      return;
    }
    const doc = document.createRange().createContextualFragment(script);
    divRef.current.innerHTML = '';
    divRef.current.appendChild(doc);
  }, []);
  return <div ref={divRef} />;
};

export const InjectScript = React.memo(InjectScriptComp);

export const liveChatScript = `
    <script type="text/javascript">  
      (
        function(d, src, c) { 
          var t=d.scripts[d.scripts.length - 1], s=d.createElement('script');
          s.id='la_x2s6df8d';
          s.async=true;
          s.src=src;
          s.onload=s.onreadystatechange=function(){
            var rs=this.readyState;
            if(rs&&(rs!='complete')&&(rs!='loaded')){
              return;
            }
            c(this);
          };
          t.parentElement.insertBefore(s,t.nextSibling);
        }
      )
      (
        document, 
        'https://jointflows.ladesk.com/scripts/track.js', 
        function(e){ 
          LiveAgent.createButton('qoj223ej', e); 
        }
      )
    </script>
  `;

const searchScript = `
    <script type="text/javascript"> 
      (
        function(d, src, c) { 
          var t=d.scripts[d.scripts.length - 1],s=d.createElement('script');
          s.id='la_x2s6df8d';
          s.async=true;
          s.src=src;
          s.onload=s.onreadystatechange=function(){
            var rs=this.readyState;
            if(rs&&(rs!='complete')&&(rs!='loaded')){
              return;
            }
            c(this);
          };
          t.parentElement.insertBefore(s,t.nextSibling);
        }
      )
      (
      document, 
        'https://jointflows.ladesk.com/scripts/track.js', 
        function(e){ 
          LiveAgent.createKbSearchWidget('sg9udcxg', e); 
        }
      ); 
    </script>
  `;

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: 78,
    right: 22,
  },
  fab: {
    backgroundColor: 'rgba(98,125, 175, 1.7)',
    color: '#ffffff',
    margin: 0,
    top: 'auto',
    right: 35,
    bottom: 100,
    left: 'auto',
    zIndex: 9,
    position: 'fixed',
    '&:hover': {
      backgroundColor: 'rgba(98,125, 175, 1.7)',
    },
    '@media(max-width: 767px)': {
      right: 35,
      bottom: 90,
    },
  },
  allFabs: {
    margin: 12,
    top: 'auto',
    right: 18,
    bottom: 130,
    left: 'auto',
    zIndex: 9,
    position: 'fixed',
    '@media(max-width: 767px)': {
      right: 18,
      bottom: 120,
    },
  },
}));

function SupportPage() {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const faqsData = useSelector((state) => state.faqsData);
  const { user } = useUserContext();
  const faqs = faqsData?.data?.length > 0 ? faqsData?.data : [];

  const handleFeedbackForm = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  useEffect(() => {
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Support Page',
      },
      account: { id: HttpClient.tenant() },
    });
    dispatch(allFaqs({ archive: false }));
  }, []);

  const actions = [
    {
      icon: <FeedbackOutlined />,
      name: 'Provide Feedback',
      background: 'rgba(98,125, 175, 1.7)',
      color: '#ffffff',
    },
    {
      icon: <SearchOutlined />,
      name: 'Search the knowledge base',
      background: 'rgba(98,125, 175, 1.7)',
      color: '#ffffff',
    },
    {
      icon: <ConfirmationNumberOutlined />,
      name: 'Raise A Ticket',
      background: 'rgba(98,125, 175, 1.7)',
      color: '#ffffff',
    },
  ];

  const doQuickDial = (e) => {
    if (e.name === 'Provide Feedback') {
      handleFeedbackForm();
    }
    if (e.name === 'Raise A Ticket') {
      setShowTicketModal(true);
    }
    if (e.name === 'Search the knowledge base') {
      setShowSearch(true);
    }
  };

  return (
    <main
      id="page"
      className="panel-view"
    >
      <div className="overview home-header">
        <div
          className="project-header"
          style={{ marginBottom: 10 }}
        >
          <strong
            className="overview__heading"
            style={{ textTransform: 'none' }}
          >
            Frequently Asked Questions
          </strong>
        </div>
      </div>
      <Grid
        container
        style={{ maxHeight: '78vh', overflowY: 'auto' }}
      >
        {faqs.map((faq) => (
          // TODO FIXME
          // eslint-disable-next-line react/jsx-key
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={6}
          >
            <FAQ data={faq} />
          </Grid>
        ))}
      </Grid>
      <div className={`${classes.root} m-3`}>
        <QuickDial
          openIcon={<KeyboardArrowUp />}
          closeIcon={<CloseOutlined />}
          actions={actions}
          handleQuickDial={doQuickDial}
          justify={'flex-start'}
          direction={'column'}
          toggleButtonStyles={{
            background: 'rgba(98,125, 175, 1.7)',
            color: '#ffffff',
          }}
          toggleName="Options"
          styles={{ primary: classes.fab, secondary: classes.allFabs }}
        />
      </div>
      <TicketModal
        open={showTicketModal}
        handleClose={() => setShowTicketModal(false)}
      />
      {showSearch ? <InjectScript script={searchScript} /> : null}
      <InjectScript script={liveChatScript} />
      <FeedbackForm
        open={showFeedbackForm}
        handleClose={handleFeedbackForm}
      />
    </main>
  );
}

export default React.memo(SupportPage);
