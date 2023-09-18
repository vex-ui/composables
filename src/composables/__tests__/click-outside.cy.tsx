import { ref, type Ref } from 'vue'
import { useClickOutside } from '../click-outside'

describe('useClickOutside', { retries: 0 }, () => {
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
        <div style={{ padding: '20px' }} cy-wrapper>
          {p.mounted.value && (
            <div style={{ width: '100px', height: '100px' }} cy-target ref={target}>
              target, active: {`${p.active.value}`}
            </div>
          )}
          <div style={{ width: '100px', height: '100px' }} cy-outside>
            outside
          </div>
          <div style={{ width: '100px', height: '100px' }} cy-ignore ref={ignore}>
            ignore
          </div>
        </div>
      )
    },
  }

  let active: Ref<boolean>
  let mounted: Ref<boolean>
  let callback: ReturnType<typeof cy.stub>

  beforeEach(() => {
    active = ref(true)
    mounted = ref(true)
    callback = cy.stub()
    cy.mount(component, { props: { callback, active, mounted } })
  })

  afterEach(() => {})

  //----------------------------------------------------------------------------------------------------

  it('should call the callback when a click happens outside the target', () => {
    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('have.been.calledOnce')
  })

  //----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens inside the target', () => {
    cy.get('[cy-target]').click()
    cy.wrap(callback).should('not.have.been.called')
  })

  //----------------------------------------------------------------------------------------------------

  it('should not call the callback when a click happens on an element in the ignore list', () => {
    cy.get('[cy-ignore]').click()
    cy.wrap(callback).should('not.have.been.called')
  })

  //----------------------------------------------------------------------------------------------------

  it('should not call the callback when the isActive option is set to false', () => {
    active.value = false
    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('not.have.been.called')
  })

  //----------------------------------------------------------------------------------------------------

  it('handles toggling isActive option', () => {
    cy.get('[cy-outside]').click()
    cy.wrap(callback)
      .should('have.been.calledOnce')
      .then(() => {
        active.value = false
      })

    cy.get('[cy-outside]').click()
    cy.wrap(callback)
      .should('have.been.calledOnce')
      .then(() => {
        active.value = true
      })

    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('not.have.been.calledOnce')
  })

  //----------------------------------------------------------------------------------------------------

  it('should remove the event listener when the component is unmounted', () => {
    mounted.value = false
    cy.get('[cy-outside]').click()
    cy.wrap(callback).should('not.have.been.called')
  })
})
