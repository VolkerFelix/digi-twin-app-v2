import React, { useState, useEffect } from 'react';
import { 
  Send, 
  User, 
  Flag, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  Heart, 
  ArrowRight, 
  Check, 
  X, 
  Info,
  MessageSquare,
  Activity
} from 'lucide-react';

const CombinedInteractionPanel = ({ 
  userName = 'David',
  activeMission = null,
  onAcceptMission = () => {},
  onDeclineMission = () => {},
  challenges = [
    {
      id: 'stress-anxiety',
      title: 'Chronic Stress and Anxiety',
      description: "I'm feeling tired and anxious most days. My cortisol levels are consistently elevated and my HRV readings are declining.",
      severity: 'high',
      recommendations: [
        "Try the '4-7-8' breathing technique three times daily",
        "Reduce caffeine intake after 2pm",
        "Schedule two 15-minute breaks during your workday"
      ],
      dataPoints: [
        "Cortisol +42% above baseline",
        "HRV -23% below normal range",
        "Sleep quality declining"
      ],
      resolved: false
    },
    {
      id: 'sleep-disruption',
      title: 'Sleep Disruption',
      description: "My sleep analysis shows frequent nighttime awakenings and reduced deep sleep phases over the past 9 days.",
      severity: 'medium',
      recommendations: [
        "Maintain a consistent sleep/wake schedule",
        "Reduce blue light exposure 90 minutes before bed",
        "Keep bedroom temperature between 65-68°F"
      ],
      dataPoints: [
        "Deep sleep reduced by 18%",
        "5.2 awakenings per night (avg)",
        "Heart rate variability decreasing during sleep"
      ],
      resolved: false
    },
    {
      id: 'recovery-deficit',
      title: 'Exercise Recovery Deficit',
      description: "I'm not recovering properly between workouts. My muscle recovery markers show increasing inflammation.",
      severity: 'low',
      recommendations: [
        "Add an extra rest day between high-intensity workouts",
        "Increase protein intake by 15-20g on training days",
        "Try contrast therapy (hot/cold) for faster recovery"
      ],
      dataPoints: [
        "Recovery score -15% below baseline",
        "Inflammatory markers elevated post-workout",
        "Peak performance declining in successive workouts"
      ],
      resolved: false
    }
  ]
}) => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'challenges'
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [resolvedChallenges, setResolvedChallenges] = useState({});
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Initialize messages with greeting and optional mission
  useEffect(() => {
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
    
    setMessages(initialMessages);
  }, [userName, activeMission]);
  
  // Get active (non-resolved) challenges
  const activeChallenges = challenges.filter(
    challenge => !resolvedChallenges[challenge.id]
  );
  
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
        
        // Switch to challenges tab to show sleep challenge
        if (activeChallenges.some(c => c.id === 'sleep-disruption')) {
          setTimeout(() => {
            addMessage({
              sender: 'twin',
              text: `I've actually identified this as a challenge. Check the Challenges tab for more details.`,
              type: 'text'
            });
          }, 1500);
        }
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
        
        // Switch to challenges tab to show stress challenge
        if (activeChallenges.some(c => c.id === 'stress-anxiety')) {
          setTimeout(() => {
            addMessage({
              sender: 'twin',
              text: `I've detected a pattern of stress in your data. Check the Challenges tab for recommendations.`,
              type: 'text'
            });
          }, 1500);
        }
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
      else if (lowerMessage.includes('challenge') || lowerMessage.includes('problem')) {
        if (activeChallenges.length > 0) {
          addMessage({
            sender: 'twin',
            text: `I've identified ${activeChallenges.length} health challenges based on your data. Check the Challenges tab to view them.`,
            type: 'text'
          });
          
          // Auto-switch to the challenges tab
          setTimeout(() => {
            setActiveTab('challenges');
          }, 1000);
        } else {
          addMessage({
            sender: 'twin',
            text: "Great news! I don't see any significant health challenges in your data right now.",
            type: 'text'
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
  
  // Handle marking a challenge as resolved
  const handleResolveChallenge = (challengeId) => {
    // Update local state
    setResolvedChallenges(prev => ({
      ...prev,
      [challengeId]: true
    }));
    
    // Add a message in chat about resolving the challenge
    const resolvedChallenge = challenges.find(c => c.id === challengeId);
    if (resolvedChallenge) {
      // Switch to chat tab to show the message
      setActiveTab('chat');
      
      setTimeout(() => {
        addMessage({
          sender: 'twin',
          text: `Great progress! You've addressed the "${resolvedChallenge.title}" challenge. Your digital twin is evolving!`,
          type: 'text'
        });
      }, 500);
    }
  };
  
  // Handle dismissing a challenge
  const handleDismissChallenge = (challengeId) => {
    setResolvedChallenges(prev => ({
      ...prev,
      [challengeId]: true
    }));
  };
  
  // Handle enter key in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  // Get severity background
  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-amber-50';
      case 'low':
        return 'bg-blue-50';
      default:
        return 'bg-gray-50';
    }
  };
  
  // Get background color for header based on active tab
  const getHeaderBgColor = () => {
    return activeTab === 'chat' ? 'bg-green-700' : 'bg-red-700';
  };
  
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white mt-6">
      {/* Header with tabs */}
      <div className={`text-lg font-semibold p-4 text-white flex justify-between items-center ${getHeaderBgColor()}`}>
        <span>Digital Twin Interaction</span>
        
        <div className="flex items-center space-x-2">
          {activeMission && activeTab === 'chat' && (
            <div className="flex items-center text-xs bg-green-600 py-1 px-2 rounded mr-2">
              <Flag className="h-3 w-3 mr-1" />
              <span>Mission Active</span>
            </div>
          )}
          
          {activeChallenges.length > 0 && activeTab === 'challenges' && (
            <div className="flex items-center text-xs bg-red-600 py-1 px-2 rounded mr-2">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>{activeChallenges.length} Active</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-3 px-4 font-medium flex items-center justify-center ${
            activeTab === 'chat' 
              ? 'text-green-600 border-b-2 border-green-600' 
              : 'text-gray-500 hover:text-green-500'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          <span>Chat</span>
        </button>
        
        <button
          className={`flex-1 py-3 px-4 font-medium flex items-center justify-center ${
            activeTab === 'challenges' 
              ? 'text-red-600 border-b-2 border-red-600' 
              : 'text-gray-500 hover:text-red-500'
          }`}
          onClick={() => setActiveTab('challenges')}
        >
          <Activity className="h-4 w-4 mr-2" />
          <span>Challenges</span>
          {activeChallenges.length > 0 && (
            <div className="ml-2 h-5 w-5 flex items-center justify-center bg-red-100 text-red-700 text-xs rounded-full">
              {activeChallenges.length}
            </div>
          )}
        </button>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'chat' ? (
        /* Chat Tab Content */
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
      ) : (
        /* Challenges Tab Content */
        <div className="p-6">
          <div className="text-sm text-gray-500 mb-4">
            Can you help resolve these challenges your digital twin is experiencing?
          </div>
          
          {activeChallenges.length === 0 ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <div className="font-medium">No Active Challenges</div>
              <div className="text-sm text-gray-500 mt-1">
                Your Digital Twin doesn't detect any concerning patterns at the moment.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeChallenges.map(challenge => (
                <div 
                  key={challenge.id} 
                  className={`border rounded-lg overflow-hidden ${getSeverityBg(challenge.severity)}`}
                >
                  {/* Challenge header - always visible */}
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedChallenge(
                      expandedChallenge === challenge.id ? null : challenge.id
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <AlertTriangle className={`h-5 w-5 mr-2 mt-0.5 ${getSeverityColor(challenge.severity)}`} />
                        <div>
                          <div className={`font-medium ${getSeverityColor(challenge.severity)}`}>
                            {challenge.title}
                          </div>
                          <div className="text-sm mt-1">{challenge.description}</div>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 text-xs font-medium rounded capitalize ${getSeverityColor(challenge.severity)}`}>
                        {challenge.severity} Priority
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded challenge details */}
                  {expandedChallenge === challenge.id && (
                    <div className="p-4 pt-0">
                      <div className="bg-white rounded-lg p-4 space-y-4">
                        {/* Data points section */}
                        <div>
                          <div className="text-sm font-medium mb-2 flex items-center">
                            <Info className="h-4 w-4 mr-1 text-gray-500" />
                            <span>Data Insights</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {challenge.dataPoints.map((point, idx) => (
                              <div 
                                key={idx} 
                                className="text-xs bg-gray-100 px-3 py-2 rounded"
                              >
                                {point}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Recommendations section */}
                        <div>
                          <div className="text-sm font-medium mb-2">Recommendations</div>
                          <div className="space-y-2">
                            {challenge.recommendations.map((rec, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-start text-sm"
                              >
                                <ArrowRight className="h-4 w-4 mt-0.5 mr-2 text-indigo-500 shrink-0" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex space-x-2 pt-2">
                          <button 
                            onClick={() => handleResolveChallenge(challenge.id)}
                            className="flex-1 flex justify-center items-center bg-green-600 text-white py-2 px-4 rounded text-sm"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            <span>Mark as Resolved</span>
                          </button>
                          
                          <button 
                            onClick={() => handleDismissChallenge(challenge.id)}
                            className="flex-1 flex justify-center items-center bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            Your Digital Twin analyzes your biometric and behavioral patterns to identify potential challenges.
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedInteractionPanel;