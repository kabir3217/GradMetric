'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Mail, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // merge both inputs into one flexible credential
    const credential = email || username;

    const payload = {
      credential: credential.trim(),
      password,
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // token is NOT required — cookie is already set
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid login details.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">

      <div
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-[1.01] animate-fade-in"
      >
        <div className="flex justify-center mb-6">
          <LogIn className="w-10 h-10 text-indigo-600 animate-bounce-slow" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Teacher Login</h2>
        <p className="text-center text-gray-500 mb-8">Access the Academic Success Forecaster Dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg shadow-md transition transform 
              ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01]'}
            `}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
