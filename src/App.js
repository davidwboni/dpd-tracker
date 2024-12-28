import React, { useState, useEffect } from 'react';
import StopTracker from './components/StopTracker';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { auth } from './services/firebase';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function AppContent() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Reset showAuth when user signs out
  useEffect(() => {
    if (!user && !isSigningOut) {
      setShowAuth(false);
    }
  }, [user, isSigningOut]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await auth.signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  // Show landing page with theme toggle
  if (!user) {
    if (showAuth) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center min-h-screen">
            <Auth onBack={() => setShowAuth(false)} />
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <LandingPage 
          onLoginClick={() => setShowAuth(true)}
          onSignupClick={() => setShowAuth(true)} 
        />
      </div>
    );
  }

  // Main app with theme toggle
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg dark:from-purple-800 dark:to-purple-900">
        <div className="max-w-6xl mx-auto py-6 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Stop Tracker</h1>
            <p className="text-purple-100 mt-1 text-sm md:text-base">Track your delivery stats efficiently</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors duration-200 text-sm md:text-base"
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto py-6 px-4">
        <StopTracker />
      </main>
    </div>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;