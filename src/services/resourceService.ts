import { supabase } from '../lib/supabase';

export interface Resources {
  id: string;
  civilization_id: string;
  food: number;
  wood: number;
  stone: number;
  gold: number;
}

/**
 * Fetch resources for a civilization
 */
export async function getResources(civilizationId: string): Promise<Resources | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('civilization_id', civilizationId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update resources safely (RLS enforced)
 */
export async function updateResources(
  civilizationId: string,
  changes: Partial<Omit<Resources, 'id' | 'civilization_id'>>
): Promise<void> {
  const { error } = await supabase
    .from('resources')
    .update(changes)
    .eq('civilization_id', civilizationId);

  if (error) throw error;
}

/**
 * Increment/decrement resources (common for jobs/actions)
 */
export async function adjustResources(
  civilizationId: string,
  deltas: Partial<Record<'food' | 'wood' | 'stone' | 'gold', number>>
): Promise<void> {
  // Fetch current resources first
  const current = await getResources(civilizationId);
  if (!current) throw new Error('Resources not found');

  const updated = Object.fromEntries(
    Object.entries(deltas).map(([key, delta]) => [
      key,
      (current as any)[key] + delta!,
    ])
  );

  await updateResources(civilizationId, updated);
}
