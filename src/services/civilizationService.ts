import { supabase } from '../lib/supabase';
import { Civilization, CivilizationResources } from '../types/database';

export async function createCivilization(userId: string, name: string) {
  const { data: civilization, error: civError } = await supabase
    .from('civilizations')
    .insert([{ user_id: userId, name }])
    .select()
    .single();

  if (civError) throw civError;

  const { data: resources, error: resError } = await supabase
    .from('civilization_resources')
    .insert([{ civilization_id: civilization.id }])
    .select()
    .single();

  if (resError) throw resError;

  return { civilization, resources };
}

export async function getCivilization(userId: string): Promise<Civilization | null> {
  const { data, error } = await supabase
    .from('civilizations')
    .select()
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateCivilization(id: string, updates: Partial<Civilization>) {
  const { data, error } = await supabase
    .from('civilizations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}