import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MessageSquare, Bell, X } from 'lucide-react';

const WebSocketConnection = ({ token, onNewData }) => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const pingIntervalRef = useRef(null);

  // Connect to WebSocket server
  const connectWebSocket = useCallback(() => {
    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close(1000, "Reconnecting");
    }

    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws'}?token=${encodeURIComponent(token)}`;
      console.log('Connecting to WebSocket at:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Connection opened
      ws.addEventListener('open', () => {
        console.log('WebSocket connection established');
        setConnected(true);
        reconnectAttempts.current = 0; // Reset attempts on successful connection


        // Send an initial message to test the connection
        ws.send(JSON.stringify({ 
          type: 'ping',
          timestamp: new Date().toISOString()
        }));

        // Set up regular pings to keep connection alive (every 15 seconds)
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            console.log("Sending ping to keep connection alive");
            ws.send(JSON.stringify({ 
              type: 'ping',
              timestamp: new Date().toISOString()
            }));
          }
        }, 15000);
      });

      ws.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            switch (data.type) {

              case 'welcome':
                  console.log('WebSocket connection confirmed with server - User ID:', data.user_id);
                  break;
                  
              case 'ping':
                  console.log('Ping received from server');
                  if (ws.readyState === WebSocket.OPEN) {
                      ws.send(JSON.stringify({
                          type: 'pong',
                          timestamp: new Date().toISOString()
                      }));
                  }
                  break;
                  
              case 'pong':
                  console.log('Pong received from server - connection healthy');
                  break;
                  
              case 'new_health_data':
                  const newNotification = {
                      id: Date.now(),
                      type: 'new_health_data',
                      message: data.message || 'New health data available',
                      timestamp: new Date(data.timestamp || Date.now()),
                      syncId: data.sync_id,
                      read: false
                  };
                  
                  setNotifications(prev => [newNotification, ...prev].slice(0, 50));
                  setUnreadCount(prev => prev + 1);
                  
                  // Notify parent component
                  if (onNewData) {
                      onNewData(data);
                  }
                  break;
                  
              default:
                  console.log('Unknown message format received:', data);
          }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            console.log('Raw message content:', event.data);
        }
      });

      // Connection closed
      ws.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setConnected(false);

        // Clear the ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Don't reconnect if it was a normal closure
        if (event.code === 1000) {
          console.log('WebSocket closed normally, not reconnecting');
          return;
        }
        
        // Use exponential backoff for reconnection
        if (!reconnectTimeoutRef.current) {
          const delay = Math.min(30000, 5000 * Math.pow(2, reconnectAttempts.current));
          console.log(`Attempting to reconnect WebSocket in ${delay/1000}s...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, delay);
        }
      });

      // Connection error
      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      });
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [token, onNewData]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (token) {
      connectWebSocket();
    }
    
    // Cleanup on unmount
    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
      }
    };
  }, [token, connectWebSocket]);

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening
      setUnreadCount(0);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    }
  };

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    
    // Recalculate unread count
    const unreadNotifications = notifications.filter(n => !n.read).length;
    setUnreadCount(unreadNotifications);
  };

  // Clear a notification
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Update unread count if needed
    const removedNotification = notifications.find(n => n.id === id);
    if (removedNotification && !removedNotification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Connection status and notification button */}
      <div className="flex items-center">
        {/* Connection indicator */}
        <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`} 
          title={connected ? 'Connected' : 'Disconnected'}>
        </div>
        
        {/* Notification bell */}
        <button 
          onClick={toggleNotifications}
          className="relative p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Notifications panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Notifications</h3>
            <button 
              onClick={clearAllNotifications}
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
                    onClick={() => markAsRead(notification.id)}
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
                        clearNotification(notification.id);
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
      )}
    </div>
  );
};

export default WebSocketConnection;