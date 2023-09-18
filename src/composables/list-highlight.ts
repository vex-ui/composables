import { useEventListener } from '@vueuse/core'
import { watch, type Ref } from 'vue'
import { isFunction } from './helpers'

export function useListHighlight(
  parent: Ref<HTMLElement | null>,
  highlighted: Ref<number>,
  children: Ref<HTMLElement[]>
) {
  useEventListener(parent, 'keydown', (e: KeyboardEvent) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return

    const last = children.value.length - 1
    e.preventDefault()
    e.stopPropagation()

    switch (e.key) {
      case 'ArrowDown':
        setHighlighted((v) => (v >= last ? 0 : v + 1))
        break

      case 'ArrowUp':
        setHighlighted((v) => (v <= 0 ? last : v - 1))
        break

      case 'Home':
        setHighlighted(0)
        break

      case 'End':
        setHighlighted(last)
        break
    }
  })

  watch(
    highlighted,
    (curr: number, prev: number) => {
      const items = children.value
      items[prev]?.classList.remove('--highlighted')
      items[curr]?.classList.add('--highlighted')
    },
    { flush: 'sync' }
  )

  function setHighlighted(setter: ((v: number) => number) | number): void {
    highlighted.value = isFunction(setter) ? setter(highlighted.value) : setter
  }
}
