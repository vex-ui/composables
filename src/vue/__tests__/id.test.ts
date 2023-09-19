import { it, expect, describe } from 'vitest'
import { useID } from '../id'

describe('useID', () => {
  it('returns an id string when called', () => {
    const id = useID()
    expect(id).toBeTypeOf('string')
  })

  // ----------------------------------------------------------------------------------------------------

  it('returns a unique id for every call', () => {
    const ids = []
    for (let i = 0; i < 100; i++) {
      ids.push(useID())
    }
    expect(ids.length).toBe(new Set(ids).size)
  })

  // ----------------------------------------------------------------------------------------------------

  it('returns a namespaced id when a namespace is given', () => {
    const ns = 'rem-is-best-girl'
    const id = useID(ns)
    expect(id).toContain(ns)
  })

  // ----------------------------------------------------------------------------------------------------

  it('returns a unique namespaced id for every call when a namespace is given', () => {
    const ns = 'rem-is-best-girl'
    const ids = []
    for (let i = 0; i < 100; i++) {
      ids.push(useID(ns))
    }
    expect(ids.length).toBe(new Set(ids).size)
    ids.forEach((id) => {
      expect(id).toContain(ns)
    })
  })
})
