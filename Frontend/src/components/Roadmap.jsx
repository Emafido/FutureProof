import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, CheckCircle, Code, Layers, AlertCircle } from 'lucide-react';

const RoadmapGenerator = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState('');

  // Check for auth token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const fetchRoadmap = async () => {
    if (!authToken) {
      setError('Authentication token not found. Please log in first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch recommended job titles
      const jobTitleResponse = await fetch('http://localhost:5000/api/onboarding/recommended-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        }
      });

      if (!jobTitleResponse.ok) {
        throw new Error(`Failed to fetch job titles: ${jobTitleResponse.statusText}`);
      }

      const jobTitleData = await jobTitleResponse.json();
      console.log('Recommended Job Titles:', jobTitleData.recommended_job_titles);

      // Generate roadmap based on job titles
      const roadmapResponse = await fetch('http://localhost:5000/api/roadmap/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        },
        body: JSON.stringify({
          targetJobTitle: jobTitleData.recommended_job_titles
        })
      });

      if (!roadmapResponse.ok) {
        throw new Error(`Failed to generate roadmap: ${roadmapResponse.statusText}`);
      }

      const roadmapResult = await roadmapResponse.json();
      setRoadmapData(roadmapResult);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Career Roadmap Generator</h1>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Generate a personalized learning roadmap based on your skills and career goals
          </p>
          
          <button
            onClick={fetchRoadmap}
            disabled={loading || !authToken}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                Generate Roadmap
                <Target size={20} />
              </>
            )}
          </button>

          {!authToken && (
            <p className="mt-4 text-sm text-amber-600 flex items-center gap-2">
              <AlertCircle size={16} />
              Please log in to generate your roadmap
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {roadmapData && roadmapData.roadmap && (
          <div className="space-y-8">
            
            {/* Summary Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                  <BookOpen size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Executive Summary</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {roadmapData.roadmap.roadmap_summary}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Timeline Phases */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="text-blue-600" size={28} /> 
                  Learning Phases
                </h3>

                {roadmapData.roadmap.phases && roadmapData.roadmap.phases.length > 0 ? (
                  roadmapData.roadmap.phases.map((phase, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      
                      {/* Phase Header */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Phase {index + 1}</span>
                          <h4 className="text-lg font-bold text-gray-900 mt-1">{phase.phase_title}</h4>
                        </div>
                        <span className="flex items-center gap-1.5 text-sm font-medium text-blue-700 py-1.5 px-2">
                          <Clock size={16} />
                          {phase.estimated_weeks} {phase.estimated_weeks === 1 ? 'Week' : 'Weeks'}
                        </span>
                      </div>

                      {/* Phase Body */}
                      <div className="p-6">
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Core Topics</h5>
                          <div className="space-y-3">
                            {phase.topics && phase.topics.map((topic, i) => (
                              <div 
                                key={i} 
                                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100"
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-5 h-5 rounded-full border-2 border-blue-300 group-hover:border-blue-500 group-hover:bg-blue-500 transition-all flex items-center justify-center">
                                    <CheckCircle size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                                <span className="text-gray-700 text-sm leading-relaxed flex-1 group-hover:text-gray-900 font-medium transition-colors">
                                  {topic}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Item Box */}
                        {phase.action_item && (
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-200">
                            <h5 className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-3">
                              <div className="p-1.5 bg-indigo-600 rounded-md">
                                <Target size={14} className="text-white" />
                              </div>
                              Action Item
                            </h5>
                            <p className="text-indigo-900 text-sm leading-relaxed font-medium">
                              {phase.action_item}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No phases available</p>
                )}
              </div>

              {/* Right Column: Skills Gap */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="text-purple-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Skills to Master</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6">
                    Key technologies and concepts required for your target role
                  </p>

                  {roadmapData.roadmap.skills_gap_analysis && roadmapData.roadmap.skills_gap_analysis.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {roadmapData.roadmap.skills_gap_analysis.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No skills data available</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !roadmapData && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Target size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Roadmap Yet</h3>
            <p className="text-gray-600">Click "Generate Roadmap" to create your personalized learning path</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapGenerator;