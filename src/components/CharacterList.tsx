import { Character, Job } from '../types/database';
import { BicepsFlexed, Heart, Zap, Brain, Users, Eye } from 'lucide-react';

interface CharacterListProps {
  characters: Character[];
  jobs: Map<string, Job>;
  onSelectCharacter: (character: Character) => void;
  selectedCharacterId?: string;
}

export function CharacterList({
  characters,
  jobs,
  onSelectCharacter,
  selectedCharacterId,
}: CharacterListProps) {
  const getStat = (value: number) => {
    if (value >= 15) return 'text-green-400';
    if (value >= 12) return 'text-blue-400';
    if (value >= 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-2">
      {characters.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No citizens yet. You can create them through your Python backend.</p>
        </div>
      ) : (
        characters.map((character) => {
          const job = character.job_id ? jobs.get(character.job_id) : null;
          const isSelected = selectedCharacterId === character.id;

          return (
            <div
              key={character.id}
              onClick={() => onSelectCharacter(character)}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{character.name} {character.last_name}</h3>
                  <p className="text-slate-400 text-sm">
                    {job ? job.name : 'Unemployed'} • Age {character.age}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <biceps-flexed className={`w-4 h-4 ${getStat(character.strength)}`} />
                    <span className={`text-sm font-semibold ${getStat(character.strength)}`}>
                      {character.strength}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className={`w-4 h-4 ${getStat(character.perception)}`} />
                    <span className={`text-sm font-semibold ${getStat(character.perception)}`}>
                      {character.perception}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Brain className={`w-4 h-4 ${getStat(character.intelligence)}`} />
                    <span className={`text-sm font-semibold ${getStat(character.intelligence)}`}>
                      {character.intelligence}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className={`w-4 h-4 ${getStat(character.charisma)}`} />
                    <span className={`text-sm font-semibold ${getStat(character.charisma)}`}>
                      {character.charisma}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">{character.energy}</span>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <p className="text-amber-400 font-semibold text-sm">Health</p>
                  <p className="text-white text-lg">{character.health}%</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
