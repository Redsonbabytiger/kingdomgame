import { useState } from 'react';
import { Character, Job } from '../types/database';
import { assignJob, removeJob, deleteCharacter } from '../services/characterService';
import { Heart, Brain, Users, Zap, Trash2, X } from 'lucide-react';

interface CharacterDetailProps {
  character: Character;
  allJobs: Job[];
  currentJob: Job | undefined;
  onJobAssigned: () => void;
  onCharacterDeleted: () => void;
  onClose: () => void;
}

export function CharacterDetail({
  character,
  allJobs,
  currentJob,
  onJobAssigned,
  onCharacterDeleted,
  onClose,
}: CharacterDetailProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showJobSelector, setShowJobSelector] = useState(false);

  const compatibleJobs = allJobs.filter(
    (job) =>
      character.strength >= job.min_strength &&
      character.intelligence >= job.min_intelligence &&
      character.charisma >= job.min_charisma
  );

  async function handleAssignJob(jobId: string) {
    setLoading(true);
    setError('');
    try {
      await assignJob(character.id, jobId);
      onJobAssigned();
      setShowJobSelector(false);
    } catch (err) {
      setError('Failed to assign job');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveJob() {
    setLoading(true);
    setError('');
    try {
      await removeJob(character.id);
      onJobAssigned();
    } catch (err) {
      setError('Failed to remove job');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCharacter() {
    if (!confirm('Are you sure you want to remove this citizen?')) return;
    setLoading(true);
    try {
      await deleteCharacter(character.id);
      onCharacterDeleted();
    } catch (err) {
      setError('Failed to delete character');
    } finally {
      setLoading(false);
    }
  }

  const getStat = (value: number) => {
    if (value >= 15) return 'text-green-400';
    if (value >= 12) return 'text-blue-400';
    if (value >= 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatColor = (value: number) => {
    if (value >= 15) return 'bg-green-500/20';
    if (value >= 12) return 'bg-blue-500/20';
    if (value >= 8) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{character.name}</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-slate-400 text-sm mb-1">Age</p>
          <p className="text-xl font-bold text-white">{character.age}</p>
        </div>
        <div>
          <p className="text-slate-400 text-sm mb-1">Loyalty</p>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full"
              style={{ width: `${character.loyalty}%` }}
            ></div>
          </div>
          <p className="text-white text-sm mt-1">{character.loyalty}%</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className={`p-4 rounded-lg border border-slate-600 ${getStatColor(character.strength)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className={`w-5 h-5 ${getStat(character.strength)}`} />
              <span className="text-white font-semibold">Strength</span>
            </div>
            <span className={`text-lg font-bold ${getStat(character.strength)}`}>
              {character.strength}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Min required for military roles</p>
        </div>

        <div className={`p-4 rounded-lg border border-slate-600 ${getStatColor(character.intelligence)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className={`w-5 h-5 ${getStat(character.intelligence)}`} />
              <span className="text-white font-semibold">Intelligence</span>
            </div>
            <span className={`text-lg font-bold ${getStat(character.intelligence)}`}>
              {character.intelligence}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Required for research and engineering</p>
        </div>

        <div className={`p-4 rounded-lg border border-slate-600 ${getStatColor(character.charisma)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${getStat(character.charisma)}`} />
              <span className="text-white font-semibold">Charisma</span>
            </div>
            <span className={`text-lg font-bold ${getStat(character.charisma)}`}>
              {character.charisma}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Important for trade and diplomacy</p>
        </div>

        <div className="p-4 rounded-lg border border-slate-600 bg-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Experience</span>
            </div>
            <span className="text-lg font-bold text-purple-400">{character.experience}</span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Gained from working in jobs</p>
        </div>
      </div>

      <div className="border-t border-slate-600 pt-6">
        <h3 className="text-lg font-bold text-white mb-4">Job Assignment</h3>

        {currentJob ? (
          <div className="bg-green-500/10 border border-green-600 rounded-lg p-4 mb-4">
            <p className="text-white font-semibold mb-2">{currentJob.name}</p>
            <p className="text-slate-300 text-sm mb-4">{currentJob.description}</p>
            <button
              onClick={handleRemoveJob}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
            >
              Remove Job
            </button>
          </div>
        ) : (
          <p className="text-slate-400 text-sm mb-4">No job assigned</p>
        )}

        {!showJobSelector ? (
          <button
            onClick={() => setShowJobSelector(true)}
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-700 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Change Job
          </button>
        ) : (
          <div className="space-y-2">
            <div className="text-slate-400 text-sm mb-3">Compatible jobs:</div>
            {compatibleJobs.length === 0 ? (
              <p className="text-slate-400 text-sm">No jobs available for this citizen's stats</p>
            ) : (
              compatibleJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleAssignJob(job.id)}
                  disabled={loading}
                  className="w-full text-left p-3 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 rounded-lg transition-colors border border-slate-500"
                >
                  <p className="text-white font-semibold">{job.name}</p>
                  <p className="text-slate-300 text-sm">{job.description}</p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-600 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleDeleteCharacter}
        disabled={loading}
        className="w-full mt-6 flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 disabled:bg-red-900/20 text-red-300 font-semibold py-2 px-4 rounded-lg transition-colors border border-red-700"
      >
        <Trash2 className="w-4 h-4" />
        Remove Citizen
      </button>
    </div>
  );
}