let isHidden = false

export function useBodyScrollbar() {
  const hide = () => {
    if (isHidden) return

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.marginRight = `${scrollBarWidth}px`
    document.body.style.overflow = 'hidden'
    isHidden = true
  }

  const show = () => {
    if (!isHidden) return

    document.body.style.marginRight = ''
    document.body.style.overflow = ''
    isHidden = false
  }

  return {
    hide,
    show,
  }
}
