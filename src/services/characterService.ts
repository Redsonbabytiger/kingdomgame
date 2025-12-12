import { supabase } from '../lib/supabase';
import { Character, CharacterWithJob } from '../types/database';

export async function createCharacter(
  civilizationId: string,
  name: string,
  stats?: { strength?: number; intelligence?: number; charisma?: number }
) {
  const { data, error } = await supabase
    .from('characters')
    .insert([
      {
        civilization_id: civilizationId,
        name,
        strength: stats?.strength ?? 10,
        intelligence: stats?.intelligence ?? 10,
        charisma: stats?.charisma ?? 10,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCharacters(civilizationId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select()
    .eq('civilization_id', civilizationId)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getCharacter(id: string): Promise<Character | null> {
  const { data, error } = await supabase
    .from('characters')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateCharacter(id: string, updates: Partial<Character>) {
  const { data, error } = await supabase
    .from('characters')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignJob(characterId: string, jobId: string) {
  return updateCharacter(characterId, { job_id: jobId as any });
}

export async function removeJob(characterId: string) {
  return updateCharacter(characterId, { job_id: null });
}

export async function deleteCharacter(id: string) {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id);

  if (error) throw error;
}