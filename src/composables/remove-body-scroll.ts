let isRemoved = false

export function useRemoveBodyScroll() {
  function removeBodyScroll(): void {
    if (isRemoved) return
    let scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.marginRight = `${scrollBarWidth}px`
    document.body.style.overflow = 'hidden'
    isRemoved = true
  }

  function returnBodyScroll(): void {
    if (!isRemoved) return
    document.body.style.marginRight = ''
    document.body.style.overflow = ''
    isRemoved = false
  }

  return {
    remove: removeBodyScroll,
    unRemove: returnBodyScroll,
  }
}
