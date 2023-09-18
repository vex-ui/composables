import { onScopeDispose, toValue } from 'vue'
import type { Fn, MaybeRefOrGetter } from '@/types'

interface Options {
  defaultShowDelay?: MaybeRefOrGetter<number | undefined>
  defaultHideDelay?: MaybeRefOrGetter<number | undefined>
}

export function useDelayedOpen(show: Fn, hide: Fn, options: Options = {}) {
  const { defaultHideDelay = 0, defaultShowDelay = 0 } = options

  let showTimeoutID: ReturnType<typeof setTimeout>
  let hideTimeoutID: ReturnType<typeof setTimeout>

  const clearTimeouts = () => {
    clearTimeout(showTimeoutID)
    clearTimeout(hideTimeoutID)
  }

  onScopeDispose(clearTimeouts)

  return {
    show: (delay?: number) => {
      clearTimeouts()
      const _delay = delay ?? toValue(defaultShowDelay)

      if (_delay === 0)
        show()
      else
        showTimeoutID = setTimeout(show, _delay)
    },

    hide: (delay?: number) => {
      clearTimeouts()
      const _delay = delay ?? toValue(defaultHideDelay)

      if (_delay === 0)
        hide()
      else
        hideTimeoutID = setTimeout(hide, _delay)
    },
  }
}
