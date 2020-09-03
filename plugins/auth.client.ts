import { Context } from '@nuxt/types'

interface JwtPayload {
  acr: string
  'allowed-origins': string[]
  aud: string
  // eslint-disable-next-line camelcase
  auth_time: number
  azp: string
  email: string
  // eslint-disable-next-line camelcase
  email_verified: boolean
  exp: number
  groups: string[]
  iat: number
  iss: string
  jti: string
  // eslint-disable-next-line camelcase
  preferred_username: string
  // eslint-disable-next-line camelcase
  realm_access: any
  // eslint-disable-next-line camelcase
  resource_access: any
  scope: string
  // eslint-disable-next-line camelcase
  session_state: string
  sub: string
  typ: string
}

export default function ({ $auth }: Context) {
  const jwt = $auth.strategy.token.get()

  if (!jwt) {
    $auth.setUser(undefined)
    return
  }

  $auth.setUser(parseJwt(jwt))
}

function parseJwt (token: string): JwtPayload {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )

  return JSON.parse(jsonPayload)
}
