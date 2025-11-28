import React, { useState } from 'react';
import QuotesCarousel from './QuotesCarousel';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Fixed Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div 
              className="text-2xl font-bold text-blue-800 cursor-pointer" 
              style={{ fontFamily: 'Poppins, sans-serif' }}
              onClick={() => scrollToSection('hero')}
            >
              FutureProof
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8 items-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
              <button 
                onClick={() => scrollToSection('success-stories')} 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Success Stories
              </button>
              <button 
                onClick={() => scrollToSection('about-us')} 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('challenges')} 
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Challenges
              </button>
              <div className="flex space-x-4">
                <button 
                  className="text-blue-600 hover:text-blue-700 transition-colors px-4 py-2"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}
                >
                  Login
                </button>
                <button 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
                >
                  Sign Up Free
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden flex flex-col space-y-1.5 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="px-6 py-4 space-y-4">
              <button 
                onClick={() => scrollToSection('success-stories')} 
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg"
              >
                Success Stories
              </button>
              <button 
                onClick={() => scrollToSection('about-us')} 
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('challenges')} 
                className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg"
              >
                Challenges
              </button>
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <button 
                  className="w-full text-blue-600 hover:text-blue-700 transition-colors py-3 text-lg font-medium"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Login
                </button>
                <button 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Image Background */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/heroimg.jpg"
            alt="FutureProof Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-linear-to-b from-black/8.0 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 px-6 py-30 text-center max-w-4xl mx-auto">
          <h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '800' }}
          >
            Launch Your Tech Career —<br />
            <span className="text-blue-400">Your Personalized Journey Starts Here</span>
          </h1>
          <p 
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
          >
            FutureProof transforms your tech ambitions into actionable roadmaps. Get AI-powered guidance, structured learning, and real mentorship to build in-demand skills.
          </p>
          <div className="space-y-4">
            <button 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
            >
              Join the Journey
            </button>
            <p 
              className="text-white/70 text-sm"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}
            >
              Start building your future in just 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section id="success-stories" className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
         
          <QuotesCarousel />
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}
            >
              About FutureProof
            </h2>
            <p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
            >
              We're on a mission to bridge the gap between ambition and execution in tech education across Africa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🎯</span>
              </div>
              <h3 
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                The Problem
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
              >
             Young Africans feel lost in tech, overwhelmed by online noise and uncertainty. This confusion is the biggest barrier to starting a confident, high-value career.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
</svg>
              </div>
              <h3 
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
               Our Mission
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
              >
               To replace chaos with calm, clarity, and confidence. We create clear, accessible pathways for young Africans to build structured, future-proof tech careers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl">🚀</span>
              </div>
              <h3 
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                Our Approach
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
              >
                We combine AI-powered personalization with motivational mentorship. This guides growth one small, accountable step at a time, making success predictable and achievable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section id="challenges" className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}
          >
            The Challenges We Solve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border border-gray-100  rounded-lg w-75 h-85 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full  flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💥</span>
              </div>
              <h3 
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                Information Overload
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
              >
                You face endless, conflicting resources. We replace the noise with a single, clear, prioritized focus on where to start and what to master first.
              </p>
            </div>

             <div className="p-6 border border-gray-100  rounded-lg w-75 h-85 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧭</span>
              </div>
              <h3 
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                No Clear Path
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
              >
                Fragmented learning means momentum is quickly lost. We provide a structured, personalized path and progression system, ensuring every step builds toward a career goal.
              </p>
            </div>

             <div className="p-6 border border-gray-100  rounded-lg w-75 h-85 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤔</span>
              </div>
              <h3 
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                Lack of Support
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
              >
               Without dedicated mentorship or accountability, it is easy to get stuck or lose motivation. We ensure you stay on track with constant support and clear accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-6 py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}
          >
              From Beginners to Tech Professionals
          </h2>
          <p 
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
          >
            Join thousands of young Africans launching their tech careers with personalized roadmaps and AI-powered guidance.
          </p>
          <button 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
          >
            Start Building Your Future
          </button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div 
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700' }}
              >
                FutureProof
              </div>
              <p 
                className="text-gray-400 mb-4"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
              >
                Building the next generation of African tech talent through personalized learning journeys.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('hero')} className="text-gray-400 hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollToSection('success-stories')} className="text-gray-400 hover:text-white transition-colors">Success Stories</button></li>
                <li><button onClick={() => scrollToSection('about-us')} className="text-gray-400 hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('challenges')} className="text-gray-400 hover:text-white transition-colors">Challenges</button></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                Resources
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600' }}
              >
                Support
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <p 
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: '400' }}
                >
                  © 2025 FutureProof. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;