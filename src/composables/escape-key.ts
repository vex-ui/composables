import { onScopeDispose } from 'vue'
import { noop, remove } from './helpers'
import { isClient } from '@vueuse/core'

type Listener = (e: KeyboardEvent) => void

const listeners: Listener[] = []
let isActive = false

export function useEscapeKey(listener: Listener): () => void {
  if (!isClient) {
    return noop
  }

  if (!isActive) {
    document.addEventListener('keydown', onEscape)
    isActive = true
  }

  listeners.push(listener)

  const cleanup = () => remove(listeners, listener)
  onScopeDispose(cleanup)

  return cleanup
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    listeners.forEach((fn) => fn(e))
  }
}
