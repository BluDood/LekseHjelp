import { browser } from '$app/environment'

export const apiBase = browser
  ? `${location.protocol}//${
      location.port === '5173'
        ? `${location.hostname}:1337`
        : `${location.host}`
    }/api`
  : 'http://localhost:1337'
