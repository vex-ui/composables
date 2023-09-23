import type { Fn, Getter, KeyIntent, NavigationKey, Orientation, TemplateRef } from '@/types'
import { useEventListener, useTextDirection } from '.'

type Listener = (e: KeyboardEvent, intent: KeyIntent, key: NavigationKey) => void

interface Options {
  orientation?: Getter<Orientation>
}

export function useKeyIntent(target: TemplateRef, listener: Listener, options: Options = {}): Fn {
  return useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    const key = e.key
    if (!isNavigationKey(key)) return

    const intent = getKeyIntent(key, options.orientation?.())
    listener(e, intent, key)
  })
}

export function getKeyIntent(key: NavigationKey, orientation: Orientation = 'vertical'): KeyIntent {
  switch (getDirectionAwareKey(key)) {
    case 'ArrowDown':
      if (orientation === 'vertical') return 'next'
      return 'show'

    case 'ArrowUp':
      if (orientation === 'vertical') return 'prev'
      return 'hide'

    case 'ArrowRight':
      if (orientation === 'vertical') return 'show'
      return 'next'

    case 'ArrowLeft':
      if (orientation === 'vertical') return 'hide'
      return 'prev'

    case 'End':
      return 'last'

    case 'Home':
      return 'first'
  }
}

function getDirectionAwareKey(key: NavigationKey) {
  const dir = useTextDirection()
  if (dir.value !== 'rtl') return key
  return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key
}

function isNavigationKey(v: string): v is NavigationKey {
  return ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(v)
}
