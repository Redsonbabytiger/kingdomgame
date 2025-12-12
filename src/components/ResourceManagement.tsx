import { useState } from 'react';
import { CivilizationResources } from '../types/database';
import { addResource, consumeResource } from '../services/resourcesService';
import { Wheat, Coins, Package, Sword } from 'lucide-react';

interface ResourceManagementProps {
  resources: CivilizationResources;
  civilizationId: string;
  onResourcesUpdated: () => void;
}

export function ResourceManagement({
  resources,
  civilizationId,
  onResourcesUpdated,
}: ResourceManagementProps) {
  const [selectedResource, setSelectedResource] = useState<'food' | 'gold' | 'materials' | null>(
    null
  );
  const [amount, setAmount] = useState<number>(0);
  const [action, setAction] = useState<'add' | 'consume'>('add');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleResourceAction() {
    if (!selectedResource || amount <= 0) return;

    setLoading(true);
    setError('');

    try {
      if (selectedResource === 'military_power') {
        // Military power cannot be consumed, only added
        if (action === 'add') {
          await addResource(civilizationId, 'military_power', amount);
        } else {
          setError('Military power can only be increased');
          setLoading(false);
          return;
        }
      } else if (action === 'add') {
        await addResource(civilizationId, selectedResource, amount);
      } else {
        await consumeResource(civilizationId, selectedResource, amount);
      }

      onResourcesUpdated();
      setAmount(0);
      setSelectedResource(null);
      setAction('add');
    } catch (err) {
      setError((err as Error).message || 'Failed to update resource');
    } finally {
      setLoading(false);
    }
  }

  const resourcesList = [
    {
      id: 'food',
      name: 'Food',
      icon: Wheat,
      color: 'text-green-400',
      value: resources.food,
    },
    {
      id: 'gold',
      name: 'Gold',
      icon: Coins,
      color: 'text-yellow-400',
      value: resources.gold,
    },
    {
      id: 'materials',
      name: 'Materials',
      icon: Package,
      color: 'text-blue-400',
      value: resources.materials,
    },
    {
      id: 'military_power',
      name: 'Military Power',
      icon: Sword,
      color: 'text-red-400',
      value: resources.military_power,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {resourcesList.map((resource) => {
          const Icon = resource.icon;
          return (
            <div
              key={resource.id}
              className="bg-slate-700 border border-slate-600 rounded-lg p-4 cursor-pointer hover:border-slate-500 transition-colors"
              onClick={() => setSelectedResource(resource.id as any)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${resource.color}`} />
                <p className="text-slate-400 text-sm">{resource.name}</p>
              </div>
              <p className={`text-2xl font-bold ${resource.color}`}>{resource.value}</p>
            </div>
          );
        })}
      </div>

      {selectedResource && selectedResource !== 'military_power' ? (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">
            Manage{' '}
            {resourcesList.find((r) => r.id === selectedResource)?.name}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Action</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAction('add')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors font-semibold ${
                    action === 'add'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={() => setAction('consume')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors font-semibold ${
                    action === 'consume'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Use
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                placeholder="Enter amount"
                min="0"
              />
            </div>

            {error && (
              <div className="p-2 bg-red-900/30 border border-red-600 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleResourceAction}
              disabled={loading || amount <= 0}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Updating...' : `${action === 'add' ? 'Add' : 'Use'} ${amount}`}
            </button>

            <button
              onClick={() => setSelectedResource(null)}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : selectedResource === 'military_power' ? (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Increase Military Power</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                placeholder="Enter amount"
                min="0"
              />
            </div>

            {error && (
              <div className="p-2 bg-red-900/30 border border-red-600 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleResourceAction}
              disabled={loading || amount <= 0}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Updating...' : `Add ${amount}`}
            </button>

            <button
              onClick={() => setSelectedResource(null)}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}