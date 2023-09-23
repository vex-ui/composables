import { isWatchable, remove } from '@/utils'
import type { Options as $Options, FocusTrap } from 'focus-trap'
import { createFocusTrap } from 'focus-trap'
import type { MaybeRefOrGetter } from 'vue'
import { onScopeDispose, watch } from 'vue'

interface Options extends $Options {}

const trapStack: FocusTrap[] = []

export function useFocusTrap(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: Options = {}
) {
  let trap: FocusTrap | null = null
  const createTrap = (el: HTMLElement) => createFocusTrap(el, { ...options, trapStack })

  if (isWatchable(target)) {
    watch(target, (el) => {
      if (!el) return
      if (trap) {
        trap.updateContainerElements(el)
        return
      }

      trap = createTrap(el)
      trapStack.push(trap)
    })
  } else if (target) {
    trap = createTrap(target)
    trapStack.push(trap)
  }

  onScopeDispose(() => {
    if (trap) {
      trap.deactivate()
      remove(trapStack, trap)
      trap = null
    }
  })

  return {
    pause: () => trap?.pause(),
    resume: () => trap?.unpause(),
    activate: () => trap?.activate(),
  }
}
