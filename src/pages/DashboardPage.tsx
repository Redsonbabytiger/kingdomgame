import { useEffect, useState } from 'react';
import { Civilization, CivilizationResources, Character } from '../types/database';
import { getCivilization } from '../services/civilizationService';
import { getResources } from '../services/resourcesService';
import { getCharacters } from '../services/characterService';
import { getJobs } from '../services/jobService';
import { signOut } from '../services/authService';
import { Wheat, Coins, Package, Sword, Users, LogOut } from 'lucide-react';
import { Job } from '../types/database';
import { CitizensPage } from './CitizensPage';
import { ResourcesPage } from './ResourcesPage';

type DashboardView = 'overview' | 'citizens' | 'resources';

interface DashboardPageProps {
  userId: string;
}

export function DashboardPage({ userId }: DashboardPageProps) {
  const [civilization, setCivilization] = useState<Civilization | null>(null);
  const [resources, setResources] = useState<CivilizationResources | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState<DashboardView>('overview');

  useEffect(() => {
    loadGameData();
  }, []);

  async function loadGameData() {
    try {
      const civ = await getCivilization(userId);
      if (!civ) return;

      setCivilization(civ);

      const [resData, charData, jobData] = await Promise.all([
        getResources(civ.id),
        getCharacters(civ.id),
        getJobs(),
      ]);

      if (resData) setResources(resData);
      setCharacters(charData);
      setJobs(jobData);
    } catch (err) {
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading your civilization...</p>
      </div>
    );
  }

  if (error || !civilization || !resources) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Failed to load civilization'}</p>
          <button
            onClick={handleLogout}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'citizens') {
    return (
      <CitizensPage
        civilizationId={civilization.id}
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  if (currentView === 'resources') {
    return (
      <ResourcesPage
        civilizationId={civilization.id}
        onBack={() => setCurrentView('overview')}
      />
    );
  }

  const jobsMap = new Map(jobs.map((j) => [j.id, j]));
  const charactersByJob = new Map<string, number>();
  characters.forEach((char) => {
    if (char.job_id) {
      charactersByJob.set(char.job_id, (charactersByJob.get(char.job_id) || 0) + 1);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">{civilization.name}</h1>
            <p className="text-slate-400 mt-2">Population: {characters.length} citizens</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Food</p>
                <p className="text-3xl font-bold text-white">{resources.food}</p>
              </div>
              <Wheat className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Gold</p>
                <p className="text-3xl font-bold text-white">{resources.gold}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Materials</p>
                <p className="text-3xl font-bold text-white">{resources.materials}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Military Power</p>
                <p className="text-3xl font-bold text-white">{resources.military_power}</p>
              </div>
              <Sword className="w-8 h-8 text-red-400" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setCurrentView('resources')}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Manage Resources
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Job Distribution
              </h2>
              <div className="space-y-3">
                {jobs.map((job) => {
                  const count = charactersByJob.get(job.id) || 0;
                  return (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{job.name}</p>
                        <p className="text-slate-400 text-sm">{job.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-400 font-bold text-lg">{count}</p>
                        <p className="text-slate-400 text-sm">workers</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Civilization Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Citizens</p>
                  <p className="text-2xl font-bold text-white">{characters.length}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Founded</p>
                  <p className="text-white">
                    {new Date(civilization.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('citizens')}
                  className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Manage Citizens
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}