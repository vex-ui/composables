import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDelayedOpen } from '../delayed-open'

describe('Delayed Open', () => {
  let state: 'hide' | 'show' | undefined
  let show: () => void
  let hide: () => void

  beforeEach(() => {
    state = undefined
    show = vi.fn(() => (state = 'show'))
    hide = vi.fn(() => (state = 'hide'))
  })

  it('does not throw an error when called', () => {
    expect(() => useDelayedOpen(show, hide)).to.not.Throw()
  })

  it('returns a delayed version of show & hide', () => {
    const delayed = useDelayedOpen(show, hide)

    expect(delayed).toHaveProperty('show')
    expect(delayed).toHaveProperty('hide')
  })

  it('invokes the callbacks sync when delay is 0', () => {
    const delayed = useDelayedOpen(show, hide, { defaultHideDelay: 0, defaultShowDelay: 0 })

    delayed.show()
    expect(state).toBe('show')

    delayed.hide()
    expect(state).toBe('hide')
  })

  it('invokes the callbacks async when delay is > 0', async () => {
    const delayed = useDelayedOpen(show, hide, { defaultHideDelay: 1, defaultShowDelay: 1 })

    delayed.show()
    // show is async so its callback is not yet called
    vi.useFakeTimers()
    expect(state).toBeUndefined()
    vi.runAllTimers()
    expect(state).toBe('show')

    delayed.hide()
    expect(state).toBe('show')
    await vi.runAllTimersAsync()
    expect(state).toBe('hide')
  })
})
