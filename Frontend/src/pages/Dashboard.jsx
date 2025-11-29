import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RoadmapGenerator from '../components/Roadmap.jsx';

const LearningDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [roadmapData, setRoadmapData] = useState({});
  
  // State for User Info
  const [userInfo, setUserInfo] = useState({ 
    id: 0, 
    full_name: 'Loading User', 
    email: '', 
    has_taken_onboarding: false, 
    role: 'Learner', 
    joinedDate: ''
  });

  // State for Milestones (Populated from API)
  const [milestones, setMilestones] = useState([]);

  // State for static tasks (Placeholder)
  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, text: "Deploy portfolio to Netlify", completed: false },
    { id: 2, text: "Start React fundamentals module", completed: false },
    { id: 3, text: "Join community Q&A session", completed: false }
  ]);

  // State for static achievements (Placeholder)
  const [achievements, setAchievements] = useState([
    { id: 1, name: "HTML Pro", description: "Complete HTML fundamentals", icon: "💪", unlocked: true },
    { id: 2, name: "CSS Wizard", description: "Master CSS layouts", icon: "🎨", unlocked: false },
    { id: 3, name: "JS Beginner", description: "Write first JavaScript", icon: "⚡", unlocked: false }
  ]);

  // Navigation Items
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'roadmap', name: 'Learning Path', icon: '🗺️' },
    { id: 'courses', name: 'My Courses', icon: '📚' },
    { id: 'projects', name: 'Projects', icon: '💼' },
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'resources', name: 'Resources', icon: '📁' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  // Helper function to derive initials
  const getInitials = (fullName) => {
    if (!fullName) return 'U?';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Helper function to get first name
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  }

  const getUserInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch user info');
      const data = await response.json();
      
      setUserInfo({
        id: data.user.id,
        full_name: data.user.full_name || 'FutureProof User',
        email: data.user.email || 'N/A',
        has_taken_onboarding: data.user.has_taken_onboarding || false,
        role: data.user.role || 'Learner',
        joinedDate: data.user.created_at || new Date().toISOString()
      });
      console.log('User Info:', data);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUserInfo(prev => ({ ...prev, full_name: 'Guest User', role: 'Offline Mode' }));
    } finally {
      setLoading(false);
    }
  };

  // --- API FUNCTION: Get Roadmap (UPDATED) ---
  const getRoadmapMilestones = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/roadmap/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch roadmap');
      
      const data = await response.json();
      
      // Check if phases exist in the returned JSON
      const fetchedPhases = data.roadmap?.phases || [];

      // Transform API data to UI format
      const mappedMilestones = fetchedPhases.map((phase, index) => ({
        id: index + 1,
        phase_title: phase.phase_title,
        
        // Map "action_item" (API) to "description" (UI)
        description: phase.action_item,
        
        // Map "estimated_weeks" (API) to "timeEstimate" (UI)
        timeEstimate: `${phase.estimated_weeks} Weeks`,
        
        // Store topics to display tags
        topics: phase.topics || [],

        // Logic to determine status (First one unlocked, others locked)
        completed: false,
        status: index === 0 ? 'in-progress' : 'locked',
        progress: index === 0 ? 10 : 0, 
        buttonText: index === 0 ? 'Mark Complete' : 'Locked'
      }));

      setMilestones(mappedMilestones);
      setRoadmapData(data);
      
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setLoading(false);
    }
  }

  // --- EFFECTS ---
  useEffect(() => {
    getUserInfo();
    getRoadmapMilestones();
  }, []);

  // --- HANDLERS ---
  const markMilestoneComplete = (id) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, completed: true, status: 'completed', buttonText: 'Completed', progress: 100 }
        : milestone
    ));
  };

  const toggleTaskComplete = (id) => {
    setUpcomingTasks(upcomingTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'U?';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  }

  const navigate = useNavigate();

  const handleRetakeOnboarding = () => {
    navigate('/onboarding');
  }

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-gray-50 font-inter overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {sidebarOpen && (
              <h1 className="text-xl font-bold font-space-grotesk text-gray-900">FutureProof</h1>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
              {getInitials(userInfo.full_name)}
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-semibold text-gray-900 font-poppins">{userInfo.full_name}</p>
                <p className="text-sm text-gray-600">{roadmapData.title}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeNav === item.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <span className="text-lg">{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900 font-poppins capitalize">
                {activeNav === 'dashboard' ? 'Learning Dashboard' : activeNav}
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {roadmapData.title || 'No Roadmap Loaded'}
              </span>
            </div>
            
            {/* <div className="flex items-center space-x-6">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.77-4.31 1 1 0 00-1.47-.93 7.97 7.97 0 004.49 7.88 1 1 0 001.35-.38 1.007 1.007 0 00-.38-1.35l.28-.71zM14.76 8.56a5.97 5.97 0 003.77-4.31 1 1 0 011.47-.93 7.97 7.97 0 01-4.49 7.88 1 1 0 01-1.35-.38 1.007 1.007 0 01.38-1.35l-.28-.71z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div> */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {activeNav === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                  Welcome back, {getFirstName(userInfo.full_name)}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Let's continue your journey to becoming a {roadmapData.title || 'your chosen career'}.
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column - Progress & Roadmap */}
                <div className="xl:col-span-2 space-y-8">
                  
                  {/* Progress Overview (Static for now, can be connected later) */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 font-poppins">
                        Career Profile
                      </h3>
                      <p className="text-sm text-gray-500">Manage your learning path settings</p>
                    </div>

                    <button
                      onClick={handleRetakeOnboarding}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Retake Onboarding</span>
                    </button>
                  </div>
                  
                  {/* Optional: Add context about what this does */}
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                    <p>
                      Current Role Target: <span className="font-semibold text-gray-900">{roadmapData.title || 'your chosen career'}</span>
                    </p>
                    <p className="mt-1">
                      Want to change your path? Retaking onboarding will generate a new roadmap based on your new goals.
                    </p>
                  </div>
                </div>

                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>React</span>
                          <span>20%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Milestones */}
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 font-poppins">Current Milestones</h3>
                      <span className="text-sm text-gray-500">{milestones.filter(m => !m.completed).length} active</span>
                    </div>

                    <div className="space-y-4">
                      {milestones.length === 0 && !loading && (
                         <div className="text-center py-4 text-gray-500">
                            No roadmap found. Go to "Learning Path" to generate one.
                         </div>
                      )}
                      
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`border rounded-xl p-5 transition-all duration-200 hover:shadow-md ${
                            milestone.completed 
                              ? 'border-green-200 bg-green-50' 
                              : milestone.status === 'in-progress'
                              ? 'border-blue-200 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 font-poppins mb-2">
                                {milestone.phase_title}
                              </h4>
                              
                              {/* Description (Mapped from action_item) */}
                              <p className="text-gray-600 text-sm mb-3">
                                {milestone.description}
                              </p>
                              
                              {/* Progress Bar */}
                              {milestone.progress > 0 && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Progress</span>
                                    <span>{milestone.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                      style={{ width: `${milestone.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ml-3 ${
                              milestone.status === 'in-progress' 
                                ? 'bg-blue-100 text-blue-800'
                                : milestone.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {milestone.status === 'in-progress' ? 'In Progress' : 
                               milestone.status === 'locked' ? 'Locked' : 'Completed'}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{milestone.timeEstimate}</span>
                            <button
                              onClick={() => markMilestoneComplete(milestone.id)}
                              disabled={milestone.completed || milestone.status === 'locked'}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                milestone.completed
                                  ? 'bg-green-500 text-white cursor-default'
                                  : milestone.status === 'in-progress'
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {milestone.buttonText}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="space-y-8">
                  {/* AI Mentor Card */}
                  <div className="w-full bg-white rounded-2xl shadow-lg border border-blue-100 p-6 font-poppins">
  
  {/* Header */}
  <div className="border-b border-blue-50 pb-4 mb-6 flex justify-between items-center">
    <div>
      <h3 className="text-lg font-semibold text-gray-800">Mentorship Chat</h3>
      <p className="text-xs text-gray-500">Always here to help you debug.</p>
    </div>
    <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-lg">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-xs font-medium text-blue-600">Online</span>
    </div>
  </div>

  {/* Chat Messages Area */}
  <div className="space-y-6 mb-6">
    
    {/* User Message (Right Aligned) */}
    <div className="flex justify-end">
      <div className="flex flex-col items-end space-y-1 max-w-[85%]">
        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md">
          <p className="text-sm">Hey Mentor, I have a problem centering this div.</p>
        </div>
        <span className="text-xs text-gray-400 mr-1">You • 10:42 AM</span>
      </div>
    </div>

    {/* AI Mentor Message (Left Aligned) */}
    <div className="flex items-start space-x-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200 shadow-sm">
        <span className="text-blue-600 font-bold text-xs">AI</span>
      </div>

      <div className="flex flex-col items-start space-y-1 max-w-[85%]">
        {/* Name Tag */}
        <div className="flex items-center space-x-2 ml-1">
          <span className="text-xs font-semibold text-gray-900">E. Dew</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">Mentor</span>
        </div>

        {/* Message Bubble */}
        <div className="bg-white border border-blue-100 text-gray-700 px-5 py-3 rounded-2xl rounded-tl-none shadow-sm">
          <p className="text-sm leading-relaxed">
            Struggling with CSS centering? Try using <code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs border border-blue-100">display: grid</code> and <code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs border border-blue-100">place-items: center</code>.
          </p>
        </div>
        <span className="text-xs text-gray-400 ml-1">10:43 AM</span>
      </div>
    </div>

  </div>

  {/* Input Area (New Section) */}
  <div className="border-t border-blue-50 pt-4">
    <div className="flex items-center space-x-3">
      <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>
      
      <input 
        type="text" 
        placeholder="Type your message here..." 
        className="flex-1 bg-gray-50 border-none focus:ring-2 focus:ring-blue-100 focus:bg-white rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all outline-none"
      />
      
      <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md transition-all flex items-center justify-center group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </div>
  </div>

</div>

                  {/* Achievements */}
                  {/* <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 font-poppins mb-4">Your Achievements</h3>
                    <div className="space-y-3">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                            achievement.unlocked
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${
                              achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                            }`}>
                              {achievement.name}
                            </p>
                            <p className="text-xs text-gray-500">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  Upcoming Tasks
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900 font-poppins">Upcoming Tasks</h3>
                      <span className="text-sm text-gray-500">
                        {upcomingTasks.filter(t => !t.completed).length} remaining
                      </span>
                    </div>
                    <div className="space-y-3">
                      {upcomingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-3 group cursor-pointer"
                          onClick={() => toggleTaskComplete(task.id)}
                        >
                          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 group-hover:border-blue-500'
                          }`}>
                            {task.completed && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`flex-1 transition-all ${
                            task.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}

          {/* Other Navigation Pages Placeholder */}
          {activeNav !== 'dashboard' && (
            <div className="max-w-4xl mx-auto text-center py-16">
              {activeNav === 'roadmap' ? (
                 <RoadmapGenerator />
              ) : (
                 <p className="text-gray-500">Page under construction</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LearningDashboard;