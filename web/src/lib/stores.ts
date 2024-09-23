import { writable } from 'svelte/store'

export interface User {
  id: string
  username: string
}

export const userStore = writable<User | null>(null)
