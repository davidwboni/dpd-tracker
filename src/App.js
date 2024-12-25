import React from 'react';
import StopTracker from './components/StopTracker';
import Login from './components/Login';
import { AuthProvider, useAuth } from './AuthContext';
import { auth } from './firebase';  // Add this line
import './App.css';

function AppContent() {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg">
        <div className="max-w-6xl mx-auto py-6 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Stop Tracker</h1>
            <p className="text-purple-100 mt-1">Track your delivery stats efficiently</p>
          </div>
          <button
            onClick={() => auth.signOut()}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
          >
            Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto py-6">
        <StopTracker />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;