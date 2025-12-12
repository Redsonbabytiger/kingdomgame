import { useEffect, useState } from 'react';
import { Character, Job } from '../types/database';
import { getCharacters } from '../services/characterService';
import { getJobs } from '../services/jobService';
import { CharacterList } from '../components/CharacterList';
import { CharacterDetail } from '../components/CharacterDetail';
import { ArrowLeft } from 'lucide-react';

interface CitizensPageProps {
  civilizationId: string;
  onBack: () => void;
}

export function CitizensPage({ civilizationId, onBack }: CitizensPageProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [charData, jobData] = await Promise.all([
        getCharacters(civilizationId),
        getJobs(),
      ]);
      setCharacters(charData);
      setJobs(jobData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function handleJobAssigned() {
    loadData();
    setSelectedCharacter(null);
  }

  function handleCharacterDeleted() {
    loadData();
    setSelectedCharacter(null);
  }

  const jobsMap = new Map(jobs.map((j) => [j.id, j]));
  const selectedJob = selectedCharacter && selectedCharacter.job_id ? jobsMap.get(selectedCharacter.job_id) : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading citizens...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">Citizens</h1>
        <p className="text-slate-400 mb-8">Manage your civilization's population</p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Population: {characters.length}
              </h2>
              <CharacterList
                characters={characters}
                jobs={jobsMap}
                onSelectCharacter={setSelectedCharacter}
                selectedCharacterId={selectedCharacter?.id}
              />
            </div>
          </div>

          <div>
            {selectedCharacter ? (
              <CharacterDetail
                character={selectedCharacter}
                allJobs={jobs}
                currentJob={selectedJob}
                onJobAssigned={handleJobAssigned}
                onCharacterDeleted={handleCharacterDeleted}
                onClose={() => setSelectedCharacter(null)}
              />
            ) : (
              <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 text-center">
                <p className="text-slate-400">Select a citizen to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}