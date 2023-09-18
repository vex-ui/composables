import { watch } from 'vue'
import type { Getter } from '@/types'

interface UseDropdownOptions {
  role: 'menu' | 'listbox'
  dropdownID: string
  targetElID: string
  ariaExpanded: Getter<boolean>
  ariaActiveDescendant: Getter<string>
}

/**
 * handles setting aria attributes for floating elements and triggers
 */
export function useDropdownAria(
  TargetEl: Getter<HTMLElement | null>,
  Dropdown: Getter<HTMLElement | null>,
  options: UseDropdownOptions,
) {
  const { ariaActiveDescendant, dropdownID, targetElID, role, ariaExpanded } = options

  watch(
    TargetEl,
    (el) => {
      if (!el)
        return
      el.setAttribute('aria-expanded', `${ariaExpanded()}`)
      el.setAttribute('aria-controls', `${dropdownID}`)
      el.setAttribute('aria-haspopup', `${role}`)
      el.setAttribute('id', `${targetElID}`)
    },
    { immediate: true },
  )

  watch(
    Dropdown,
    (el) => {
      if (!el)
        return
      el.setAttribute('aria-labelledby', `${targetElID}`)
      el.setAttribute('role', `${role}`)
      el.setAttribute('id', `${dropdownID}`)
    },
    { immediate: true },
  )

  watch(ariaExpanded, (isExpanded) => {
    TargetEl()?.setAttribute('aria-expanded', `${isExpanded}`)
  })

  watch(ariaActiveDescendant, (active) => {
    Dropdown()?.setAttribute('aria-activedescendant', `${active}`)
  })
}
