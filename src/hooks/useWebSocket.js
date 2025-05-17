import { useState, useRef, useCallback, useEffect } from 'react';

const useWebSocket = (token, onNewData) => {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const pingIntervalRef = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "Reconnecting");
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws'}?token=${encodeURIComponent(token)}`;
      console.log('Connecting to WebSocket at:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.addEventListener('open', () => {
        console.log('WebSocket connection established');
        setConnected(true);
        reconnectAttempts.current = 0;

        ws.send(JSON.stringify({ 
          type: 'ping',
          timestamp: new Date().toISOString()
        }));

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

      ws.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setConnected(false);

        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        if (event.code === 1000) {
          console.log('WebSocket closed normally, not reconnecting');
          return;
        }
        
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

      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      });
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [token, onNewData]);

  useEffect(() => {
    if (token) {
      connectWebSocket();
    }
    
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

  return { connected };
};

export default useWebSocket; 