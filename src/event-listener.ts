import type { Fn, TemplateRef } from '@/types'
import { isClient, noop } from '@/utils'
import { onScopeDispose, watch } from 'vue'

type Listener<E extends keyof HTMLElementEventMap> = (e: HTMLElementEventMap[E]) => void
type Options = AddEventListenerOptions

export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: TemplateRef,
  event: E,
  listener: Listener<E>,
  options?: Options
): Fn {
  if (!isClient) return noop
  let unregister = noop
  let stopWatch = noop

  const register = (el: HTMLElement) => {
    el.addEventListener(event, listener, options)
    return () => el.removeEventListener(event, listener, options)
  }

  stopWatch = watch(
    target,
    (el) => {
      unregister()
      if (!el) return
      unregister = register(el)
    },
    { immediate: true, flush: 'post' }
  )

  const cleanup = () => {
    stopWatch()
    unregister()
  }

  onScopeDispose(cleanup)
  return cleanup
}
