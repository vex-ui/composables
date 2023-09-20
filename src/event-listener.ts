import type { Fn } from '@/types'
import { isWatchable, noop, isClient } from '@/utils'
import { onScopeDispose, watch, type MaybeRefOrGetter } from 'vue'

type EventListener<E extends keyof HTMLElementEventMap> = (evt: HTMLElementEventMap[E]) => void

export function useEventListener<Event extends keyof HTMLElementEventMap>(
  target: MaybeRefOrGetter<HTMLElement | null>,
  event: Event,
  listener: EventListener<Event>,
  options?: AddEventListenerOptions
): Fn {
  if (!isClient) return noop
  let unregister = noop
  let stopWatch = noop

  const register = (el: HTMLElement) => {
    el.addEventListener(event, listener, options)
    return () => el.removeEventListener(event, listener, options)
  }

  if (isWatchable(target)) {
    stopWatch = watch(
      target,
      (el) => {
        unregister()
        if (!el) return
        unregister = register(el)
      },
      { immediate: true, flush: 'post' }
    )
  } else {
    target && (unregister = register(target))
  }

  const stop = () => {
    stopWatch()
    unregister()
  }

  onScopeDispose(stop)
  return stop
}
