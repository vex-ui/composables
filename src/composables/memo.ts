import type { Fn, Getter } from '@/types'
import type { WatchOptions, WatchSource } from 'vue'
import { computed, customRef, watch } from 'vue'

/**
 * Memoize the return value of a function,
 * - source can be explicit or implicit.
 * - flush timing can be adjusted for explicit source.
 * - may accept debugger hooks for explicit source.
 *
 * @param fn
 * @param source
 * @param options
 */
export function useMemo<T>(
  fn: Getter<T>,
  source?: WatchSource | WatchSource[],
  options: WatchOptions = {
    flush: 'sync',
  }
): Getter<T> {
  if (!source) {
    const internalRef = computed<T>(fn)
    return () => internalRef.value
  }

  let v: T
  let trigger: Fn
  let dirty = true

  watch(
    source,
    function update() {
      dirty = true
      trigger()
    },
    options
  )

  const internalRef = customRef<T>((track, _trigger) => {
    trigger = _trigger

    return {
      get() {
        if (dirty) {
          v = fn()
          dirty = false
        }
        track()
        return v
      },
      set() {},
    }
  })

  return () => internalRef.value
}
