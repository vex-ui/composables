import type { Fn, Getter, Orientation, TemplateRef } from '@/types'
import type { Ref } from 'vue'
import { useKeyIntent } from '.'

interface Options {
  orientation?: Getter<Orientation>
}

export function useListHighlight(
  parent: TemplateRef,
  highlighted: Ref<number>,
  children: Ref<HTMLElement[]>,
  options: Options = {}
): Fn {
  return useKeyIntent(
    parent,
    (e: KeyboardEvent, intent) => {
      const last = children.value.length - 1
      const oldValue = highlighted.value
      e.preventDefault()
      e.stopPropagation()

      switch (intent) {
        case 'next':
          highlighted.value = oldValue >= last ? 0 : oldValue + 1
          break

        case 'prev':
          highlighted.value = oldValue <= 0 ? last : oldValue - 1
          break

        case 'first':
          highlighted.value = 0
          break

        case 'last':
          highlighted.value = last
          break
      }
    },
    options
  )
}
