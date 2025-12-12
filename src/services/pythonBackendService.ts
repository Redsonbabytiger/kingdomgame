import { Character } from '../types/database';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createCharacterViaBackend(
  civilizationId: string,
  name: string,
  stats?: { strength?: number; intelligence?: number; charisma?: number }
): Promise<Character> {
  const response = await fetch(`${BACKEND_URL}/api/characters/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      civilization_id: civilizationId,
      name,
      stats,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create character via backend');
  }

  const result: ApiResponse<Character> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to create character');
  }

  return result.data;
}

export async function performCharacterAction(
  characterId: string,
  action: string,
  params?: Record<string, any>
): Promise<Character> {
  const response = await fetch(`${BACKEND_URL}/api/characters/${characterId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, params }),
  });

  if (!response.ok) {
    throw new Error('Failed to perform action');
  }

  const result: ApiResponse<Character> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to perform action');
  }

  return result.data;
}

export async function advanceGameCycle(civilizationId: string): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/api/civilization/${civilizationId}/advance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to advance game cycle');
  }

  const result: ApiResponse<any> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to advance game cycle');
  }

  return result.data;
}

export async function getGameState(civilizationId: string): Promise<any> {
  const response = await fetch(
    `${BACKEND_URL}/api/civilization/${civilizationId}/state`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch game state');
  }

  const result: ApiResponse<any> = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch game state');
  }

  return result.data;
}

export async function simulateCharacterGrowth(characterId: string): Promise<Character> {
  const response = await fetch(
    `${BACKEND_URL}/api/characters/${characterId}/simulate-growth`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error('Failed to simulate character growth');
  }

  const result: ApiResponse<Character> = await response.json();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to simulate growth');
  }

  return result.data;
}