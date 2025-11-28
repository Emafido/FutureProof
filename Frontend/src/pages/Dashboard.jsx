import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Auto-open sidebar on desktop
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [sidebarOpen]);

  // State data for the dashboard
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Build a Personal Portfolio Page",
      description: "Apply your HTML & CSS skills to create a stunning portfolio from scratch.",
      buttonText: "Continue Lesson",
      status: "in-progress",
      timeEstimate: "Est. 1 hour",
      completed: false,
      progress: 65
    },
    {
      id: 2,
      title: "Master CSS Flexbox",
      description: "Complete the interactive tutorial on modern CSS layouts with Flexbox.",
      buttonText: "Start Lesson",
      status: "pending",
      timeEstimate: "Est. 2 hours",
      completed: false,
      progress: 0
    },
    {
      id: 3,
      title: "JavaScript Algorithm Challenge",
      description: "Test your problem-solving skills with a new algorithm challenge.",
      buttonText: "Start Challenge",
      status: "pending",
      timeEstimate: "Est. 30 mins",
      completed: false,
      progress: 0
    }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, text: "Deploy portfolio to Netlify", completed: false },
    { id: 2, text: "Start React fundamentals module", completed: false },
    { id: 3, text: "Join community Q&A session", completed: false }
  ]);

  const [achievements] = useState([
    { id: 1, name: "HTML Pro", description: "Complete HTML fundamentals", icon: "💪", unlocked: true },
    { id: 2, name: "CSS Wizard", description: "Master CSS layouts", icon: "🎨", unlocked: false },
    { id: 3, name: "JS Beginner", description: "Write first JavaScript", icon: "⚡", unlocked: false }
  ]);

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

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'roadmap', name: 'Learning Path', icon: '🗺️' },
    { id: 'courses', name: 'My Courses', icon: '📚' },
    { id: 'projects', name: 'Projects', icon: '💼' },
    { id: 'community', name: 'Community', icon: '👥' },
    { id: 'resources', name: 'Resources', icon: '📁' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  // Helper function to close sidebar on navigation (mobile)
  const handleNavClick = (id) => {
    setActiveNav(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sidebar Component
  const Sidebar = () => (
    <div 
      className={`
        fixed top-0 left-0 z-50 h-full bg-white shadow-2xl transition-all duration-300 flex-col flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        w-64 
        lg:relative lg:translate-x-0 lg:shadow-xl lg:h-screen lg:w-64
        flex
      `}
    >
      {/* Top Section with Logo and Mobile Close Button */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
           
            <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">FutureProof</h1>
          </div>
          
          {/* Mobile Close Button - Only visible on mobile/tablet */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            AC
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">Alex Chen</p>
            <p className="text-sm text-gray-600 truncate">Frontend Developer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                  ${activeNav === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-lg flex-shrink-0">
                  {item.icon}
                </span>
                <span className="font-medium whitespace-nowrap overflow-hidden text-sm">
                  {item.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom spacer for mobile */}
      <div className="h-4 lg:hidden"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        ></div>
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full min-w-0">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">
            
            {/* Mobile Menu Button & Title */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
                {activeNav === 'dashboard' ? 'Learning Dashboard' : activeNav}
              </h2>
              <span className="hidden sm:inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Student
              </span>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.77-4.31 1 1 0 00-1.47-.93 7.97 7.97 0 004.49 7.88 1 1 0 001.35-.38 1.007 1.007 0 00-.38-1.35l.28-.71zM14.76 8.56a5.97 5.97 0 003.77-4.31 1 1 0 011.47-.93 7.97 7.97 0 01-4.49 7.88 1 1 0 01-1.35-.38 1.007 1.007 0 01.38-1.35l-.28-.71z" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Search */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-40 sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {activeNav === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, Alex! 👋
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  Let's continue your journey to becoming a Frontend Developer.
                </p>
              </div>

              {/* Responsive Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                
                {/* Left Column - Progress & Roadmap */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                  
                  {/* Progress Overview */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Learning Progress</h3>
                      <span className="text-sm font-medium text-blue-600">40% Complete</span>
                    </div>
                    
                    {/* Progress Bars */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>HTML & CSS</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>JavaScript</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
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
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Current Milestones</h3>
                      <span className="text-sm text-gray-500">{milestones.filter(m => !m.completed).length} active</span>
                    </div>

                    <div className="space-y-4">
                      {milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`
                            border rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md 
                            ${
                              milestone.completed 
                                ? 'border-green-200 bg-green-50' 
                                : milestone.status === 'in-progress'
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-gray-200'
                            }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {milestone.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-3">
                                {milestone.description}
                              </p>
                              
                              {/* Progress Bar */}
                              {milestone.progress > 0 && (
                                <div className="mb-3 w-full sm:max-w-xs">
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
                            
                            <span className={`flex-shrink-0 mt-2 sm:mt-0 ml-0 sm:ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                              milestone.status === 'in-progress' 
                                ? 'bg-blue-100 text-blue-800'
                                : milestone.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {milestone.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-500 mb-2 sm:mb-0">{milestone.timeEstimate}</span>
                            <button
                              onClick={() => markMilestoneComplete(milestone.id)}
                              disabled={milestone.completed}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                milestone.completed
                                  ? 'bg-green-500 text-white cursor-default'
                                  : milestone.status === 'in-progress'
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
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
                <div className="space-y-6 lg:space-y-8">
                  {/* AI Mentor Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-blue-200">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        AI
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Mentor</h3>
                        <p className="text-sm text-gray-600">E. Dew | Learning Assistant</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-blue-100">
                      <p className="text-gray-700 text-sm mb-3">
                        "Struggling with CSS centering? Try using <code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs">display: grid</code> and <code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs">place-items: center</code> for a quick and reliable solution."
                      </p>
                      <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center group">
                        Explore this solution
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Your Achievements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                      {achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${
                            achievement.unlocked
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-gray-50 border-gray-200 opacity-60'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                            achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            {achievement.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${
                              achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                            }`}>
                              {achievement.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{achievement.description}</p>
                          </div>
                          {achievement.unlocked && (
                            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Tasks */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Upcoming Tasks</h3>
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
                          <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
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
                          <span className={`flex-1 text-sm transition-all ${
                            task.completed
                              ? 'text-gray-500 line-through'
                              : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Add new task */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-sm font-medium">Add New Task</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="font-semibold mb-4">Learning Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-gray-300">Hours Learned</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-gray-300">Courses Taken</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">15</p>
                        <p className="text-sm text-gray-300">Projects Done</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-gray-300">Streak Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Navigation Pages Placeholder */}
          {activeNav !== 'dashboard' && (
            <div className="max-w-4xl mx-auto text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">{navigationItems.find(item => item.id === activeNav)?.icon}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
                {activeNav} Page
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                This is the {activeNav} section. The content for this page would be displayed here in a full implementation.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;