import { useState } from 'react';
import { signIn, resetPassword } from '../services/authService';
import { LogIn } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

export function LoginPage({
  onLoginSuccess,
  onSwitchToRegister,
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [resetMode, setResetMode] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
        return;
      }
      onLoginSuccess();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setLoading(true);
    setError('');
    setInfo('');

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setInfo('Password reset email sent. Check your inbox.');
      }
    } catch {
      setError('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-700 rounded-lg shadow-2xl p-8 border border-slate-600">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-amber-500 p-3 rounded-lg">
              <LogIn className="w-6 h-6 text-slate-900" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Civilization Manager
          </h1>
          <p className="text-center text-slate-300 mb-8">
            Lead your civilization to glory
          </p>

          <form
            onSubmit={
              resetMode
                ? (e) => {
                    e.preventDefault();
                    handlePasswordReset();
                  }
                : handleLogin
            }
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="your@email.com"
                required
              />
            </div>

            {!resetMode && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-200 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setResetMode(!resetMode);
                  setError('');
                  setInfo('');
                }}
                className="text-amber-400 hover:text-amber-300"
              >
                {resetMode ? 'Back to login' : 'Forgot password?'}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-600 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            {info && (
              <div className="p-3 bg-emerald-900/30 border border-emerald-600 rounded-lg text-emerald-300 text-sm">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || (!resetMode && !password)}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {loading
                ? 'Please wait...'
                : resetMode
                ? 'Send reset email'
                : 'Sign In'}
            </button>
          </form>

          {!resetMode && (
            <div className="mt-6 pt-6 border-t border-slate-600">
              <p className="text-center text-slate-300 text-sm">
                Don&apos;t have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Create one
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
