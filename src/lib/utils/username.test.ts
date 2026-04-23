import { describe, expect, it, vi } from 'vitest'

import {
  generateUniqueUsername,
  generateUsernameCandidate,
  placeholderUsernameAvailabilityCheck,
} from './username'

describe('generateUsernameCandidate', () => {
  it('returns adjective_noun format', () => {
    const randomValues = [0, 0.3]
    const randomFn = vi.fn(() => randomValues.shift() ?? 0)

    const username = generateUsernameCandidate(randomFn)

    expect(username).toMatch(/^[a-z]+_[a-z]+$/)
    expect(randomFn).toHaveBeenCalledTimes(2)
  })
})

describe('generateUniqueUsername', () => {
  it('retries until it finds an available username', async () => {
    const checkAvailability = vi
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)

    const randomValues = [0, 0.1, 0.2, 0.3]
    const randomFn = vi.fn(() => randomValues.shift() ?? 0)

    const username = await generateUniqueUsername(checkAvailability, 5, randomFn)

    expect(username).toMatch(/^[a-z]+_[a-z]+$/)
    expect(checkAvailability).toHaveBeenCalledTimes(2)
  })

  it('throws when all attempts are taken', async () => {
    const checkAvailability = vi.fn().mockResolvedValue(false)

    await expect(generateUniqueUsername(checkAvailability, 2)).rejects.toThrow(
      'Unable to generate a unique username. Please try again.',
    )
    expect(checkAvailability).toHaveBeenCalledTimes(2)
  })
})

describe('placeholderUsernameAvailabilityCheck', () => {
  it('returns true until backend check is implemented', async () => {
    await expect(placeholderUsernameAvailabilityCheck('test_user')).resolves.toBe(true)
  })
})
