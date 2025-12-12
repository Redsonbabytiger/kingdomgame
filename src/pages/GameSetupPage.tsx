import { useState } from 'react';
import { createCivilization } from '../services/civilizationService';
import { Sparkles } from 'lucide-react';

interface GameSetupPageProps {
  userId: string;
  onSetupComplete: () => void;
}

export function GameSetupPage({ userId, onSetupComplete }: GameSetupPageProps) {
  const [civilizationName, setCivilizationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateCivilization(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createCivilization(userId, civilizationName);
      onSetupComplete();
    } catch (err) {
      setError('Failed to create civilization. Please try again.');
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
              <Sparkles className="w-6 h-6 text-slate-900" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Name Your Civilization
          </h1>
          <p className="text-center text-slate-300 mb-8">
            Choose a name that will be remembered through the ages
          </p>

          <form onSubmit={handleCreateCivilization} className="space-y-6">
            <div>
              <label htmlFor="civ-name" className="block text-sm font-medium text-slate-200 mb-2">
                Civilization Name
              </label>
              <input
                id="civ-name"
                type="text"
                value={civilizationName}
                onChange={(e) => setCivilizationName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="e.g., The Golden Empire"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-600 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !civilizationName.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Creating Civilization...' : 'Found My Civilization'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-600/50 rounded-lg border border-slate-500">
            <p className="text-sm text-slate-300">
              Your civilization starts with 100 food, 50 gold, and 30 materials. Manage your resources wisely to build a great empire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}