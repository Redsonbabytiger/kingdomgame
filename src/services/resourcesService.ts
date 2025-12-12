import { supabase } from '../lib/supabase';
import { CivilizationResources } from '../types/database';

export async function getResources(civilizationId: string): Promise<CivilizationResources | null> {
  const { data, error } = await supabase
    .from('civilization_resources')
    .select()
    .eq('civilization_id', civilizationId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateResources(
  civilizationId: string,
  updates: Partial<CivilizationResources>
) {
  const { data, error } = await supabase
    .from('civilization_resources')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('civilization_id', civilizationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addResource(
  civilizationId: string,
  resource: 'food' | 'gold' | 'materials' | 'military_power',
  amount: number
) {
  const current = await getResources(civilizationId);
  if (!current) throw new Error('Resources not found');

  const newAmount = Math.max(0, current[resource] + amount);
  return updateResources(civilizationId, { [resource]: newAmount } as any);
}

export async function consumeResource(
  civilizationId: string,
  resource: 'food' | 'gold' | 'materials',
  amount: number
) {
  const current = await getResources(civilizationId);
  if (!current) throw new Error('Resources not found');

  if (current[resource] < amount) {
    throw new Error(`Not enough ${resource}`);
  }

  return addResource(civilizationId, resource, -amount);
}