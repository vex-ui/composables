import { useEventListener } from '@vueuse/core'
import type { Ref } from 'vue'
import { getKeyIntent, isNavigationKey } from '@/utils'
import type { Fn, Getter, KeyIntent, NavigationKey, Orientation } from '@/types'

type keydownHandler = (e: KeyboardEvent, intent: KeyIntent, key: NavigationKey) => void
interface UseKeydownIntentOptions {
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
