import { type Ref, ref, nextTick } from 'vue'
import { useClickOutside } from '../click-outside'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'

describe('useClickOutside', () => {
  const component = {
    props: ['callback', 'active', 'mounted'],
    setup(p: any) {
      const target = ref()
      const ignore = ref()

      useClickOutside(target, p.callback, {
        isActive: () => p.active.value,
        ignore: [ignore],
      })

      return () => (
        <div>
          <div>outside</div>
          {p.mounted.value && <div ref={target}>inside</div>}
          <div ref={ignore}>ignore</div>
        </div>
      )
    },
  }

  let active: Ref<boolean>
  let mounted: Ref<boolean>
  let callback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    active = ref(true)
    mounted = ref(true)
    callback = vi.fn()
    render(component, { props: { callback, active, mounted } })
  })

  // ----------------------------------------------------------------------------------------------------

  it('should call the callback when a click happens outside the target', async () => {
    const outside = screen.getByText('outside')
    await fireEvent.pointerDown(outside)
    expect(callback).toHaveBeenCalledOnce()
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens inside the target', async () => {
    const inside = screen.getByText('inside')
    await fireEvent.pointerDown(inside)
    expect(callback).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens on an ignored element', async () => {
    const ignore = screen.getByText('ignore')
    await fireEvent.pointerDown(ignore)
    expect(callback).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when the isActive option is set to false', async () => {
    active.value = false
    const outside = screen.getByText('outside')
    await fireEvent.pointerDown(outside)
    expect(callback).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------

  it('handles toggling isActive option', async () => {
    const outside = screen.getByText('outside')
    await fireEvent.pointerDown(outside)
    expect(callback).toHaveBeenCalledOnce()

    active.value = false
    await fireEvent.pointerDown(outside)
    expect(callback).toHaveBeenCalledOnce()

    active.value = true
    await fireEvent.pointerDown(outside)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when the element is unmounted', async () => {
    mounted.value = false
    await nextTick()

    const outside = screen.getByText('outside')
    await fireEvent.pointerDown(outside)
    expect(callback).not.toHaveBeenCalled()
  })
})
