// ported from @vueuse/core - refWithControl

import { customRef, type Ref, type ShallowUnwrapRef } from 'vue'
import { extendRef } from './extend-ref'
import type { Fn } from '@/types'

export interface UseRefOptions<T> {
  /**
   * Callback function before the ref changing.
   *
   * Returning `false` to dismiss the change.
   */
  onBeforeChange?: (value: T, oldValue: T) => void | boolean

  /**
   * Callback function after the ref changed
   *
   * This happens synchronously, with less overhead compare to `watch`
   */
  onChanged?: (value: T, oldValue: T) => void
}

export type ControlledRef<T> = ShallowUnwrapRef<{
  peek: () => T
  lay: (v: T) => void
}> &
  Ref<T>

/**
 * Read or write without triggering reactivity.
 *
 * @param initial the initial value
 * @param options
 */
export function useRef<T>(initial: T, options: UseRefOptions<T> = {}): ControlledRef<T> {
  let source = initial
  let track: Fn
  let trigger: Fn

  const ref = customRef<T>((_track, _trigger) => {
    track = _track
    trigger = _trigger

    return {
      get() {
        return get()
      },
      set(v) {
        set(v)
      },
    }
  })

  function get(tracking = true) {
    if (tracking) track()
    return source
  }

  function set(value: T, triggering = true) {
    if (value === source) return

    const old = source
    if (options.onBeforeChange?.(value, old) === false) return // dismissed

    source = value

    options.onChanged?.(value, old)

    if (triggering) trigger()
  }

  /**
   * Get the value without being tracked in the reactivity system.
   */
  const peek = () => get(false)

  /**
   * Set the value without triggering the reactivity system
   */
  const lay = (v: T) => set(v, false)

  return extendRef(
    ref,
    {
      peek,
      lay,
    },
    { enumerable: true }
  )
}
