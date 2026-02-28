import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@api/components/lib/AuthContext';
import { Button } from '@api/components/ui/button';
import { Input } from '@api/components/ui/input';
import { Card } from '@api/components/ui/card';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight, AlertCircle } from 'lucide-react';

export default function PublicLogin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAsPublic } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      if (!name.trim()) {
        setError('Name is required');
        setIsLoading(false);
        return;
      }

      // Email is optional, but validate if provided
      if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Login as public user
      loginAsPublic({
        name: name.trim(),
        email: email.trim() || null,
        loginTime: new Date().toISOString()
      });

      // Redirect to main dashboard
      navigate('/Dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Login with default public user
    loginAsPublic({
      name: 'Guest User',
      loginTime: new Date().toISOString()
    });
    navigate('/Dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center mb-4"
              >
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black text-slate-900 dark:text-white mb-2"
              >
                Public Access Login
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 dark:text-slate-400"
              >
                Explore environmental data as a guest
              </motion.p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Your Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold uppercase tracking-widest rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/30"
                >
                  {isLoading ? 'Logging In...' : (
                    <>
                      Continue as Guest <ArrowRight className="ml-2 w-4 h-4 inline" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or</span>
              </div>
            </div>

            {/* Skip Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                type="button"
                onClick={handleSkip}
                disabled={isLoading}
                className="w-full h-12 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-900 dark:text-white font-bold uppercase tracking-widest rounded-lg transition-all"
              >
                Skip & Continue as Guest
              </Button>
            </motion.div>

            {/* Info Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs text-slate-500 dark:text-slate-400 text-center mt-6"
            >
              You can explore environmental data without creating an account. Want to contribute observations?{' '}
              <a href="/Dashboard" className="text-indigo-600 hover:text-indigo-700 font-bold">
                Expert Login →
              </a>
            </motion.p>
          </div>
        </Card>

        {/* Background Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointerevents-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 pointerevents-none"></div>
      </motion.div>
    </div>
  );
}
