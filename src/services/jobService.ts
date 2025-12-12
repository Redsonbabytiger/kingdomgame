import { supabase } from '../lib/supabase';
import { Job } from '../types/database';

export async function getJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select()
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function canAssignJob(
  strength: number,
  intelligence: number,
  charisma: number,
  job: Job
): boolean {
  return (
    strength >= job.min_strength &&
    intelligence >= job.min_intelligence &&
    charisma >= job.min_charisma
  );
}

export function getCompatibleJobs(
  strength: number,
  intelligence: number,
  charisma: number,
  jobs: Job[]
): Job[] {
  return jobs.filter((job) =>
    canAssignJob(strength, intelligence, charisma, job)
  );
}