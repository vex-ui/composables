import { type Ref, ref } from 'vue'
import { useClickOutside } from '../click-outside'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// FIXME: jsdom has a lot of limitation when it comes to pointer events
// find an in browser test environment for these tests
describe.todo('useClickOutside', () => {
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
        <div style={{ padding: '20px' }}>
          {p.mounted.value && (
            <div style={{ width: '100px', height: '100px' }} el-inside ref={target}>
              target, active: {`${p.active.value}`}
            </div>
          )}
          <div style={{ width: '100px', height: '100px' }} el-outside>
            outside
          </div>
          <div style={{ width: '100px', height: '100px' }} el-ignore ref={ignore}>
            ignore
          </div>
        </div>
      )
    },
  }

  let active: Ref<boolean>
  let mounted: Ref<boolean>
  let callback: ReturnType<typeof vi.fn>
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    active = ref(true)
    mounted = ref(true)
    callback = vi.fn()
    wrapper = mount(component, { props: { callback, active, mounted } })
  })

  // ----------------------------------------------------------------------------------------------------

  it('should call the callback when a click happens outside the target', async () => {
    await wrapper.find('[el-outside]').trigger('click')
    expect(callback).toHaveBeenCalledOnce()
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens inside the target', async () => {
    await wrapper.find('[el-inside]').trigger('click')
    expect(callback).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens on an ignored element', async () => {
    await wrapper.find('[el-ignore]').trigger('click')
    expect(callback).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when the isActive option is set to false', async () => {
    active.value = false
    await wrapper.find('[el-outside]').trigger('click')
    expect(callback).not.toHaveBeenCalled()
  })

  // ----------------------------------------------------------------------------------------------------

  it('handles toggling isActive option', async () => {
    const outsideEl = wrapper.find('[el-outside]')

    await outsideEl.trigger('click')
    expect(callback).toHaveBeenCalledOnce()

    active.value = false
    await outsideEl.trigger('click')
    expect(callback).toHaveBeenCalledOnce()

    active.value = true
    await outsideEl.trigger('click')
    expect(callback).toHaveBeenCalledTimes(2)
  })

  // ----------------------------------------------------------------------------------------------------

  it('should not call the callback when the element is unmounted', async () => {
    mounted.value = false

    await wrapper.find('[el-outside]').trigger('click')
    expect(callback).not.toHaveBeenCalled()
  })
})
