import { onScopeDispose } from 'vue'
import { noop, remove, isClient } from '@/utils'

type Listener = (e: KeyboardEvent) => void

const listeners: Listener[] = []
let isAttached = false

export function useEscapeKey(listener: Listener): () => void {
  if (!isClient) return noop
  if (!isAttached) {
    document.addEventListener('keydown', onEscape)
    isAttached = true
  }

  listeners.push(listener)

  const cleanup = () => {
    remove(listeners, listener)
    if (!listeners.length) {
      document.removeEventListener('keydown', onEscape)
      isAttached = false
    }
  }
  onScopeDispose(cleanup)
  return cleanup
}

function onEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') listeners.forEach((fn) => fn(e))
}
