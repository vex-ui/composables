import { type Ref, watch } from 'vue'
import type { Getter } from '@/types'

type PrimitiveValue = string | number | boolean | symbol

interface Options {
  multiselect?: Getter<boolean>
  deselection?: Getter<boolean>
}

export interface SelectionGroup<T extends PrimitiveValue> {
  select: (value: T) => void
  selected: Ref<T[]>
  deselect: (value: T) => void
  isSelected: (value: T) => boolean
  clearSelected: () => void
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

// ===

export abstract class SelectionStrategy<T extends PrimitiveValue> {
  constructor(protected selected: Ref<T[]>) {}
  abstract select(value: T, deselectOnReselect: boolean): void
  abstract deselect(value: T): void
  abstract isSelected(value: T): boolean
}

// ===

export class SingleSelect<T extends PrimitiveValue> extends SelectionStrategy<T> {
  isSelected(value: T): boolean {
    return this.selected.value.includes(value)
  }

  deselect(): void {
    this.selected.value = []
  }

  select(value: T, deselectOnReselect: boolean): void {
    if (this.isSelected(value)) {
      deselectOnReselect && this.deselect()
    } else {
      this.selected.value = [value]
    }
  }
}

// ===

export class MultiSelect<T extends PrimitiveValue> extends SelectionStrategy<T> {
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
