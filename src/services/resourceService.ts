import { supabase } from '../lib/supabase';

export async function adjustResources(
  civilizationId: string,
  deltas: Partial<Record<'food' | 'gold' | 'materials' | 'military_power', number>>
) {
  const { data: current, error } = await supabase
    .from('resources')
    .select('*')
    .eq('civilization_id', civilizationId)
    .single();

  if (error || !current) throw error;

  const updated = Object.fromEntries(
    Object.entries(deltas).map(([key, delta]) => [
      key,
      current[key] + delta!,
    ])
  );

  const { error: updateError } = await supabase
    .from('resources')
    .update(updated)
    .eq('civilization_id', civilizationId);

  if (updateError) throw updateError;
}
