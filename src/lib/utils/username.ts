const ADJECTIVES = [
  'agile',
  'bold',
  'calm',
  'eager',
  'fierce',
  'keen',
  'lively',
  'noble',
  'swift',
  'witty',
] as const

const NOUNS = [
  'falcon',
  'otter',
  'panther',
  'raven',
  'tiger',
  'wolf',
  'lynx',
  'phoenix',
  'orca',
  'viper',
] as const

export type UsernameAvailabilityChecker = (username: string) => Promise<boolean>

function pickRandom<T>(list: readonly T[], randomFn: () => number): T {
  const index = Math.floor(randomFn() * list.length)
  return list[index]
}

export function generateUsernameCandidate(randomFn: () => number = Math.random): string {
  const adjective = pickRandom(ADJECTIVES, randomFn)
  const noun = pickRandom(NOUNS, randomFn)
  return `${adjective}_${noun}`
}

export async function placeholderUsernameAvailabilityCheck(_username: string): Promise<boolean> {
  // TODO: Replace with backend/db uniqueness check, e.g. GET /users/check-username?value=<username>
  return true
}

export async function generateUniqueUsername(
  checkAvailability: UsernameAvailabilityChecker = placeholderUsernameAvailabilityCheck,
  maxAttempts = 10,
  randomFn: () => number = Math.random,
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = generateUsernameCandidate(randomFn)
    const isAvailable = await checkAvailability(candidate)

    if (isAvailable) {
      return candidate
    }
  }

  throw new Error('Unable to generate a unique username. Please try again.')
}
