import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDelayedOpen } from '../delayed-open'

describe('Delayed Open', () => {
  let state: 'hide' | 'show' | undefined
  let show: () => void
  let hide: () => void
  vi.useFakeTimers()

  beforeEach(() => {
    state = undefined
    show = vi.fn(() => (state = 'show'))
    hide = vi.fn(() => (state = 'hide'))
  })

  // ----------------------------------------------------------------------------------------------------

  it('does not throw an error when called', () => {
    expect(() => useDelayedOpen(show, hide)).not.toThrow()
  })

  // ----------------------------------------------------------------------------------------------------

  it('returns a delayed version of show & hide', () => {
    const delayed = useDelayedOpen(show, hide)

    expect(delayed.show).toBeInstanceOf(Function)
    expect(delayed.hide).toBeInstanceOf(Function)
  })

  // ----------------------------------------------------------------------------------------------------

  it('invokes the callbacks sync when delay is 0', () => {
    const delayed = useDelayedOpen(show, hide, {
      defaultHideDelay: 0,
      defaultShowDelay: 0,
    })

    // we don't need to await the callback because its sync
    delayed.show()
    expect(state).toBe('show')

    delayed.hide()
    expect(state).toBe('hide')
  })

  // ----------------------------------------------------------------------------------------------------

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

  // ----------------------------------------------------------------------------------------------------

  it('overrides the default timer when another one is given', async () => {
    const delayed = useDelayedOpen(show, hide, {
      defaultHideDelay: 100,
      defaultShowDelay: 100,
    })

    delayed.show(200)
    vi.advanceTimersByTime(100)
    expect(show).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(show).toHaveBeenCalledOnce()

    delayed.hide(200)
    vi.advanceTimersByTime(100)
    expect(hide).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(hide).toHaveBeenCalledOnce()
  })
})
