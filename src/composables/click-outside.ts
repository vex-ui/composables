import type { MaybeRefOrGetter, TemplateRef } from '@/types'
import { isClient, isIOS, noop, remove } from '@/utils'
import { onScopeDispose, toValue } from 'vue'

type Listener = (e: PointerEvent) => void

interface Options {
  ignore?: MaybeRefOrGetter<MaybeRefOrGetter<HTMLElement | null>[]>
  isActive?: MaybeRefOrGetter<boolean>
}

export function useClickOutside(target: TemplateRef, listener: Listener, options: Options = {}) {
  if (!isClient) return noop
  useIosWorkaround()

  const { ignore = [], isActive = true } = options

  const onPointerDown: Listener = (e) => {
    if (!toValue(isActive)) return

    const _target = toValue(target)
    if (!_target) return

    const path = e.composedPath()
    if (path.includes(_target)) return

    const shouldIgnore = toValue(ignore).some((templateRef) => {
      const el = toValue(templateRef)
      return el && path.includes(el)
    })

    if (!shouldIgnore) {
      listener(e)
    }
  }

  const unregister = addWindowEventListener(onPointerDown)

  onScopeDispose(unregister)
  return unregister
}

// See: https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
let isIOSWorkaroundActive = false
function useIosWorkaround() {
  if (!isIOSWorkaroundActive && isIOS) {
    isIOSWorkaroundActive = true
    Array.from(document.body.children).forEach((el) => el.addEventListener('click', noop))
  }
}

let isAttached = false
const listeners: Listener[] = []
const sharedListener = (e: PointerEvent) => {
  listeners.forEach((cb) => cb(e))
}

function addWindowEventListener(listener: Listener) {
  if (!listeners.includes(listener)) {
    listeners.push(listener)
  }

  if (!isAttached) {
    window.addEventListener('pointerdown', sharedListener, { capture: true })
    isAttached = true
  }

  return () => {
    remove(listeners, listener)
    if (!listeners.length) {
      window.removeEventListener('pointerdown', sharedListener, { capture: true })
      isAttached = false
    }
  }
}
