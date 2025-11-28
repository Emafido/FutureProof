import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header/Navigation */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-800">FutureProof</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Success Stories</a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Become Future-Ready in Tech —<br />
            <span className="text-blue-600">One Personalized Step at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            FutureProof guides you with a personalized roadmap based on your goals, skills, and learning speed — so you grow with clarity, not confusion.
          </p>
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
              Start My Roadmap
            </button>
            <p className="text-gray-500 text-sm">Takes less than 2 minutes.</p>
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quote 1 */}
            <div className="text-center p-6">
              <div className="text-5xl text-blue-200 mb-4">"</div>
              <p className="text-gray-700 italic mb-4">
                Most people overestimate what they can do in one year and underestimate what they can do in ten.
              </p>
              <p className="text-gray-900 font-semibold">— Bill Gates</p>
            </div>

            {/* Quote 2 */}
            <div className="text-center p-6">
              <div className="text-5xl text-blue-200 mb-4">"</div>
              <p className="text-gray-700 italic mb-4">
                The journey is the reward.
              </p>
              <p className="text-gray-900 font-semibold">— Steve Jobs</p>
            </div>

            {/* Quote 3 */}
            <div className="text-center p-6">
              <div className="text-5xl text-blue-200 mb-4">"</div>
              <p className="text-gray-700 italic mb-4">
                There are no shortcuts. Hard work, patience, and experiments are what get you there.
              </p>
              <p className="text-gray-900 font-semibold">— Jeff Bezos</p>
            </div>

            {/* Quote 4 */}
            <div className="text-center p-6">
              <div className="text-5xl text-blue-200 mb-4">"</div>
              <p className="text-gray-700 italic mb-4">
                People say, they build.
              </p>
              <p className="text-gray-900 font-semibold">— Mark Zuckerberg</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Too much information.</h3>
              <p className="text-gray-600">Endless tutorials, conflicting advice, no clear direction.</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧭</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No clear roadmap.</h3>
              <p className="text-gray-600">Jumping between resources without a structured path forward.</p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤔</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lack of guidance.</h3>
              <p className="text-gray-600">No mentor to keep you accountable and motivated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-6 py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            FutureProof builds a personalized roadmap based on your goals, strengths, and time commitment.
          </h2>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Create Your Roadmap
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-xl font-bold mb-2">FutureProof</div>
              <p className="text-gray-400">© 2024 FutureProof. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;