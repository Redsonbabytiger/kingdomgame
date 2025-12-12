export interface Civilization {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  name: string;
  description: string | null;
  min_strength: number;
  min_intelligence: number;
  min_charisma: number;
  created_at: string;
}

export interface Character {
  id: string;
  civilization_id: string;
  name: string;
  age: number;
  job_id: string | null;
  strength: number;
  intelligence: number;
  charisma: number;
  experience: number;
  loyalty: number;
  created_at: string;
  updated_at: string;
}

export interface CivilizationResources {
  id: string;
  civilization_id: string;
  food: number;
  gold: number;
  materials: number;
  military_power: number;
  updated_at: string;
}

export interface CharacterWithJob extends Character {
  job?: Job;
}

export interface CivilizationData {
  civilization: Civilization;
  resources: CivilizationResources;
  characters: Character[];
  jobs: Job[];
}