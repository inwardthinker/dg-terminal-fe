const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

export function isValidEvmAddress(value: string): boolean {
  return EVM_ADDRESS_REGEX.test(value)
}

export function normalizeEvmAddress(value?: string): string {
  const normalized = (value ?? '').trim().toLowerCase()
  return isValidEvmAddress(normalized) ? normalized : ''
}
