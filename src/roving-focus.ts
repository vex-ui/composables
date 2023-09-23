import type { Getter, Orientation } from '@/types'
import { wrapArray } from '@/utils'
import type { Ref } from 'vue'
import { useEventListener } from '.'
import { useKeyIntent } from './key-intent'

interface RovingFocusOptions {
  onEntryFocus?: (e: FocusEvent, focusFirst: (items: HTMLElement[]) => void) => void
  orientation?: Getter<Orientation>
}

export function useRovingFocus(
  parent: Ref<HTMLElement | null>,
  children: Ref<HTMLElement[]>,
  options: RovingFocusOptions = {}
) {
  const { orientation, onEntryFocus } = options

  useEventListener(parent, 'focus', (e: FocusEvent) => {
    onEntryFocus ? onEntryFocus(e, focusFirst) : focusFirst(children.value)
  })

  useKeyIntent(
    parent,
    (e, intent) => {
      e.preventDefault()
      e.stopPropagation()

      // TODO: fastest way to shallow clone an array?
      let elements = [...children.value]

      switch (intent) {
        case 'next': {
          const currFocusedItemIdx = elements.indexOf(e.target as HTMLElement)
          elements = wrapArray(elements, currFocusedItemIdx + 1)
          focusFirst(elements)
          break
        }

        case 'prev': {
          elements.reverse()
          const currFocusedItemIdx = elements.indexOf(e.target as HTMLElement)
          elements = wrapArray(elements, currFocusedItemIdx + 1)
          focusFirst(elements)
          break
        }

        case 'first': {
          focusFirst(elements)
          break
        }

        case 'last': {
          focusFirst(elements.reverse())
          break
        }
      }
    },
    { orientation }
  )
}

function focusFirst(elements: HTMLElement[]) {
  for (const el of elements) {
    const prevFocusedItem = document.activeElement
    if (el === prevFocusedItem) return
    el.focus()
    if (document.activeElement !== prevFocusedItem) return
  }
}
