import { describe, it, expect, vi } from 'vitest'
import { useEventListener } from '..'
import { effectScope } from 'vue'

const elements = [window, document, new HTMLElement()] as const

describe.each(elements)('useEventListener', (el) => {
  it('adds an event listener to target', () => {
    const addEventListenerSpy = vi.spyOn(el, 'addEventListener')
    useEventListener(el as any, 'click', () => {})
    expect(addEventListenerSpy).toHaveBeenCalledOnce()
  })

  it('adds multiple event listeners to target', () => {
    const addEventListenerSpy = vi.spyOn(el, 'addEventListener')
    useEventListener(el as any, 'click', () => {})
    useEventListener(el as any, 'click', () => {})
    useEventListener(el as any, 'pointerdown', () => {})
    expect(addEventListenerSpy).toHaveBeenCalledTimes(3)
  })

  // ----------------------------------------------------------------------------------------------------

  it('unregister the listener when the containing scope is disposed of', () => {
    const removeEventListenerSpy = vi.spyOn(el, 'removeEventListener')
    const scope = effectScope()
    scope.run(() => useEventListener(el as any, 'click', () => {}))
    scope.stop()
    expect(removeEventListenerSpy).toHaveBeenCalledOnce()
  })

  it('unregister the listener when cleanup function is called', () => {
    const removeEventListenerSpy = vi.spyOn(el, 'removeEventListener')
    const cleanup = useEventListener(el as any, 'click', () => {})
    cleanup()
    expect(removeEventListenerSpy).toHaveBeenCalledOnce()
  })

  // ----------------------------------------------------------------------------------------------------

  it('calls the callback listener when its event is triggered', () => {
    const callback = vi.fn()
    useEventListener(el as any, 'click', callback)
    el.dispatchEvent(new MouseEvent('click'))
    expect(callback).toHaveBeenCalledOnce()
  })

  it('does not call the callback listener when other events are triggered', () => {
    const callback = vi.fn()
    useEventListener(el as any, 'keydown', callback)
    el.dispatchEvent(new MouseEvent('click'))
    expect(callback).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------
})
