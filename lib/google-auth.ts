import { JWT } from 'google-auth-library'

export function getGoogleServiceAccountAuth(scopes: string[]): JWT {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim()
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!email || !privateKey) {
    throw new Error('Google service account credentials are not configured')
  }

  return new JWT({
    email,
    key: privateKey,
    scopes,
  })
}
