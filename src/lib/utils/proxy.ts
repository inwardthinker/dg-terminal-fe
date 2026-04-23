// lib/proxy.ts
import speakeasy from 'speakeasy'

export async function proxyRequest({
  path,
  secret,
  method = 'GET',
}: {
  path: string
  secret: string
  method?: string
}) {
  const token = speakeasy.totp({
    secret,
    encoding: 'base32',
  })

  try {
    const res = await fetch(path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-totp-code': token,
      },
    })

    return new Response(await res.text(), {
      status: res.status,
    })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
