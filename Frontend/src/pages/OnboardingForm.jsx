import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, Briefcase, Zap, Upload, Clock, BookOpen } from 'lucide-react';

export default function FutureProofOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    mainGoal: '',
    age: '',
    currentSituation: '',
    biggestChallenge: '',
    learningPace: '', // Moved to Step 1
    cvFile: null, // NEW: File object for CV
    
    skillLevel: 3,
    careerPath: '',
    otherCareerPath: '',
    targetTimeframe: '', // NEW: Target completion time
    learningStyle: '', // NEW: Preferred learning style
    previousCourses: '',
    certifications: '',
    
    understanding: '',
    motivation: '',
    hearAbout: ''
  });

  const navigate = useNavigate();

  const validateStep = (step) => {
    const newErrors = {};
    const previousCoursesSelected = ['incomplete', 'no-work', 'building'].includes(formData.previousCourses);

    if (step === 1) {
      if (!formData.mainGoal) newErrors.mainGoal = 'Please select your main goal';
      if (!formData.age) newErrors.age = 'Please select your age range';
      if (!formData.currentSituation) newErrors.currentSituation = 'Please select your current situation';
      if (!formData.biggestChallenge) newErrors.biggestChallenge = 'Please select your biggest challenge';
      if (!formData.learningPace) newErrors.learningPace = 'Please select your weekly commitment'; // Added validation
    }

    if (step === 2) {
      if (!formData.careerPath) newErrors.careerPath = 'Please select a professional path';
      if (!formData.targetTimeframe) newErrors.targetTimeframe = 'Please select your target timeframe'; // Added validation
      if (!formData.learningStyle) newErrors.learningStyle = 'Please select your preferred learning style'; // Added validation
      
      // Validation for 'Other' input
      if (formData.careerPath === 'other-input' && !formData.otherCareerPath.trim()) {
        newErrors.otherCareerPath = 'Please specify your career path';
      }

      // Validation for Skill Level if a path is selected (and it's not 'explore')
      if (formData.careerPath && formData.careerPath !== 'explore' && !formData.skillLevel) {
          newErrors.skillLevel = 'Please rate your current skill level';
      }

      if (!formData.previousCourses) newErrors.previousCourses = 'Please select an option';
      
      // Validation for certifications if 'Yes' was selected
      if (previousCoursesSelected && !formData.certifications.trim()) {
        newErrors.certifications = 'Please list the courses or certifications you have taken.';
      }
    }

    if (step === 3) {
      if (!formData.understanding) newErrors.understanding = 'Please confirm your understanding';
      if (!formData.hearAbout) newErrors.hearAbout = 'Please tell us how you heard about us';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const buildFormData = () => {
    const apiData = new FormData();
    
    // Convert state to API keys (Python uses snake_case in the model, 
    // but the backend will expect camelCase from JavaScript's FormData object)
    for (const key in formData) {
      if (key === 'cvFile') {
        if (formData.cvFile) {
            apiData.append('cvFile', formData.cvFile, formData.cvFile.name);
        }
      } else if (formData[key] !== null) {
        // Append all other fields as text
        apiData.append(key, formData[key]);
      }
    }
    return apiData;
  };


  const handleSubmit = async () => {
    if (validateStep(3)) {
      const payload = buildFormData();
      const API_URL = 'http://localhost:5000/api/auth/api/onboarding/submit'; // Replace with your actual endpoint if different
      
      try {
        // Note: For multipart/form-data, do NOT set 'Content-Type': 'application/json' 
        // in the headers. The browser handles the Content-Type automatically, 
        // including the boundary for the file.
        
        const response = await fetch(API_URL, {
          method: 'POST',
          // Assuming you have a JWT token stored (e.g., in localStorage)
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`, 
          },
          body: payload, // Send FormData object directly
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Submission Result:', result);
          // Optional: Redirect the user to a thank you page
          // window.location.href = '/dashboard'; 
          setTimeout(() => {
            navigate('/dashboard'); // Redirect to dashboard after onboarding
          }, 2000); // Delay for 2 seconds before redirecting
        } else {
          // Handle API errors (e.g., missing required fields, server error)
          const errorMsg = result.msg || 'Submission failed due to an unknown error.';
          alert(`Submission Failed: ${errorMsg}`);
          console.error('API Error:', result);
        }
      } catch (e) {
        console.error('Network or unexpected error:', e);
        alert('An unexpected error occurred. Please check your network connection.');
      }
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => {
      const newState = { ...prev, [field]: value };
      
      if (field === 'careerPath' && value !== 'other-input') {
        newState.otherCareerPath = '';
      }
      
      if (field === 'careerPath' && value === 'explore') {
        newState.skillLevel = 1; 
      }
      
      if (field === 'previousCourses' && value === 'no') {
        newState.certifications = '';
      }

      return newState;
    });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  // Custom handler for file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateField('cvFile', file);
  };

  const getSkillLevelLabel = (value) => {
    const labels = {
      1: 'No formal experience',
      2: 'Explored basics/theory',
      3: 'Completed a few projects/tasks',
      4: 'Intermediate, reliable skills',
      5: 'Advanced, professional-ready'
    };
    return labels[value];
  };

  const shouldShowSkillLevel = formData.careerPath && formData.careerPath !== 'explore';
  const shouldAskForCertifications = ['incomplete', 'no-work', 'building'].includes(formData.previousCourses);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 
                   'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Foundation</span>
            <span>Skills & Path</span>
            <span>The Proof</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">

          {/* Step 1 - Updated */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Let's Start Your Professional Journey</h2>
              <p className="text-gray-600 mb-8">Tell us about yourself so we can build a career path that fits your life and goals.</p>
              <div className="space-y-6">

                {/* Main Goal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What's your main goal with FutureProof? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.mainGoal}
                    onChange={(e) => updateField('mainGoal', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mainGoal ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your main goal</option>
                    <option value="first-job">Land my first full-time job</option>
                    <option value="switch-career">Switch to a new professional field</option>
                    <option value="build-skills">Build high-value skills while in school</option>
                    <option value="freelance">Start freelancing/consulting</option>
                    <option value="explore">Explore professional paths</option>
                  </select>
                  {errors.mainGoal && <p className="text-red-500 text-sm mt-1">{errors.mainGoal}</p>}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How old are you? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your age range</option>
                    <option value="15-17">15-17</option>
                    <option value="18-22">18-22</option>
                    <option value="23-26">23-26</option>
                    <option value="27-30">27-30</option>
                    <option value="31+">31+</option>
                  </select>
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                {/* Current Situation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What best describes your current situation? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.currentSituation}
                    onChange={(e) => updateField('currentSituation', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.currentSituation ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your current situation</option>
                    <option value="secondary">Secondary school student</option>
                    <option value="university">University/College student</option>
                    <option value="graduate">Recent graduate (0-2 years)</option>
                    <option value="working-non-related">Working (in a different field)</option>
                    <option value="unemployed">Unemployed/Job seeking</option>
                    <option value="self-employed">Self-employed/Business owner</option>
                  </select>
                  {errors.currentSituation && <p className="text-red-500 text-sm mt-1">{errors.currentSituation}</p>}
                </div>

                {/* Weekly Commitment (learningPace) - MOVED HERE */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How much time can you commit to learning/skill-building each week? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.learningPace}
                    onChange={(e) => updateField('learningPace', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.learningPace ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your weekly commitment</option>
                    <option value="2-4">2-4 hours (Side hustle pace)</option>
                    <option value="5-10">5-10 hours (Part-time commitment)</option>
                    <option value="11-20">11-20 hours (Serious learner)</option>
                    <option value="20+">20+ hours (Full-time dedication)</option>
                  </select>
                  {errors.learningPace && <p className="text-red-500 text-sm mt-1">{errors.learningPace}</p>}
                </div>

                {/* Biggest Challenge */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What's your biggest challenge in starting or advancing your career? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.biggestChallenge}
                    onChange={(e) => updateField('biggestChallenge', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.biggestChallenge ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your biggest challenge</option>
                    <option value="no-experience">No verifiable experience (the "Experience Trap")</option>
                    <option value="dont-know">Don't know which direction to go</option>
                    <option value="limited-time">Limited time to learn/upskill</option>
                    <option value="cant-afford">Can't afford expensive training/degrees</option>
                    <option value="no-guidance">No one to guide me</option>
                    <option value="infrastructure">Unstable power/internet infrastructure</option>
                  </select>
                  {errors.biggestChallenge && <p className="text-red-500 text-sm mt-1">{errors.biggestChallenge}</p>}
                </div>
                
                {/* CV Upload (OPTIONAL) - NEW SECTION */}
                <div className="pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Upload className="w-4 h-4 text-blue-600"/> Upload Your CV/Resume (Optional)
                  </label>
                  <p className="text-sm text-gray-500 mb-3">Upload your current CV (PDF/DOCX) for personalized roadmap generation.</p>
                  
                  <label className="block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition hover:bg-blue-50">
                      <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                      />
                      <span className="text-blue-600 font-semibold">
                          {formData.cvFile ? `File Selected: ${formData.cvFile.name}` : "Click to select file (PDF/DOCX)"}
                      </span>
                  </label>
                </div>

              </div>
              <button
                onClick={handleNext}
                className="w-full mt-8 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2 - Updated */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Help Us Understand Your Starting Point</h2>
              <p className="text-gray-600 mb-8">This powers our AI to create your personalized professional roadmap and match you with the right opportunities.</p>
              <div className="space-y-6">

                {/* Target Timeframe - NEW QUESTION */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-600"/> What is your target timeline for achieving your goal? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.targetTimeframe}
                    onChange={(e) => updateField('targetTimeframe', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.targetTimeframe ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your timeframe</option>
                    <option value="3-months">3 months (Aggressive learning)</option>
                    <option value="6-months">6 months (Standard pace)</option>
                    <option value="12-months">12 months (Flexible, deep dive)</option>
                    <option value="explore">Just exploring the options</option>
                  </select>
                  {errors.targetTimeframe && <p className="text-red-500 text-sm mt-1">{errors.targetTimeframe}</p>}
                </div>
                
                {/* Learning Style - NEW QUESTION */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-blue-600"/> What is your preferred learning style? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.learningStyle}
                    onChange={(e) => updateField('learningStyle', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.learningStyle ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your learning style</option>
                    <option value="visual">Visual (Videos, diagrams, demos)</option>
                    <option value="kinesthetic">Kinesthetic (Hands-on projects, doing, practice)</option>
                    <option value="reading">Reading/Writing (Textbooks, manuals, documentation)</option>
                    <option value="social">Social (Group discussions, mentorship, live sessions)</option>
                  </select>
                  {errors.learningStyle && <p className="text-red-500 text-sm mt-1">{errors.learningStyle}</p>}
                </div>

                {/* Career Path (Mixed) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Which professional path interests you most right now? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.careerPath}
                    onChange={(e) => updateField('careerPath', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.careerPath ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a career path</option>
                    <option value="---">--- Popular Tech Fields ---</option>
                    <option value="web-dev">Web Development (Frontend/Backend)</option>
                    <option value="data-analysis">Data Analysis/Science</option>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="cybersecurity">Cybersecurity/IT Support</option>
                    <option value="---">--- General Business/Creative ---</option>
                    <option value="digital-marketing">Digital Marketing/SEO</option>
                    <option value="content-writing">Content Creation/Professional Writing</option>
                    <option value="project-mgmt">Project Coordination/Management</option>
                    <option value="biz-analysis">Business Analysis/Operations</option>
                    <option value="sales-success">Sales/Customer Success</option>
                    <option value="hr">Human Resources/Recruitment</option>
                    <option value="explore">Not sure yet—help me explore</option>
                    <option value="other-input">Other (Type below)</option>
                  </select>
                  {errors.careerPath && <p className="text-red-500 text-sm mt-1">{errors.careerPath}</p>}
                </div>

                {/* 'Other' Career Path Text Input */}
                {formData.careerPath === 'other-input' && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Please specify your career path: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.otherCareerPath}
                      onChange={(e) => updateField('otherCareerPath', e.target.value)}
                      placeholder="e.g., Financial Modeling, Veterinary Assistant, Electrical Installation..."
                      className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.otherCareerPath ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.otherCareerPath && <p className="text-red-500 text-sm mt-1">{errors.otherCareerPath}</p>}
                  </div>
                )}
                
                {/* Skill Level Slider - CONDITIONAL RENDERING */}
                {shouldShowSkillLevel && (
                    <div className="pt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Zap className="w-4 h-4 text-blue-600"/> Rate Your Current Ability in this Field <span className="text-red-500">*</span>
                        </label>
                        <p className="text-sm text-gray-500 mb-4">Be honest! This ensures your roadmap starts at the right level.</p>
                        
                        <div className={`bg-blue-50 p-4 rounded-lg border-2 ${errors.skillLevel ? 'border-red-500' : 'border-blue-100'}`}>
                            <input
                            type="range"
                            min="1"
                            max="5"
                            value={formData.skillLevel}
                            onChange={(e) => updateField('skillLevel', parseInt(e.target.value))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            
                            {/* Improved Display of Scale */}
                            <div className="flex justify-between text-xs font-medium text-gray-500 mt-2 px-1">
                                <span>1 (Beginner)</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5 (Expert)</span>
                            </div>
                            
                            {/* Current Selection Label */}
                            <div className="text-center mt-3">
                                <span className="inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-full shadow-md">
                                    Level {formData.skillLevel}: {getSkillLevelLabel(formData.skillLevel)}
                                </span>
                            </div>
                        </div>
                        {errors.skillLevel && <p className="text-red-500 text-sm mt-1">{errors.skillLevel}</p>}
                    </div>
                )}

                {/* Previous Courses */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Have you completed any courses or professional certifications before? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.previousCourses}
                    onChange={(e) => updateField('previousCourses', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.previousCourses ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="no">No, this is my first time</option>
                    <option value="incomplete">Yes, but I didn't finish</option>
                    <option value="no-work">Yes, but I couldn't find work after</option>
                    <option value="building">Yes, and I'm actively building on it</option>
                  </select>
                  {errors.previousCourses && <p className="text-red-500 text-sm mt-1">{errors.previousCourses}</p>}
                </div>
                
                {/* Certifications Text Input (Conditional) */}
                {shouldAskForCertifications && (
                    <div className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Please list any courses, programs, or certifications you've taken: <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.certifications}
                            onChange={(e) => updateField('certifications', e.target.value)}
                            placeholder="List them here, separated by commas or new lines (e.g., Coursera Project Management, Cisco CCNA)."
                            className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none ${
                                errors.certifications ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.certifications && <p className="text-red-500 text-sm mt-1">{errors.certifications}</p>}
                    </div>
                )}

              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  Next Step <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - Kept as is */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Breaking the Experience Trap</h2>
              <p className="text-gray-600 mb-8">We're different. FutureProof focuses on building a portfolio that proves you can do the work—not just collecting certificates.</p>

              {/* Educational Content */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6 rounded">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Briefcase className="w-5 h-5"/> The FutureProof Difference:</h3>
                <p className="text-gray-700 mb-2">Most platforms give you a course certificate. Employers care about results.</p>
                <p className="text-gray-700 mb-2">We build your **Verifiable Work Log**—a living portfolio of real-world projects, case studies, and measurable outcomes that proves your professional value.</p>
                <p className="text-gray-700">A certificate says you *learned*. Your Work Log proves you can *deliver results*.</p>
              </div>

              <div className="space-y-6">
                {/* Understanding */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Do you understand what makes FutureProof different? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.understanding}
                    onChange={(e) => updateField('understanding', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.understanding ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select your understanding</option>
                    <option value="yes">Yes, I get it—show proof, not paper</option>
                    <option value="maybe">I think so, but tell me more later</option>
                    <option value="curious">Not really, but I'm curious</option>
                  </select>
                  {errors.understanding && <p className="text-red-500 text-sm mt-1">{errors.understanding}</p>}
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What would landing your first paid opportunity mean to you? (Optional)
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => updateField('motivation', e.target.value)}
                    placeholder="It would mean I could finally support my family... or It would prove I made the right choice..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                  />
                </div>

                {/* Hear About */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    How did you hear about FutureProof? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hearAbout}
                    onChange={(e) => updateField('hearAbout', e.target.value)}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.hearAbout ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="social">Social media (Instagram/Twitter/LinkedIn)</option>
                    <option value="friend">Friend or family recommendation</option>
                    <option value="youtube">YouTube/Blog article</option>
                    <option value="google">Google search</option>
                    <option value="community">Professional community/WhatsApp group</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.hearAbout && <p className="text-red-500 text-sm mt-1">{errors.hearAbout}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  Start My Career Journey →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 text-sm mt-6">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  );
}