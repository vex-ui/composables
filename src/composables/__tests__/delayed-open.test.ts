import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDelayedOpen } from '../delayed-open'

describe('Delayed Open', () => {
  let state: 'hide' | 'show' | undefined
  let show: () => void
  let hide: () => void

  beforeEach(() => {
    vi.useFakeTimers()
    state = undefined
    show = vi.fn(() => (state = 'show'))
    hide = vi.fn(() => (state = 'hide'))
  })

  afterEach(() => {
    vi.useRealTimers()
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
    const delayed = useDelayedOpen(show, hide, {
      defaultHideDelay: 0,
      defaultShowDelay: 0,
    })

    delayed.show()
    expect(state).toBe('show')

    delayed.hide()
    expect(state).toBe('hide')
  })

  it('invokes the callbacks async when delay is > 0', async () => {
    const delayed = useDelayedOpen(show, hide, {
      defaultHideDelay: 100,
      defaultShowDelay: 100,
    })

    delayed.show()
    expect(show).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(show).toHaveBeenCalledOnce()

    delayed.hide()
    expect(hide).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(hide).toHaveBeenCalledOnce()
  })
})
