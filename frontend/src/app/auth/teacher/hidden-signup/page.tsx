'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react'; // Professional icons

export default function HiddenRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleBack = () => {
    // Navigate back to the main landing page or a specific admin page
    router.push('/'); 
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const res = await fetch('/api/auth/register', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ username, email, password }) 
        });

        if (res.ok) {
            // Redirect upon successful registration
            router.push('/auth/teacher/login');
        } else {
            const errorData = await res.json();
            setError(errorData.message || 'Could not register. Check the input data.');
        }
    } catch (err) {
        setError('An unexpected error occurred. Please check network connection.');
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      
      {/* Registration Card Container with Animation */}
      <div 
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01] animate-fade-in"
        style={{ animationDuration: '0.5s' }}
      >
        <div className="flex justify-center mb-6">
          <UserPlus className="w-10 h-10 text-green-600 animate-bounce-slow" />
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Teacher Registration</h2>
        <p className="text-center text-gray-500 mb-8">Create a new administrative account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-150"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 animate-slide-down">
              {error}
            </div>
          )}

          {/* Registration Button with Loading State */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform 
              ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-[1.01]'}
            `}
          >
            {isLoading ? (
              <span className="flex justify-center items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register Account'
            )}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-full flex items-center justify-center py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition duration-150"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}