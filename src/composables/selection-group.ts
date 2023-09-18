import type { Getter } from '@/types'
import { watch, type Ref } from 'vue'

type PrimitiveValue = string | number | boolean | symbol

interface Options {
  multiselect?: Getter<boolean>
  deselection?: Getter<boolean>
}

export interface SelectionGroup<T> {
  isSelected: (value: T) => boolean
  clearSelected: () => void
  select: (value: T) => void
  deselect: (value: T) => void
  selected: Ref<T[]>
}

/**
 * Represents a selection group for managing a group of selectable values.
 */
export function useSelectionGroup<T extends PrimitiveValue>(
  selected: Ref<T[]>,
  options: Options = {}
): SelectionGroup<T> {
  const deselection = options.deselection ?? (() => false)
  const multiselect = options.multiselect ?? (() => false)
  let strategy = multiselect() ? new MultiSelect(selected) : new SingleSelect(selected)

  const select = (value: T): void => {
    strategy.select(value, deselection())
  }

  const deselect = (value: T): void => {
    strategy.deselect(value)
  }

  const isSelected = (value: T): boolean => {
    return strategy.isSelected(value)
  }

  const clearSelected = (): void => {
    selected.value = []
  }

  watch(multiselect, (multi) => {
    clearSelected()
    strategy = multi ? new MultiSelect(selected) : new SingleSelect(selected)
  })

  return {
    select,
    selected,
    deselect,
    isSelected,
    clearSelected,
  }
}

//===

export abstract class SelectionStrategy<T> {
  constructor(protected selected: Ref<T[]>) {}
  abstract deselect(value: T): void
  abstract isSelected(value: T): boolean
  abstract select(value: T, deselectOnReselect: boolean): void
}

//===

export class SingleSelect<T> extends SelectionStrategy<T> {
  isSelected(value: T): boolean {
    return this.selected.value.includes(value)
  }

  deselect(): void {
    this.selected.value = []
  }

  select(value: T, deselectOnReselect: boolean): void {
    if (this.isSelected(value)) {
      if (deselectOnReselect) {
        this.deselect()
      }
    } else {
      this.selected.value = [value]
    }
  }
}

//===

export class MultiSelect<T> extends SelectionStrategy<T> {
  isSelected(value: T): boolean {
    return this.selected.value.includes(value)
  }

  deselect(value: T): void {
    this.selected.value = this.selected.value.filter((_value) => _value !== value)
  }

  select(value: T): void {
    if (this.isSelected(value)) {
      this.deselect(value)
    } else {
      this.selected.value = [...this.selected.value, value]
    }
  }
}
