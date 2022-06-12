import { get as getValue, set as setValue } from './storage'

const KEY = 'PAT'

async function get() {
  return getValue(KEY)
}

async function set(value: string) {
  return setValue(KEY, value)
}

export { get, set }
