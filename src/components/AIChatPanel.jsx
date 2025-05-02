import React, { useState, useEffect } from 'react';
import { Send, User, Flag, ThumbsUp, ThumbsDown } from 'lucide-react';

const AIChatPanel = ({ 
  userName = 'David',
  activeMission = null,
  onAcceptMission = () => {},
  onDeclineMission = () => {}
}) => {
  // Initial messages with the greeting and optional mission
  const initialMessages = [
    {
      id: 1,
      timestamp: new Date(),
      sender: 'twin',
      text: `Hello ${userName}! I'm your Digital Twin. I'll learn from your habits and help you optimize your health.`,
      type: 'greeting'
    }
  ];

  // If there's an active mission, add it to the initial messages
  if (activeMission) {
    initialMessages.push({
      id: 2,
      timestamp: new Date(),
      sender: 'twin',
      text: `I have a mission for you, ${userName}!`,
      type: 'text'
    });
    
    initialMessages.push({
      id: 3,
      timestamp: new Date(),
      sender: 'twin',
      mission: activeMission,
      type: 'mission'
    });
  }

  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Add a message to the chat
  const addMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date(),
      ...message
    }]);
  };
  
  // Handle sending a user message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    addMessage({
      sender: 'user',
      text: inputMessage,
      type: 'text'
    });
    
    // Clear input
    setInputMessage('');
    
    // Simulate AI response
    simulateResponse(inputMessage);
  };
  
  // Simulate AI twin response
  const simulateResponse = (userMessage) => {
    setIsTyping(true);
    
    // Create a delay to simulate typing
    setTimeout(() => {
      setIsTyping(false);
      
      // Simple response logic based on user message keywords
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        addMessage({
          sender: 'twin',
          text: `Hi ${userName}! How are you feeling today?`,
          type: 'text'
        });
      }
      else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
        addMessage({
          sender: 'twin',
          text: `I've noticed your sleep patterns have been irregular. Would you like me to suggest a sleep schedule to help you feel more energized?`,
          type: 'text'
        });
      }
      else if (lowerMessage.includes('stress') || lowerMessage.includes('anxious')) {
        suggestMission({
          id: 'mindfulness-week',
          title: 'Mindfulness Week',
          description: 'Let\'s practice mindfulness meditation for 10 minutes daily for 7 days to reduce stress levels.',
          benefit: 'This will help me better model your stress responses and improve your overall well-being.',
          duration: '7 days',
          difficulty: 'Easy'
        });
      }
      else if (lowerMessage.includes('mission')) {
        if (activeMission) {
          addMessage({
            sender: 'twin',
            text: `You're currently on the "${activeMission.title}" mission. Keep going! You're doing great.`,
            type: 'text'
          });
        } else {
          suggestMission({
            id: 'sleep-consistency',
            title: 'Sleep Consistency Challenge',
            description: `Let's sleep for 7.5 hours for 5 consecutive nights.`,
            benefit: 'This will evolve my brain power model and help regulate your circadian rhythm.',
            duration: '5 days',
            difficulty: 'Medium'
          });
        }
      }
      else {
        addMessage({
          sender: 'twin',
          text: "I'm learning from your daily patterns. The more consistent data you provide, the better I can help optimize your health.",
          type: 'text'
        });
      }
    }, 1500);
  };
  
  // Suggest a mission to the user
  const suggestMission = (mission) => {
    addMessage({
      sender: 'twin',
      text: `I have a mission for you, ${userName}!`,
      type: 'text'
    });
    
    setTimeout(() => {
      addMessage({
        sender: 'twin',
        mission,
        type: 'mission'
      });
    }, 1000);
  };
  
  // Handle accepting a mission
  const handleAcceptMission = (mission) => {
    addMessage({
      sender: 'user',
      text: `I'll take on the "${mission.title}" mission!`,
      type: 'text'
    });
    
    setTimeout(() => {
      addMessage({
        sender: 'twin',
        text: `Fantastic! I'll track your progress on the "${mission.title}" mission. Let's get started!`,
        type: 'text'
      });
    }, 1000);
    
    onAcceptMission(mission);
  };
  
  // Handle declining a mission
  const handleDeclineMission = (mission) => {
    addMessage({
      sender: 'user',
      text: `I'll pass on this mission for now.`,
      type: 'text'
    });
    
    setTimeout(() => {
      addMessage({
        sender: 'twin',
        text: `No problem! I'll suggest something else when you're ready.`,
        type: 'text'
      });
    }, 1000);
    
    onDeclineMission(mission);
  };
  
  // Handle enter key in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6">
      <div className="text-lg font-semibold p-4 bg-green-700 text-white flex justify-between items-center">
        <span>Digital Twin Chat</span>
        
        {activeMission && (
          <div className="flex items-center text-xs bg-green-600 py-1 px-2 rounded">
            <Flag className="h-3 w-3 mr-1" />
            <span>Mission Active: {activeMission.title}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col h-96">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'mission' ? (
                  <div className="max-w-md bg-indigo-50 border-2 border-indigo-200 rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-indigo-800 flex items-center">
                      <Flag className="h-4 w-4 mr-2" />
                      <span>Mission: {message.mission.title}</span>
                    </div>
                    <div className="my-2 text-sm">{message.mission.description}</div>
                    <div className="mb-2 text-xs text-indigo-600">
                      {message.mission.benefit}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                      <div className="bg-white rounded p-1 text-center">
                        ⏱️ Duration: {message.mission.duration}
                      </div>
                      <div className="bg-white rounded p-1 text-center">
                        {message.mission.difficulty} Difficulty
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleAcceptMission(message.mission)}
                        className="flex-1 bg-indigo-600 text-white text-xs py-1 px-2 rounded"
                      >
                        Accept Mission
                      </button>
                      <button 
                        onClick={() => handleDeclineMission(message.mission)}
                        className="flex-1 bg-gray-300 text-gray-800 text-xs py-1 px-2 rounded"
                      >
                        Not Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white border shadow-sm rounded-bl-none'
                  }`}>
                    <div className="text-sm">{message.text}</div>
                    
                    {message.sender === 'twin' && (
                      <div className="flex justify-end space-x-1 mt-1">
                        <button className="text-gray-400 hover:text-gray-600">
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
              <User className="h-5 w-5 text-green-600" />
            </div>
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your Digital Twin..."
              className="flex-1 border rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className={`bg-green-600 text-white rounded-r-lg py-2 px-4 ${
                !inputMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Your Digital Twin learns from conversations to better understand your needs.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;