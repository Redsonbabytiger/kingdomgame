import { useEffect, useState } from 'react';
import { CivilizationResources } from '../types/database';
import { getResources } from '../services/resourcesService';
import { ResourceManagement } from '../components/ResourceManagement';
import { ArrowLeft, TrendingUp } from 'lucide-react';

interface ResourcesPageProps {
  civilizationId: string;
  onBack: () => void;
}

export function ResourcesPage({ civilizationId, onBack }: ResourcesPageProps) {
  const [resources, setResources] = useState<CivilizationResources | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    try {
      const data = await getResources(civilizationId);
      if (data) setResources(data);
    } catch (err) {
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading resources...</p>
      </div>
    );
  }

  if (error || !resources) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="text-red-400">{error || 'Failed to load resources'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Resources
          </h1>
          <p className="text-slate-400">Manage your civilization's resources</p>
        </div>

        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <ResourceManagement
            resources={resources}
            civilizationId={civilizationId}
            onResourcesUpdated={loadResources}
          />
        </div>

        <div className="mt-8 bg-slate-700 border border-slate-600 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Resource Guide</h2>
          <div className="space-y-4 text-slate-300">
            <div>
              <p className="font-semibold text-white">Food</p>
              <p className="text-sm">Required to feed your population. Characters working in farms produce food.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Gold</p>
              <p className="text-sm">Used for trade and building. Merchants generate gold for your civilization.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Materials</p>
              <p className="text-sm">Essential for construction and crafting. Workers gather materials from natural resources.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Military Power</p>
              <p className="text-sm">Represents your civilization's military strength. Soldiers and generals contribute to this.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}