import ongoingIcon from '../../assets/icons/progress.png';
import upcomingIcon from '../../assets/icons/Calendar32.png';
import bellIcon from '../../assets/icons/Bell_Orange32.gif';

export default function QueuesOverview({ completed, lateTasks, ongoingTasks, upcomingTasks }) {
  return (
    <div className="analytics-card-container">
      <div className="analytics-card analytics-card__three">
        <div className="analytics-card__content">
          <p>{completed ? 'Completed Late' : 'Late Tasks'}</p>
          <h1>{lateTasks}</h1>
        </div>
        <div className="analytics-card__icon">
          <img
            src={bellIcon}
            style={{ color: '#fc8c8a', height: 30, width: 30 }}
          />
        </div>
      </div>
      <div className="analytics-card analytics-card__one">
        <div className="analytics-card__content">
          <p>{completed ? 'Completed on time' : 'Ongoing Tasks'}</p>
          <h1>{ongoingTasks}</h1>
        </div>
        <div className="analytics-card__icon">
          <img
            src={ongoingIcon}
            style={{ color: '#3edab7', height: 30, width: 30 }}
          />
        </div>
      </div>
      <div className="analytics-card analytics-card__two">
        <div className="analytics-card__content">
          <p>{completed ? 'Completed Early' : 'Upcoming Tasks'}</p>
          <h1>{upcomingTasks}</h1>
        </div>
        <div className="analytics-card__icon">
          <img
            src={upcomingIcon}
            style={{ color: '#83bdff', height: 30, width: 30 }}
          />
        </div>
      </div>
    </div>
  );
}
