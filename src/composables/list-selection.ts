import type { RefOrGetter } from '@/types'
import { toRef, watch } from 'vue'
import type { Ref } from 'vue'

interface UseListSelectionReturn<T> {
  setSelected: (value: T) => void
  selected: Ref<T | T[] | undefined>
}

interface UseListSelectionOptions {
  DeSelectOnReSelect?: boolean
}

/**
 * handles selection for a list of items.
 *
 * @param selected a ref that holds the selected items.
 * @param multiSelect whether to allow multi-select.
 * @param options options object.
 */
export const useListSelection = <T>(
  selected: Ref<T | T[] | undefined>,
  multiSelect: RefOrGetter<boolean>,
  options: UseListSelectionOptions = {}
): UseListSelectionReturn<T> => {
  //
  const isMultiSelect = toRef(multiSelect)

  watch(isMultiSelect, (val) => {
    selected.value = val ? [] : undefined
  })

  function setSelected(value: T): void {
    if (Array.isArray(selected.value)) {
      selected.value = selected.value.includes(value)
        ? selected.value.filter((v) => v !== value)
        : [...selected.value, value]
    }
    //
    else if (selected.value !== value) {
      selected.value = value
    }
    //
    else if (options.DeSelectOnReSelect) {
      selected.value = undefined
    }
  }

  return {
    setSelected,
    selected,
  }
}
