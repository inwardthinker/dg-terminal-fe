export const LOGIN_MODAL_STEPS = [
  { text: 'Initializing secure gateway...', duration: 100 },
  { text: 'Loading auth providers...', duration: 200 },
  { text: 'Ready.', duration: 100 },
]

export const OAUTH_INIT_STEPS = [
  { text: 'Establishing secure connection...', duration: 120 },
  { text: 'Redirecting to provider...', duration: 150 },
]

export const OAUTH_RETURN_STEPS = [
  { text: 'Re-establishing secure session...', duration: 250 },
  { text: 'Validating credentials...', duration: 350 },
  { text: 'Fetching user profile...', duration: 300 },
  { text: 'Initializing workspace...', duration: 300 },
  { text: 'Syncing account state...', duration: 300 },
  { text: 'Finalizing setup...', duration: 250 },
  { text: 'Ready.', duration: 100 },
]
