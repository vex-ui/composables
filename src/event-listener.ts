import type { Fn, MaybeRefOrGetter } from '@/types'
import { isClient, isWatchable, noop } from '@/utils'
import { onScopeDispose, watch } from 'vue'

type Options = AddEventListenerOptions

export function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: E,
  listener: (e: WindowEventMap[E]) => void,
  options?: Options
): Fn

export function useEventListener<E extends keyof DocumentEventMap>(
  target: Document,
  event: E,
  listener: (e: DocumentEventMap[E]) => void,
  options?: Options
): Fn

export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeRefOrGetter<HTMLElement | null>,
  event: E,
  listener: (e: HTMLElementEventMap[E]) => void,
  options?: Options
): Fn

export function useEventListener(
  target: MaybeRefOrGetter<HTMLElement | null> | Document | Window,
  event: string,
  listener: (e: unknown) => void,
  options?: Options
): Fn {
  if (!isClient || !target) return noop

  let unregister = noop
  let stopWatch = noop

  const register = (el: HTMLElement | Window | Document) => {
    el.addEventListener(event, listener, options)
    return () => el.removeEventListener(event, listener, options)
  }

  if (target === window || target === document || !isWatchable(target)) {
    unregister = register(target)
  } else {
    stopWatch = watch(
      target,
      (el) => {
        unregister()
        el && (unregister = register(el))
      },
      { immediate: true, flush: 'post' }
    )
  }

  const cleanup = () => {
    stopWatch()
    unregister()
  }

  onScopeDispose(cleanup)
  return cleanup
}
