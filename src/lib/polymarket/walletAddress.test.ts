import { describe, expect, it } from 'vitest'
import { isValidEvmAddress, normalizeEvmAddress } from './walletAddress'

describe('walletAddress utilities', () => {
  it('normalizes valid addresses', () => {
    expect(normalizeEvmAddress(' 0xF17d0707cAaF62f925D113B0053960994B2C40BC ')).toBe(
      '0xf17d0707caaf62f925d113b0053960994b2c40bc',
    )
  })

  it('rejects malformed addresses', () => {
    expect(isValidEvmAddress('0x5ae14dc9e0cf9df72de8d873dcea05aacb799fa')).toBe(false)
    expect(normalizeEvmAddress('not-an-address')).toBe('')
  })
})
