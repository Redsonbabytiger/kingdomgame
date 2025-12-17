import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock } from 'lucide-react';

interface ResetPasswordPageProps {
  onResetComplete: () => void;
}

export function ResetPasswordPage({
  onResetComplete,
}: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verify we have a valid recovery session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setError('Invalid or expired password reset link.');
      }
      setLoading(false);
    });
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Important: log the user out after reset
      await supabase.auth.signOut();
      setSuccess(true);

      // Give user a moment to read success message
      setTimeout(() => {
        onResetComplete();
      }, 2000);
    } catch {
      setError('Failed to reset password.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-700 rounded-lg shadow-2xl p-8 border border-slate-600">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-amber-500 p-3 rounded-lg">
              <Lock className="w-6 h-6 text-slate-900" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-6">
            Reset Your Password
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-600 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-3 bg-emerald-900/30 border border-emerald-600 rounded-lg text-emerald-300 text-sm text-center">
              Password updated successfully. Redirecting to login…
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {submitting ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
