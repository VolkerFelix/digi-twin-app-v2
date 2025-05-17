import React from 'react';
import { MessageSquare, X } from 'lucide-react';

const NotificationsPanel = ({ 
  notifications, 
  onMarkAsRead, 
  onClearNotification, 
  onClearAll 
}) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Notifications</h3>
        <button 
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No notifications
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 flex items-start hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <MessageSquare className="h-4 w-4 text-indigo-600 mr-1" />
                    <span className="text-sm font-medium">{notification.message}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {notification.timestamp.toLocaleTimeString()} - {notification.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearNotification(notification.id);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel; 