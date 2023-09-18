import type { Fn, Getter, KeyIntent, NavigationKey, Orientation } from '@/types'
import { useEventListener } from '@vueuse/core'
import { getKeyIntent, isNavigationKey } from './helpers'
import type { Ref } from 'vue'

type keydownHandler = (e: KeyboardEvent, intent: KeyIntent, key: NavigationKey) => void
type UseKeydownIntentOptions = {
  orientation?: Getter<Orientation>
}

export function useKeydownIntent(
  target: Ref<HTMLElement | null>,
  handler: keydownHandler,
  options: UseKeydownIntentOptions = {}
): Fn {
  return useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    const key = e.key
    if (!isNavigationKey(key)) return

    const intent = getKeyIntent(key, options.orientation?.())
    handler(e, intent, key)
  })
}
