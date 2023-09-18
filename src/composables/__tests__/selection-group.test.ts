import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { MultiSelect, SingleSelect, useSelectionGroup } from '../selection-group'

// ----------------------------------------------------------------------------------------------------
// 📌 SingleSelection
// ----------------------------------------------------------------------------------------------------

describe('SingleSelect', () => {
  it('should select a new value', () => {
    const selected = ref([])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', true)
    expect(selected.value).toEqual(['test'])
  })

  it('should deselect', () => {
    const selected = ref(['test'])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.deselect()
    expect(selected.value).toEqual([])
  })

  it('should return whether a value is selected', () => {
    const selected = ref([])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', false)
    expect(singleSelect.isSelected('test')).toBe(true)
  })

  it('should deselect when deselectOnReselect is true', () => {
    const selected = ref(['test'])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', true)
    expect(selected.value).toEqual([])
  })

  it('should not deselect when when deselectOnReselect is false', () => {
    const selected = ref(['test'])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', false)
    expect(selected.value).toEqual(['test'])
  })
})

// ----------------------------------------------------------------------------------------------------
// 📌 MultiSelect
// ----------------------------------------------------------------------------------------------------

describe('MultiSelect', () => {
  it('should handle selecting value', () => {
    const selected = ref(['test1'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.select('test2')
    expect(selected.value).toEqual(['test1', 'test2'])
  })

  it('should deselect a value', () => {
    const selected = ref(['test1', 'test2'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.deselect('test1')
    multiSelect.deselect('test3')
    expect(selected.value).toEqual(['test2'])
  })

  it('should deselect an already selected value', () => {
    const selected = ref(['test1', 'test2'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.select('test1')
    expect(selected.value).toEqual(['test2'])
  })

  it('should check if a value is selected', () => {
    const selected = ref(['test1', 'test2'])
    const multiSelect = new MultiSelect<string>(selected)

    expect(multiSelect.isSelected('test1')).toBe(true)
    expect(multiSelect.isSelected('test3')).toBe(false)
  })
})

// ----------------------------------------------------------------------------------------------------
// 📌 SelectionGroup
// ----------------------------------------------------------------------------------------------------

describe('SelectionGroup', () => {
  it('can be instantiated', () => {
    const value: string[] = []
    const group = useSelectionGroup(ref(value))
    expect(group).toBeDefined()
  })

  it('can be instantiated with default value', () => {
    const value = 1
    const group = useSelectionGroup(ref([value]))
    expect(group.selected.value).toEqual([value])
  })

  it('should select a value', () => {
    const value = 1
    const group = useSelectionGroup<number>(ref([]), {})
    group.select(value)
    expect(group.selected.value).toEqual([value])
  })

  it('should clear selected values', () => {
    const value = 1
    const group = useSelectionGroup(ref([value]))
    group.clearSelected()
    expect(group.selected.value).toEqual([])
  })

  it('should deselect a value if it is selected and deselection is true', () => {
    const value = 1
    const group = useSelectionGroup(ref([value]), { deselection: () => true })
    group.select(value)
    expect(group.selected.value).toEqual([])
  })

  it('should not deselect a value if it is selected and deselection is false', () => {
    const value = 1
    const group = useSelectionGroup(ref([value]), { deselection: () => false })
    group.select(value)
    expect(group.selected.value).toEqual([value])
  })

  it('can clear selected values even if it is already empty', () => {
    const value = 1
    const group = useSelectionGroup(ref([value]))
    group.clearSelected()
    expect(group.selected.value).toEqual([])
  })

  it('should deselect a value', () => {
    const value = 1
    const group = useSelectionGroup(ref([value]))
    group.deselect(value)
    expect(group.selected.value).toEqual([])
  })

  it('should clear selected when selection strategy changes', () => {
    const multiselect = ref(false)
    const value = 1
    const { selected, select } = useSelectionGroup(ref([value]), {
      multiselect: () => multiselect.value,
    })

    expect(selected.value).toEqual([value])

    // flush timing for watch is 'pre' so we need to deffer the test
    multiselect.value = true
    requestAnimationFrame(() => {
      expect(selected.value).toEqual([])
    })

    select(value)
    requestAnimationFrame(() => {
      expect(selected.value).toEqual([value])
    })

    multiselect.value = false
    requestAnimationFrame(() => {
      expect(selected.value).toEqual([])
    })
  })
})
