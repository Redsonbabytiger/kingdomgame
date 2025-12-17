import { useState } from 'react';
import { CivilizationResources } from '../types/database';
import { adjustResources } from '../services/resourcesService';
import { Wheat, Coins, Package, Sword } from 'lucide-react';

interface ResourceManagementProps {
  resources: CivilizationResources;
  civilizationId: string;
  onResourcesUpdated: () => void;
}

type ResourceKey = 'food' | 'gold' | 'materials' | 'military_power';

export function ResourceManagement({
  resources,
  civilizationId,
  onResourcesUpdated,
}: ResourceManagementProps) {
  const [selectedResource, setSelectedResource] = useState<ResourceKey | null>(null);
  const [amount, setAmount] = useState(0);
  const [action, setAction] = useState<'add' | 'consume'>('add');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleResourceAction() {
    if (!selectedResource || amount <= 0) return;

    setLoading(true);
    setError('');

    try {
      const delta =
        action === 'add' ? amount : -amount;

      await adjustResources(civilizationId, {
        [selectedResource]: delta,
      });

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
    { id: 'food', name: 'Food', icon: Wheat, color: 'text-green-400', value: resources.food },
    { id: 'gold', name: 'Gold', icon: Coins, color: 'text-yellow-400', value: resources.gold },
    { id: 'materials', name: 'Materials', icon: Package, color: 'text-blue-400', value: resources.materials },
    { id: 'military_power', name: 'Military Power', icon: Sword, color: 'text-red-400', value: resources.military_power },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {resourcesList.map(({ id, name, icon: Icon, color, value }) => (
          <div
            key={id}
            onClick={() => setSelectedResource(id)}
            className="bg-slate-700 border border-slate-600 rounded-lg p-4 cursor-pointer hover:border-slate-500"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <p className="text-slate-400 text-sm">{name}</p>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {selectedResource && (
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">
            Manage {resourcesList.find(r => r.id === selectedResource)?.name}
          </h3>

          {selectedResource !== 'military_power' && (
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setAction('add')}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  action === 'add'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 text-slate-300'
                }`}
              >
                Add
              </button>
              <button
                onClick={() => setAction('consume')}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  action === 'consume'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-600 text-slate-300'
                }`}
              >
                Use
              </button>
            </div>
          )}

          <input
            type="number"
            min={0}
            value={amount}
            onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white mb-3"
            placeholder="Amount"
          />

          {error && (
            <div className="mb-3 p-2 bg-red-900/30 border border-red-600 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleResourceAction}
            disabled={loading || amount <= 0}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-slate-900 font-bold py-2 rounded-lg"
          >
            {loading ? 'Updating...' : 'Confirm'}
          </button>

          <button
            onClick={() => setSelectedResource(null)}
            className="w-full mt-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
