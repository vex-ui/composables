import { createFocusTrap, type Options, type FocusTrap } from 'focus-trap'
import { onUnmounted, toRef, watch, type MaybeRefOrGetter } from 'vue'

const trapStack: FocusTrap[] = []

export function useFocusTrap(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: Options = {}
) {
  let trap: FocusTrap | null = null
  const TargetEl = toRef(target)

  watch(
    TargetEl,
    (el, prevEl) => {
      if (!el) return
      if (trap && el !== prevEl) {
        trap.updateContainerElements(el)
        return
      }

      trap = createFocusTrap(el, { ...options, trapStack })
      trapStack.push(trap)
    },
    { flush: 'post' }
  )

  onUnmounted(() => {
    if (trap) {
      trap.deactivate()
      const index = trapStack.indexOf(trap)
      if (index !== -1) trapStack.splice(index, 1)
      trap = null
    }
  })

  return {
    activate: () => trap?.activate(),
    pause: () => trap?.pause(),
    resume: () => trap?.unpause(),
  }
}
