import React from "react";
import "./MVP.module.css";

export const MVP = () => {
  return (
    <div className="app">
      <div className="goal-progress">
        <h2 className="goal-name">Goal Name</h2>
        <div className="progress-bar">
          <div className="progress" style={{ width: "50%" }}></div>
        </div>
        <p className="percentage">50% Complete</p>
      </div>

      <div className="calendar-items">
        <div className="calendar-item">
          <h3 className="event-name">Event Name</h3>
          <p className="event-time">Event Time</p>
          <p className="event-details">Event Details</p>
        </div>
        {/* Repeat for each calendar item */}
      </div>

      <ul className="task-list">
        <li className="task">
          <input type="checkbox" className="task-checkbox" />
          <span className="task-name">Task Name</span>
          <span className="due-date">Due Date</span>
        </li>
        {/* Repeat for each task */}
      </ul>

      <ul className="notifications">
        <li className="notification">
          <p className="notification-text">Notification Text</p>
          <button className="dismiss-button">Dismiss</button>
        </li>
        {/* Repeat for each notification */}
      </ul>

      <div className="task-modal">
        <div className="task">
          <h2 className="task-name">Task Name</h2>
          <p className="task-details">Task Details</p>
          <ul className="subtasks">
            <li className="subtask">Subtask</li>
            {/* Repeat for each subtask */}
          </ul>
          <div className="attachments">{/* Attachments go here */}</div>
        </div>
      </div>
    </div>
  );
};

export default MVP;
