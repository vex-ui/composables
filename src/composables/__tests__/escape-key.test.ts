import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import { useEscapeKey } from '..'

describe('useEscapeKey', () => {
  let callback1: ReturnType<typeof vi.fn>
  let callback2: ReturnType<typeof vi.fn>

  beforeEach(() => {
    callback1 = vi.fn()
    callback2 = vi.fn()
  })

  it('invoke the callback when escape key is pressed', async () => {
    useEscapeKey(callback1)

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(callback1).toHaveBeenCalledOnce()

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(callback1).toHaveBeenCalledTimes(2)
  })

  // ----------------------------------------------------------------------------------------------------

  it('does not invoke the callback when other keys are pressed', async () => {
    useEscapeKey(callback1)
    await fireEvent.keyDown(document, { key: 'Enter' })
    expect(callback1).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------

  it('handles multiple callbacks', async () => {
    useEscapeKey(callback1)
    useEscapeKey(callback2)

    await fireEvent.keyDown(document, { key: 'Escape' })

    expect(callback1).toHaveBeenCalledOnce()
    expect(callback2).toHaveBeenCalledOnce()
  })

  // ----------------------------------------------------------------------------------------------------

  it('cleanup function removes callback', async () => {
    const cleanup = useEscapeKey(callback1)

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(callback1).toHaveBeenCalledOnce()

    cleanup()
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(callback1).toHaveBeenCalledOnce()
  })

  // ----------------------------------------------------------------------------------------------------

  it('cleanup function only removes its callback', async () => {
    const cleanup1 = useEscapeKey(callback1)
    const cleanup2 = useEscapeKey(callback2)

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(callback1).toHaveBeenCalledOnce()
    expect(callback2).toHaveBeenCalledOnce()

    cleanup1()
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(callback1).toHaveBeenCalledOnce()
    expect(callback2).toHaveBeenCalledTimes(2)

    cleanup2()
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(callback1).toHaveBeenCalledOnce()
    expect(callback2).toHaveBeenCalledTimes(2)
  })
})
