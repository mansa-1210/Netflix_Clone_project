import React from 'react'
import './NotificationDropdown.css'

const NotificationDropdown = ({ notifications, onMarkAllRead }) => {
  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button type="button" onClick={onMarkAllRead}>Mark all as read</button>
      </div>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div className={`notification-item ${notification.read ? 'read' : 'unread'}`} key={notification.id}>
            <span className="notification-dot" />
            <p>{notification.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationDropdown
